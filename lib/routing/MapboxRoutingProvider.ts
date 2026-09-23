import { RoutingProvider } from './RoutingProvider';
import { Route } from '../mobility/types';
import { SimulationRoutingProvider } from './SimulationRoutingProvider';
import { scoreRoute } from './scoreRoute';

export class MapboxRoutingProvider implements RoutingProvider {
  private fallbackProvider = new SimulationRoutingProvider();

  async getRoutes(origin: [number, number], destination: [number, number]): Promise<Route[]> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    if (!token) {
      console.warn('Mapbox token missing. Falling back to SimulationRoutingProvider.');
      return this.fallbackProvider.getRoutes(origin, destination);
    }

    try {
      // Primary: driving-traffic
      return await this.fetchMapboxRoutes('driving-traffic', origin, destination, token);
    } catch (err) {
      console.warn('Mapbox driving-traffic routing failed, trying driving fallback.', err);
      
      try {
        // Fallback: driving
        return await this.fetchMapboxRoutes('driving', origin, destination, token);
      } catch (err2) {
        console.warn('Mapbox driving fallback failed, falling back to simulation.', err2);
        return this.fallbackProvider.getRoutes(origin, destination);
      }
    }
  }

  private async fetchMapboxRoutes(profile: 'driving-traffic' | 'driving', origin: [number, number], destination: [number, number], token: string): Promise<Route[]> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=true&overview=full&steps=true&annotations=speed,duration,congestion,congestion_numeric&geometries=geojson&access_token=${token}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error (${profile}): ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No routes found');
    }

    return data.routes.map((r: any, idx: number): Route => {
      // When duration_typical is provided, we can calculate actual traffic delay
      const baseTime = r.duration_typical || r.duration; // Use typical as base if available
      const trafficDelay = r.duration_typical ? Math.max(0, r.duration - r.duration_typical) : 0;
      const distance = r.distance;
      
      const route: Route = {
        id: `mapbox-route-${idx}`,
        name: idx === 0 ? 'Primary Route (Mapbox)' : `Alternative Route ${idx} (Mapbox)`,
        geometry: r.geometry.coordinates,
        baseTimeSeconds: baseTime,
        distanceMeters: distance,
        congestionPenalty: trafficDelay, 
        incidentPenalty: 0,
        forecastPenalty: 0,
        overallCost: baseTime + trafficDelay, // Initial cost before intelligence engine modifies it
        hasAlternatives: data.routes.length > 1,
        sourceType: 'mapbox',
        provenance: 'MAPBOX_DIRECTIONS_API',
        dataClass: 'OBSERVED'
      };

      return scoreRoute(route);
    });
  }
}
