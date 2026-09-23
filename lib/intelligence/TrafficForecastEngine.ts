import { MobilityState, TrafficForecast, Evidence, Provenance } from '../mobility/types';

export class TrafficForecastEngine {
  public static calculateForecast(state: MobilityState): { forecasts: TrafficForecast[], evidence: Evidence[] } {
    const forecasts: TrafficForecast[] = [];
    const newEvidence: Evidence[] = [];
    const PROV: Provenance = 'SYSTEM_GENERATED';

    for (const segment of state.segments) {
      // Start with optimistic forecast
      let predictedState = segment.congestionLevel;
      let expectedDelay = 0;
      let confidence = 0.5; // Base confidence
      let forecastHorizon = 15; // default 15 min
      const contributingFactors: string[] = [];
      const evidenceIds: string[] = [];

      // Check for active incidents on this road
      const activeIncidents = state.incidents.filter(i => i.roadName === segment.roadName && i.status === 'active');
      if (activeIncidents.length > 0) {
        const evId = `ev-inc-${Date.now()}-${Math.random()}`;
        newEvidence.push({
          id: evId,
          type: 'active_incident',
          source: activeIncidents[0].id,
          observedAt: new Date().toISOString(),
          value: 'Active incident on road',
          contribution: 'Increases delay and congestion',
          provenance: PROV,
          dataClass: 'OBSERVED'
        });
        evidenceIds.push(evId);
        contributingFactors.push('Incident upstream');
        predictedState = 'severe';
        expectedDelay += 300; // 5 min base
        confidence += 0.2;
      }

      // Check related checkpoints for density/queues
      const checkpoints = state.checkpoints.filter(c => c.roadId === segment.id);
      for (const chk of checkpoints) {
        if (chk.queueLengthMeters > 100 || chk.trafficDensity === 'high' || chk.trafficDensity === 'critical') {
          const evId = `ev-q-${Date.now()}-${Math.random()}`;
          newEvidence.push({
            id: evId,
            type: 'queue_growth',
            source: chk.id,
            observedAt: new Date().toISOString(),
            value: `Queue length: ${chk.queueLengthMeters}m`,
            contribution: 'Indicates compounding traffic',
            provenance: PROV,
            dataClass: 'OBSERVED'
          });
          evidenceIds.push(evId);
          contributingFactors.push('Queue length increasing');
          predictedState = predictedState === 'severe' ? 'severe' : 'congested';
          expectedDelay += 180;
          confidence += 0.1;
        }

        if (chk.averageSpeedKmph < segment.freeFlowSpeed * 0.5) {
          const evId = `ev-spd-${Date.now()}-${Math.random()}`;
          newEvidence.push({
            id: evId,
            type: 'speed_decline',
            source: chk.id,
            observedAt: new Date().toISOString(),
            value: `Speed dropped to ${chk.averageSpeedKmph} km/h`,
            contribution: 'Significantly below free flow',
            provenance: PROV,
            dataClass: 'OBSERVED'
          });
          evidenceIds.push(evId);
          contributingFactors.push('Average speed declining');
          confidence += 0.1;
        }
      }

      // Final bounds
      confidence = Math.min(0.95, confidence);

      forecasts.push({
        id: `fc-${segment.id}-${Date.now()}`,
        segmentId: segment.id,
        currentState: segment.congestionLevel,
        predictedState,
        forecastHorizon,
        expectedDelay,
        confidence,
        contributingFactors,
        evidenceIds,
        generatedAt: new Date().toISOString(),
        sourceType: 'simulation', // The engine itself is part of simulation system right now
        provenance: PROV,
        dataClass: 'PREDICTED'
      });
    }

    return { forecasts, evidence: newEvidence };
  }
}
