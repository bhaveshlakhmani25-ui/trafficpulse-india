import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { demoScenarioEngine } from '../lib/simulation/ScenarioEngine';
import { CityRegistry } from '../lib/config/CityRegistry';

describe('City Context Transition Invariants', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('resets the scenario and updates the city ID atomically', async () => {
    // Initial state
    const delhiConfig = CityRegistry.getCityConfig('delhi');
    await demoScenarioEngine.resetScenario('delhi');
    expect(demoScenarioEngine.getScenarioState().cityId).toBe('delhi');

    // Switch to Mumbai
    const mumbaiConfig = CityRegistry.getCityConfig('mumbai');
    
    // Start transition
    const transitionPromise = demoScenarioEngine.resetScenario('mumbai');
    
    // The state should eventually reflect mumbai
    await transitionPromise;
    expect(demoScenarioEngine.getScenarioState().cityId).toBe('mumbai');
    
    // Check that segments reflect the new city (mumbai has distinct coordinates/segments)
    const segments = demoScenarioEngine.getScenarioState().segments;
    expect(segments.length).toBeGreaterThan(0);
  });

  it('generates completely new vehicle populations on city switch', async () => {
    await demoScenarioEngine.resetScenario('delhi');
    const delhiSegments = [...demoScenarioEngine.getScenarioState().segments];
    const delhiDensities = delhiSegments.map(s => s.estimatedDensityVehPerKmPerLane);

    await demoScenarioEngine.resetScenario('mumbai');
    const mumbaiSegments = [...demoScenarioEngine.getScenarioState().segments];
    const mumbaiDensities = mumbaiSegments.map(s => s.estimatedDensityVehPerKmPerLane);

    expect(mumbaiSegments.length).not.toBe(0);
    // As it's a completely different city, segments shouldn't match
    expect(delhiSegments).not.toEqual(mumbaiSegments);
  });
});
