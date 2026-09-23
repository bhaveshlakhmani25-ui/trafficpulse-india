import { DataClass, Provenance, SourceType } from '../mobility/types';

export type VehicleType = 'car' | 'taxi' | 'bus' | 'truck';

export interface TrafficVehicle {
  id: string;
  segmentId: string;
  laneIndex: number;
  progress: number; // 0.0 to 1.0 along the segment
  speedKmh: number;
  targetSpeedKmh: number;
  heading: number; // 0 to 360
  direction: 'forward' | 'backward';
  vehicleType: VehicleType;
  state: 'moving' | 'stopped' | 'slow';
  provenance: Provenance;
  dataClass: DataClass;
  sourceType: SourceType;
  // Computed coordinate based on progress
  coordinates: [number, number];
}

export type TrafficDensityProfile = 'FREE_FLOW' | 'MODERATE' | 'HEAVY' | 'SEVERE';

export interface TrafficSimulationProfile {
  densityRange: [number, number]; // vehicles per km per lane [min, max]
  speedFactor: number; // multiplier for free flow speed
  spacing: number; // visual spacing modifier
  acceleration: number;
  deceleration: number;
  safeTimeHeadway: number; // seconds
}
