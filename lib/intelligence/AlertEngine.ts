import { MobilityState, Alert, Provenance } from '../mobility/types';

export class AlertEngine {
  public static generateAlerts(state: MobilityState): Alert[] {
    const alerts: Alert[] = [];
    const PROV: Provenance = 'SYSTEM_GENERATED';

    // 1. Current Incidents (Highest Priority)
    for (const incident of state.incidents) {
      if (incident.status === 'active') {
        alerts.push({
          id: `alt-inc-${incident.id}`,
          severity: incident.severity,
          alertClass: 'CURRENT_INCIDENT',
          type: incident.type,
          title: incident.description,
          roadName: incident.roadName,
          distanceMeters: 1800, // Simulated distance for now
          expectedDelaySeconds: 540,
          timestamp: incident.reportedAt,
          incidentId: incident.id,
          sourceType: 'simulation',
          provenance: incident.provenance,
          dataClass: 'OBSERVED',
          confidence: 1.0,
        });
      }
    }

    // 2. Congestion Forecasts
    for (const forecast of state.forecasts) {
      if (forecast.predictedState === 'severe' || forecast.predictedState === 'congested') {
        alerts.push({
          id: `alt-fc-${forecast.id}`,
          severity: forecast.predictedState === 'severe' ? 'high' : 'medium',
          alertClass: 'CONGESTION_FORECAST',
          type: 'congestion',
          title: `${forecast.predictedState === 'severe' ? 'Heavy' : 'Moderate'} congestion likely within ${forecast.forecastHorizon} minutes.`,
          roadName: state.segments.find(s => s.id === forecast.segmentId)?.roadName || 'Unknown Road',
          distanceMeters: 2100, // Simulated
          expectedDelaySeconds: forecast.expectedDelay,
          timestamp: forecast.generatedAt,
          sourceType: 'simulation',
          provenance: PROV,
          dataClass: 'PREDICTED',
          evidenceIds: forecast.evidenceIds,
          confidence: forecast.confidence,
        });
      }
    }

    // 3. Incident Risks
    for (const risk of state.incidentRisks) {
      if (risk.riskLevel === 'HIGH' || risk.riskLevel === 'ELEVATED') {
        alerts.push({
          id: `alt-risk-${risk.id}`,
          severity: risk.riskLevel === 'HIGH' ? 'high' : 'medium',
          alertClass: 'INCIDENT_RISK',
          type: 'risk',
          title: `Incident risk is ${risk.riskLevel.toLowerCase()} for the next ${risk.forecastWindow} min.`,
          roadName: state.segments.find(s => s.id === risk.roadId)?.roadName || 'Unknown Road',
          distanceMeters: 1800, // Simulated
          expectedDelaySeconds: 0,
          timestamp: risk.generatedAt,
          sourceType: 'simulation',
          provenance: PROV,
          dataClass: 'PREDICTED',
          evidenceIds: risk.evidenceIds,
          confidence: risk.confidence,
        });
      }
    }

    // Sort by Priority:
    // 1. Severity ('critical' > 'high' > 'medium' > 'low')
    // 2. Distance (closest first)
    // 3. Confidence (highest first)
    alerts.sort((a, b) => {
      const severityScores = { critical: 4, high: 3, medium: 2, low: 1 };
      const scoreA = severityScores[a.severity];
      const scoreB = severityScores[b.severity];

      if (scoreA !== scoreB) return scoreB - scoreA;
      
      if (a.distanceMeters !== b.distanceMeters) return a.distanceMeters - b.distanceMeters;

      const confA = a.confidence || 0;
      const confB = b.confidence || 0;
      return confB - confA;
    });

    return alerts;
  }
}
