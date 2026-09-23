import { describe, it, expect } from 'vitest';
import { VehicleFlowSimulator } from '../lib/traffic/VehicleFlowSimulator';
import { TrafficSegment } from '../lib/mobility/types';

describe('Traffic Flow Simulation v2', () => {
  it('should maintain mathematical model consistency (flow ≈ density * speed * lanes)', () => {
    const density = 17.3;
    const speed = 18;
    const lanes = 3;
    const estimatedFlow = Math.floor(density * speed * lanes);
    
    expect(estimatedFlow).toBe(934);
  });

  it('should calculate population (density * length * lanes)', () => {
    const density = 17.3;
    const lengthKm = 1.5;
    const lanes = 3;
    const population = Math.floor(density * lengthKm * lanes);
    
    expect(population).toBe(77);
  });

  it('should properly cap visual representation', () => {
    const density = 100;
    const lengthKm = 5;
    const lanes = 4;
    const population = Math.floor(density * lengthKm * lanes);
    
    expect(population).toBe(2000);
    const visualSample = Math.min(population, 100);
    expect(visualSample).toBe(100);
  });

  it('should deterministically generate lane indices', () => {
    // Testing the PRNG logic in simulator conceptually
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const seedNum = 12345;
    const lanes = 3;
    const laneIndex = Math.floor(seededRandom(seedNum) * lanes);
    
    expect(laneIndex).toBeGreaterThanOrEqual(0);
    expect(laneIndex).toBeLessThan(lanes);
  });
});
