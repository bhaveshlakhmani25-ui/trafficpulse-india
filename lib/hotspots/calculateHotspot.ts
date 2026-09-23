import { Incident, TrafficSegment, Hotspot, IncidentSeverity, TrafficState } from '../mobility/types';

const SEVERITY_WEIGHTS: Record<IncidentSeverity, number> = {
  low: 10,
  medium: 25,
  high: 50,
  critical: 75,
};

const TRAFFIC_WEIGHTS: Record<TrafficState, number> = {
  'free-flow': 0,
  moderate: 10,
  congested: 20,
  severe: 35,
};

/**
 * Deterministically calculates a hotspot score based on incident severity,
 * traffic deterioration, and affected roads.
 */
export function calculateHotspot(
  incident: Incident,
  affectedSegments: TrafficSegment[]
): Hotspot {
  const incidentScore = SEVERITY_WEIGHTS[incident.severity] || 0;

  let maxTrafficScore = 0;
  for (const seg of affectedSegments) {
    const score = TRAFFIC_WEIGHTS[seg.congestionLevel] || 0;
    if (score > maxTrafficScore) {
      maxTrafficScore = score;
    }
  }

  const spreadMultiplier = affectedSegments.length > 1 ? 1.2 : 1.0;
  const rawScore = (incidentScore + maxTrafficScore) * spreadMultiplier;
  const finalScore = Math.min(100, Math.round(rawScore));

  const contributingFactors = [
    `Incident Severity: ${incident.severity.toUpperCase()}`,
  ];
  if (maxTrafficScore > 0) {
    contributingFactors.push('High localized congestion detected');
  }

  return {
    id: `hs-${incident.id}`,
    location: incident.location,
    radius: incidentScore * 10,
    score: finalScore,
    severity: incident.severity,
    contributingFactors,
    affectedRoadIds: affectedSegments.map(s => s.id),
    detectedAt: new Date().toISOString(),
    sourceType: 'simulation',
    provenance: 'SYSTEM_GENERATED',
    dataClass: 'PREDICTED'
  };
}
