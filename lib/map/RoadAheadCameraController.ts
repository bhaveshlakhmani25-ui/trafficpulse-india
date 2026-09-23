import mapboxgl from 'mapbox-gl';

export class RoadAheadCameraController {
  private map: mapboxgl.Map;

  private demoFrameId: number | null = null;
  private demoProgress: number = 0;
  private demoRouteGeometry: [number, number][] = [];
  private lastTime: number = 0;
  
  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  public resetToCityView(centerCoordinates: [number, number], initialZoom: number) {
    this.map.easeTo({
      center: centerCoordinates,
      zoom: initialZoom,
      pitch: 0,
      bearing: 0,
      duration: 2000
    });
  }

  public followRoute(routeGeometry: [number, number][]) {
    if (routeGeometry.length === 0) return;
    
    // Calculate bounding box of route
    const bounds = new mapboxgl.LngLatBounds(routeGeometry[0], routeGeometry[0]);
    for (const coord of routeGeometry) {
      bounds.extend(coord);
    }
    
    this.map.fitBounds(bounds, {
      padding: { top: 150, bottom: 150, left: 150, right: 150 },
      pitch: 60,
      duration: 3000
    });
  }

  public focusIncident(location: [number, number]) {
    this.map.easeTo({
      center: location,
      zoom: 15,
      pitch: 65,
      bearing: -20,
      duration: 2000
    });
  }

  public focusCheckpoint(location: [number, number]) {
    this.map.easeTo({
      center: location,
      zoom: 16,
      pitch: 60,
      bearing: 15,
      duration: 2000
    });
  }

  public focusCamera(location: [number, number]) {
    this.map.easeTo({
      center: location,
      zoom: 16.5,
      pitch: 60,
      bearing: -15,
      duration: 2000
    });
  }

  public focusHotspot(location: [number, number]) {
    this.stopDemoDrive();
    this.map.easeTo({
      center: location,
      zoom: 14.5,
      pitch: 45,
      bearing: 0,
      duration: 2000
    });
  }

  public startDemoDrive(routeGeometry: [number, number][]) {
    this.stopDemoDrive();
    if (routeGeometry.length < 2) return;
    this.demoRouteGeometry = routeGeometry;
    this.demoProgress = 0;
    this.lastTime = performance.now();
    this.demoFrameId = requestAnimationFrame(this.demoLoop);
  }

  public stopDemoDrive() {
    if (this.demoFrameId) {
      cancelAnimationFrame(this.demoFrameId);
      this.demoFrameId = null;
    }
  }

  private demoLoop = (time: number) => {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    
    // speed roughly 1% of the route per second for demo purposes (adjust as needed)
    this.demoProgress += (dt * 0.015);
    if (this.demoProgress > 1.0) this.demoProgress = 0; // loop

    const data = this.interpolateCoordinate(this.demoRouteGeometry, this.demoProgress);
    
    this.map.easeTo({
      center: data.coordinate,
      zoom: 17,
      pitch: 75,
      bearing: data.heading,
      duration: 0, // Instant update for rAF
    });

    this.demoFrameId = requestAnimationFrame(this.demoLoop);
  }

  private getDistance(c1: [number, number], c2: [number, number]): number {
    const R = 6371e3;
    const lat1 = (c1[1] * Math.PI) / 180;
    const lat2 = (c2[1] * Math.PI) / 180;
    const deltaLat = ((c2[1] - c1[1]) * Math.PI) / 180;
    const deltaLon = ((c2[0] - c1[0]) * Math.PI) / 180;
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private getLineStringLength(coords: [number, number][]): number {
    let len = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      len += this.getDistance(coords[i], coords[i+1]);
    }
    return len;
  }

  private calculateHeading(c1: [number, number], c2: [number, number]): number {
    const lat1 = (c1[1] * Math.PI) / 180;
    const lat2 = (c2[1] * Math.PI) / 180;
    const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    return (brng + 360) % 360;
  }

  private interpolateCoordinate(coords: [number, number][], progress: number): { coordinate: [number, number], heading: number } {
    if (coords.length < 2) return { coordinate: coords[0] || [0,0], heading: 0 };
    progress = Math.max(0, Math.min(1, progress));
    const totalLength = this.getLineStringLength(coords);
    const targetDistance = totalLength * progress;
    let currentDistance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const segmentDist = this.getDistance(coords[i], coords[i+1]);
      if (currentDistance + segmentDist >= targetDistance) {
        const remainingDist = targetDistance - currentDistance;
        const ratio = segmentDist === 0 ? 0 : remainingDist / segmentDist;
        const lon = coords[i][0] + (coords[i+1][0] - coords[i][0]) * ratio;
        const lat = coords[i][1] + (coords[i+1][1] - coords[i][1]) * ratio;
        const heading = this.calculateHeading(coords[i], coords[i+1]);
        return { coordinate: [lon, lat], heading };
      }
      currentDistance += segmentDist;
    }
    return { 
      coordinate: coords[coords.length - 1], 
      heading: this.calculateHeading(coords[coords.length-2], coords[coords.length-1])
    };
  }
}
