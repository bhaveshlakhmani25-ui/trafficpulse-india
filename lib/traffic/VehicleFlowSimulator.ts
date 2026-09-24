import { MobilityState, TrafficSegment } from '../mobility/types';
import { TrafficVehicle, TrafficDensityProfile, VehicleType } from './types';
import { PROFILES } from './trafficSimulationProfiles';

export type GeoJSONFeatureCollection = any;

const MAX_VISUAL_VEHICLES_PER_SEGMENT = 100; // Visualization budget
const SEED_CONSTANT = 12345;

export class VehicleFlowSimulator {
  private vehicles: TrafficVehicle[] = [];
  private state: MobilityState | null = null;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private tickRateMs = 1000 / 30; // ~30 updates per sec
  
  private onTickCallback: ((data: GeoJSONFeatureCollection) => void) | null = null;

  constructor() {}

  public setMobilityState(state: MobilityState) {
    // If the city changed, clear everything
    if (this.state && this.state.cityId !== state.cityId) {
      this.vehicles = [];
    }
    
    this.state = state;
    this.reconcileVehicles();
  }

  public onTick(cb: (data: GeoJSONFeatureCollection) => void) {
    this.onTickCallback = cb;
  }

  public start() {
    if (!this.animationFrameId) {
      this.lastTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public reset() {
    this.stop();
    this.vehicles = [];
    this.state = null;
    this.emit();
  }

  // Deterministic PRNG
  private seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  private loop = (time: number) => {
    const dt = time - this.lastTime;
    this.lastTime = time;
    this.accumulator += dt;

    if (this.accumulator >= this.tickRateMs) {
      // Step simulation by actual elapsed time but capped to avoid huge jumps
      const simDt = Math.min(this.accumulator / 1000.0, 0.1);
      this.updateVehicles(simDt);
      this.emit();
      this.accumulator = 0;
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private getProfileForSegment(segment: TrafficSegment): TrafficDensityProfile {
    let profile: TrafficDensityProfile = 'FREE_FLOW';
    const stateStr = segment.trafficState.toLowerCase();
    
    if (stateStr === 'severe') profile = 'SEVERE';
    else if (stateStr === 'heavy' || stateStr === 'congested') profile = 'HEAVY';
    else if (stateStr === 'moderate') profile = 'MODERATE';
    
    // Factor in forecast
    if (this.state && this.state.forecasts) {
      const forecast = this.state.forecasts.find(f => f.segmentId === segment.id);
      if (forecast && forecast.predictedState === 'severe' && profile === 'MODERATE') {
         profile = 'HEAVY'; // transition
      }
    }
    
    return profile;
  }

  private reconcileVehicles() {
    if (!this.state) return;

    const segments = this.state.segments;
    
    // Sort segments to prioritize congested ones or major roads for visualization,
    // so if we hit the global cap, the most important traffic is shown.
    const sortedSegments = [...segments].sort((a, b) => {
      const scoreA = (a.trafficState === 'severe' ? 100 : a.trafficState === 'congested' ? 50 : 0) + a.laneCount;
      const scoreB = (b.trafficState === 'severe' ? 100 : b.trafficState === 'congested' ? 50 : 0) + b.laneCount;
      return scoreB - scoreA;
    });

    const GLOBAL_MAX_VEHICLES = 2000;
    let currentGlobalCount = 0;
    
    // Track segments we actually process
    const processedSegmentIds = new Set<string>();
    
    for (const segment of sortedSegments) {
      if (currentGlobalCount >= GLOBAL_MAX_VEHICLES) break;
      processedSegmentIds.add(segment.id);
      
      // Population = density * length * lanes
      const population = Math.floor(segment.estimatedDensityVehPerKmPerLane * segment.lengthKm * segment.laneCount);
      
      // Representative visualization sample
      let visualSample = population;
      if (visualSample > MAX_VISUAL_VEHICLES_PER_SEGMENT) {
        visualSample = MAX_VISUAL_VEHICLES_PER_SEGMENT;
      }
      
      // Ensure we don't exceed global cap with this segment
      if (currentGlobalCount + visualSample > GLOBAL_MAX_VEHICLES) {
        visualSample = GLOBAL_MAX_VEHICLES - currentGlobalCount;
      }
      currentGlobalCount += visualSample;
      
      const existingVehicles = this.vehicles.filter(v => v.segmentId === segment.id);
      
      if (existingVehicles.length < visualSample) {
        const toAdd = visualSample - existingVehicles.length;
        for (let i = 0; i < toAdd; i++) {
          const newVeh = this.createVehicle(segment, existingVehicles.length + i);
          this.vehicles.push(newVeh);
        }
      } else if (existingVehicles.length > visualSample) {
        const toRemove = existingVehicles.length - visualSample;
        for (let i = 0; i < toRemove; i++) {
          const idx = this.vehicles.findIndex(v => v.segmentId === segment.id);
          if (idx > -1) this.vehicles.splice(idx, 1);
        }
      }
    }
    
    // Clean up vehicles on segments we couldn't budget for
    this.vehicles = this.vehicles.filter(v => processedSegmentIds.has(v.segmentId));
  }

  private createVehicle(segment: TrafficSegment, index: number): TrafficVehicle {
    const types: VehicleType[] = ['car', 'car', 'car', 'taxi', 'bus', 'truck'];
    
    // Deterministic random based on segment id and index
    const seedStr = segment.id + index.toString();
    let seedNum = 0;
    for (let i = 0; i < seedStr.length; i++) seedNum += seedStr.charCodeAt(i);
    
    const typeIdx = Math.floor(this.seededRandom(seedNum) * types.length);
    const type = types[typeIdx];
    
    // Initial progress deterministic
    const progress = this.seededRandom(seedNum + 1);
    
    // Assign lane
    const laneIndex = Math.floor(this.seededRandom(seedNum + 2) * segment.laneCount);
    
    const coordData = this.interpolateCoordinate(segment.coordinates, progress, laneIndex, segment.laneCount);

    return {
      id: `veh-${segment.id}-${index}`,
      segmentId: segment.id,
      laneIndex,
      progress,
      speedKmh: segment.currentSpeedKmh,
      targetSpeedKmh: segment.currentSpeedKmh,
      heading: coordData.heading,
      direction: segment.direction,
      vehicleType: type,
      state: 'moving',
      provenance: 'DEMO_SIMULATION',
      dataClass: 'PREDICTED',
      sourceType: 'simulation',
      coordinates: coordData.coordinate
    };
  }

  private updateVehicles(dt: number) {
    if (!this.state) return;

    // Group vehicles by segment and lane for car-following model
    const vehiclesBySegmentAndLane: Record<string, TrafficVehicle[]> = {};
    for (const v of this.vehicles) {
      const key = `${v.segmentId}-${v.laneIndex}`;
      if (!vehiclesBySegmentAndLane[key]) vehiclesBySegmentAndLane[key] = [];
      vehiclesBySegmentAndLane[key].push(v);
    }
    
    // Sort each lane by progress descending (furthest ahead first)
    for (const key in vehiclesBySegmentAndLane) {
      vehiclesBySegmentAndLane[key].sort((a, b) => b.progress - a.progress);
    }

    for (const v of this.vehicles) {
      const segment = this.state.segments.find(s => s.id === v.segmentId);
      if (!segment) continue;

      const profileType = this.getProfileForSegment(segment);
      const profile = PROFILES[profileType];
      
      v.targetSpeedKmh = segment.currentSpeedKmh;

      // Find vehicle ahead
      const key = `${v.segmentId}-${v.laneIndex}`;
      const laneVehicles = vehiclesBySegmentAndLane[key];
      const myIdx = laneVehicles.findIndex(veh => veh.id === v.id);
      
      let distanceToAhead = Infinity;
      let speedOfAheadMs = Infinity;
      
      const segmentLengthMeters = segment.lengthKm * 1000;
      
      if (myIdx > 0) {
        const ahead = laneVehicles[myIdx - 1];
        // Calculate distance in meters
        distanceToAhead = (ahead.progress - v.progress) * segmentLengthMeters;
        speedOfAheadMs = (ahead.speedKmh * 1000) / 3600;
      }
      
      const currentSpeedMs = (v.speedKmh * 1000) / 3600;
      const targetSpeedMs = (v.targetSpeedKmh * 1000) / 3600;
      
      // Car-following logic
      const safeDistance = 5 + (currentSpeedMs * profile.safeTimeHeadway);
      
      let accelerationMs2 = 0;
      
      if (distanceToAhead < safeDistance) {
        // Need to decelerate
        // Match speed or slow down more if very close
        if (distanceToAhead < 2) {
          accelerationMs2 = -profile.deceleration * 2; // Hard brake
        } else {
          const speedDiff = currentSpeedMs - speedOfAheadMs;
          if (speedDiff > 0) {
             accelerationMs2 = -profile.deceleration;
          } else {
             // Slowly match
             accelerationMs2 = (speedOfAheadMs - currentSpeedMs);
          }
        }
      } else {
        // Free to accelerate toward target
        if (currentSpeedMs < targetSpeedMs) {
          accelerationMs2 = profile.acceleration;
        } else if (currentSpeedMs > targetSpeedMs) {
          accelerationMs2 = -profile.deceleration;
        }
      }
      
      // Apply acceleration
      let newSpeedMs = currentSpeedMs + (accelerationMs2 * dt);
      newSpeedMs = Math.max(0, newSpeedMs); // No reversing
      
      v.speedKmh = (newSpeedMs * 3600) / 1000;
      
      if (v.speedKmh < 1) v.state = 'stopped';
      else if (v.speedKmh < 15) v.state = 'slow';
      else v.state = 'moving';

      // Move vehicle
      const distanceMoved = newSpeedMs * dt;
      v.progress += distanceMoved / segmentLengthMeters;
      
      // Loop around
      if (v.progress > 1.0) {
        v.progress = 0; // In a full network, would move to next segment
      }

      // Recompute coordinate with lane offset
      const coordData = this.interpolateCoordinate(segment.coordinates, v.progress, v.laneIndex, segment.laneCount);
      v.coordinates = coordData.coordinate;
      
      if (distanceMoved > 0) {
        v.heading = coordData.heading;
      }
    }
  }

  private emit() {
    if (this.onTickCallback) {
      const geojson = {
        type: 'FeatureCollection',
        features: this.vehicles.map(v => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: v.coordinates
          },
          properties: {
            id: v.id,
            type: v.vehicleType,
            heading: v.heading,
            state: v.state
          }
        }))
      };
      this.onTickCallback(geojson);
    }
  }

  // ---- Geometry Utils ----

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

  private interpolateCoordinate(coords: [number, number][], progress: number, laneIndex: number, laneCount: number): { coordinate: [number, number], heading: number } {
    if (coords.length < 2) return { coordinate: coords[0] || [0,0], heading: 0 };
    
    progress = Math.max(0, Math.min(1, progress));
    const totalLength = this.getLineStringLength(coords);
    const targetDistance = totalLength * progress;
    
    let currentDistance = 0;
    let baseCoord: [number, number] = [0,0];
    let heading = 0;
    
    for (let i = 0; i < coords.length - 1; i++) {
      const segmentDist = this.getDistance(coords[i], coords[i+1]);
      if (currentDistance + segmentDist >= targetDistance) {
        const remainingDist = targetDistance - currentDistance;
        const ratio = segmentDist === 0 ? 0 : remainingDist / segmentDist;
        
        const lon = coords[i][0] + (coords[i+1][0] - coords[i][0]) * ratio;
        const lat = coords[i][1] + (coords[i+1][1] - coords[i][1]) * ratio;
        baseCoord = [lon, lat];
        heading = this.calculateHeading(coords[i], coords[i+1]);
        break;
      }
      currentDistance += segmentDist;
    }
    
    if (baseCoord[0] === 0) {
      baseCoord = coords[coords.length - 1];
      heading = this.calculateHeading(coords[coords.length-2], coords[coords.length-1]);
    }
    
    // Apply lateral offset for lanes (very small degree offset, ~3 meters per lane)
    // 1 degree latitude ~ 111,320 meters
    const LANE_WIDTH_DEGREES = 3.0 / 111320; 
    
    // Center the lanes around 0
    const offsetIndex = laneIndex - ((laneCount - 1) / 2);
    const offsetMagnitude = offsetIndex * LANE_WIDTH_DEGREES;
    
    // Perpendicular to heading
    const perpAngle = (heading + 90) * (Math.PI / 180);
    const offsetLon = offsetMagnitude * Math.cos(perpAngle) / Math.cos(baseCoord[1] * Math.PI / 180);
    const offsetLat = offsetMagnitude * Math.sin(perpAngle);
    
    return {
      coordinate: [baseCoord[0] + offsetLon, baseCoord[1] - offsetLat], // subtract lat depending on mapbox coord system
      heading
    };
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
}
