import { describe, it, expect, vi } from 'vitest';
import { calculateHotspot } from '../lib/hotspots/calculateHotspot';
import { scoreRoute } from '../lib/routing/scoreRoute';
import { Incident, TrafficSegment, Route } from '../lib/mobility/types';
import { demoScenarioEngine } from '../lib/simulation/ScenarioEngine';

describe('Deterministic Intelligence', () => {
  it('calculates hotspot score correctly based on severity and traffic', () => {
    const incident: Incident = {
      id: 'test', type: 'accident', severity: 'high', location: [0, 0], roadName: 'Test',
      description: '', reportedAt: '', status: 'active', sourceType: 'simulation', provenance: 'DEMO_SIMULATION', dataClass: 'OBSERVED'
    };
    const segments: TrafficSegment[] = [
      { id: '1', roadName: 'Test', coordinates: [], speed: 10, freeFlowSpeed: 60, congestionLevel: 'severe', trend: 'worsening', sourceType: 'simulation', provenance: 'DEMO_SIMULATION', dataClass: 'OBSERVED', timestamp: '' }
    ];

    const hotspot = calculateHotspot(incident, segments);
    
    // Severity weight (high = 50) + Traffic weight (severe = 35) = 85
    expect(hotspot.score).toBe(85);
    expect(hotspot.severity).toBe('high');
    expect(hotspot.affectedRoadIds).toContain('1');
  });

  it('scores routes deterministically', () => {
    const route: Route = {
      id: 'r1', name: 'R1', geometry: [], baseTimeSeconds: 300, distanceMeters: 2000,
      congestionPenalty: 60, incidentPenalty: 300, forecastPenalty: 0, overallCost: 0, hasAlternatives: true, sourceType: 'simulation', provenance: 'DEMO_SIMULATION', dataClass: 'OBSERVED'
    };
    
    const scored = scoreRoute(route);
    expect(scored.overallCost).toBe(660); // 300 + 60 + 300 + 0
  });

  it('scenario engine transitions correctly', async () => {
    vi.useFakeTimers();
    demoScenarioEngine.resetScenario();
    let state = demoScenarioEngine.getScenarioState();
    
    // Trigger incident
    demoScenarioEngine.triggerIncident();
    state = demoScenarioEngine.getScenarioState();
    
    expect(state.scenarioState).toBe('INCIDENT_DETECTED');
    expect(state.incidents.length).toBe(1);
    expect(state.forecasts.length).toBeGreaterThan(0); // Engine runs on state transition

    // Fast forward to recommendation (7500ms)
    vi.advanceTimersByTime(7500);
    
    state = demoScenarioEngine.getScenarioState();
    expect(state.scenarioState).toBe('RECOMMENDATION');
    expect(state.hotspots.length).toBeGreaterThan(0);
    expect(state.recommendedRouteId).toBe('route-alt');

    vi.useRealTimers();
  });
});
