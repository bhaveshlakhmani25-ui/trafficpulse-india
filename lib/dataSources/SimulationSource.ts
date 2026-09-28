import { 
  TrafficSegment, Incident, TrafficIntelligenceNode, 
  Camera, RoadCondition, Route, WeatherImpact
} from '../mobility/types';
import { TrafficSource, IncidentSource, CheckpointSource, CameraSource, RoadConditionSource, WeatherSource, HistoricalRiskSource } from './interfaces';

import { getBengaluruSimulation } from '../simulation/cities/bengaluru';
import { getDelhiSimulation } from '../simulation/cities/delhi';
import { getFallbackSimulation } from '../simulation/cities/default';
import { getMumbaiSimulation } from '../simulation/cities/mumbai';

export class SimulationSource implements TrafficSource, IncidentSource, CheckpointSource, CameraSource, RoadConditionSource, WeatherSource, HistoricalRiskSource {
  
  private static segmentCache: Map<string, TrafficSegment[]> = new Map();
  private static activeRequest: AbortController | null = null;
  
  private getSimulationData(cityId: string) {
    if (cityId === 'bengaluru') return getBengaluruSimulation();
    if (cityId === 'delhi') return getDelhiSimulation();
    if (cityId === 'mumbai') return getMumbaiSimulation();
    return getFallbackSimulation(cityId);
  }

  async getSegments(cityId: string): Promise<TrafficSegment[]> {
    if (SimulationSource.segmentCache.has(cityId)) {
      return SimulationSource.segmentCache.get(cityId)!;
    }
    
    if (SimulationSource.activeRequest) {
      SimulationSource.activeRequest.abort();
    }
    
    const abortController = new AbortController();
    SimulationSource.activeRequest = abortController;
    
    try {
      if (typeof window === 'undefined') {
        // Skip relative fetching during SSR/build, fallback to built-in simulation data
        return this.getSimulationData(cityId).segments;
      }
      const response = await fetch(`/data/cities/${cityId}-roads.json`, { 
        signal: abortController.signal 
      });
      if (!response.ok) {
        console.warn(`Failed to fetch ${cityId} road network, falling back...`);
        return this.getSimulationData(cityId).segments;
      }
      const rawSegments = await response.json();
      
      const processedSegments = rawSegments.map((seg: any) => {
        // Deterministic seeding based on segment ID
        const idNum = parseInt(seg.id.replace(/\D/g, '')) || 0;
        let trafficState: 'free-flow' | 'moderate' | 'congested' | 'severe' = 'free-flow';
        const freeFlow = seg.freeFlowSpeedKmh || 40;
        let currentSpeed = freeFlow;
        let trend: 'improving' | 'stable' | 'worsening' = 'stable';
        
        const mod = idNum % 100;
        if (mod < 10) {
          trafficState = 'severe';
          currentSpeed = freeFlow * 0.2;
          trend = 'worsening';
        } else if (mod < 25) {
          trafficState = 'congested';
          currentSpeed = freeFlow * 0.5;
        } else if (mod < 50) {
          trafficState = 'moderate';
          currentSpeed = freeFlow * 0.8;
        }
        
        const laneCount = seg.laneCount || 1;
        // q = k * v => k = q / v
        // capacity is roughly 25 * freeFlow * lanes
        const capacity = Math.floor(freeFlow * laneCount * 25);
        let density = 10;
        if (trafficState === 'severe') density = 80;
        else if (trafficState === 'congested') density = 50;
        else if (trafficState === 'moderate') density = 25;
        
        return {
          ...seg,
          sourceType: 'simulation',
          provenance: 'CITY_SIMULATION',
          dataClass: 'SIMULATED',
          trafficState,
          currentSpeedKmh: currentSpeed,
          trend,
          estimatedDensityVehPerKmPerLane: density,
          estimatedFlowVehPerHour: Math.floor(density * currentSpeed * laneCount),
          direction: idNum % 2 === 0 ? 'forward' : 'backward',
          timestamp: new Date().toISOString()
        } as TrafficSegment;
      });
      
      SimulationSource.segmentCache.set(cityId, processedSegments);
      return processedSegments;
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log(`Fetch aborted for ${cityId}`);
        return [];
      }
      console.warn(`Error fetching ${cityId} road network:`, e);
      return this.getSimulationData(cityId).segments;
    }
  }

  async getActiveIncidents(cityId: string): Promise<Incident[]> {
    return []; // We return empty here, the demo injects an incident manually
  }

  async getNodes(cityId: string): Promise<TrafficIntelligenceNode[]> {
    return this.getSimulationData(cityId).nodes;
  }

  async getCameras(cityId: string): Promise<Camera[]> {
    return this.getSimulationData(cityId).cameras;
  }

  async getConditions(cityId: string): Promise<RoadCondition[]> {
    return this.getSimulationData(cityId).conditions;
  }

  async getCurrentWeather(cityId: string): Promise<WeatherImpact> {
    return this.getSimulationData(cityId).weather;
  }

  async getHistoricalRisk(roadId: string): Promise<number> {
    return 30; // base historical risk
  }

  // Helper method for demo state injection
  getDemoIncident(cityId: string): Incident {
    return this.getSimulationData(cityId).demoIncident;
  }

  getDemoRoutes(cityId: string): Route[] {
    return this.getSimulationData(cityId).routes;
  }
}
