import { TrafficDensityProfile, TrafficSimulationProfile } from './types';

export const PROFILES: Record<TrafficDensityProfile, TrafficSimulationProfile> = {
  FREE_FLOW: {
    densityRange: [5, 15], // vehicles per km per lane
    speedFactor: 1.0,
    spacing: 1.5,
    acceleration: 2.0,
    deceleration: 1.5,
    safeTimeHeadway: 2.5
  },
  MODERATE: {
    densityRange: [15, 35],
    speedFactor: 0.75,
    spacing: 1.0,
    acceleration: 1.5,
    deceleration: 2.0,
    safeTimeHeadway: 2.0
  },
  HEAVY: {
    densityRange: [35, 60],
    speedFactor: 0.4,
    spacing: 0.7,
    acceleration: 1.0,
    deceleration: 3.0,
    safeTimeHeadway: 1.5
  },
  SEVERE: {
    densityRange: [60, 100],
    speedFactor: 0.15,
    spacing: 0.4,
    acceleration: 0.5,
    deceleration: 4.0,
    safeTimeHeadway: 1.0
  }
};
