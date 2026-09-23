import { MobilityState, IncidentRisk, RiskLevel, Evidence, Provenance } from '../mobility/types';

export class IncidentRiskEngine {
  public static calculateRisk(state: MobilityState): { risks: IncidentRisk[], evidence: Evidence[] } {
    const risks: IncidentRisk[] = [];
    const newEvidence: Evidence[] = [];
    const PROV: Provenance = 'SYSTEM_GENERATED';

    for (const segment of state.segments) {
      let score = 20; // Base score
      let riskLevel: RiskLevel = 'LOW';
      let confidence = 0.4;
      const contributingFactors: string[] = [];
      const evidenceIds: string[] = [];

      // Check Road Quality
      const roadCondition = state.roadConditions.find(rc => rc.roadName === segment.roadName);
      if (roadCondition && (roadCondition.surfaceQuality === 'Poor' || roadCondition.potholeRisk === 'High' || roadCondition.safetyRisk === 'High')) {
        const evId = `ev-rc-${Date.now()}-${Math.random()}`;
        newEvidence.push({
          id: evId,
          type: 'road_condition',
          source: roadCondition.id,
          observedAt: roadCondition.observedAt,
          value: `Surface Quality: ${roadCondition.surfaceQuality}`,
          contribution: 'Poor road surface increases collision risk',
          provenance: PROV,
          dataClass: 'OBSERVED'
        });
        evidenceIds.push(evId);
        contributingFactors.push('Poor road condition');
        score += 20;
        confidence += 0.1;
      }

      // Check Checkpoints for sudden slowdowns (proxy for hard braking)
      const checkpoints = state.checkpoints.filter(c => c.roadId === segment.id);
      for (const chk of checkpoints) {
        if (chk.averageSpeedKmph < segment.freeFlowSpeed * 0.4 && chk.trend === 'worsening') {
          const evId = `ev-spd-${Date.now()}-${Math.random()}`;
          newEvidence.push({
            id: evId,
            type: 'speed_anomaly',
            source: chk.id,
            observedAt: chk.observedAt,
            value: `Sudden speed drop to ${chk.averageSpeedKmph} km/h`,
            contribution: 'Abnormal speed drop (potential hard braking)',
            provenance: PROV,
            dataClass: 'OBSERVED'
          });
          evidenceIds.push(evId);
          contributingFactors.push('Abnormal speed drop');
          score += 30;
          confidence += 0.2;
        }
      }

      // We should also check Historical incident frequency, but we assume it's part of the base logic here
      const evIdHist = `ev-hist-${Date.now()}-${Math.random()}`;
      newEvidence.push({
        id: evIdHist,
        type: 'historical_incident_frequency',
        source: 'static',
        observedAt: new Date().toISOString(),
        value: `Historical risk: Elevated`,
        contribution: 'Historically elevated incident frequency on this corridor',
        provenance: 'BTP_HISTORICAL',
        dataClass: 'HISTORICAL'
      });
      evidenceIds.push(evIdHist);
      contributingFactors.push('Historically elevated incident frequency');
      score += 15;
      confidence += 0.1;

      // Determine level
      if (score > 70) riskLevel = 'HIGH';
      else if (score > 50) riskLevel = 'ELEVATED';
      else if (score > 30) riskLevel = 'MODERATE';
      
      confidence = Math.min(0.95, confidence);

      risks.push({
        id: `risk-${segment.id}-${Date.now()}`,
        roadId: segment.id,
        riskLevel,
        score: Math.min(100, score),
        forecastWindow: 30, // next 30 min
        confidence,
        contributingFactors,
        evidenceIds,
        generatedAt: new Date().toISOString(),
        sourceType: 'simulation',
        provenance: PROV,
        dataClass: 'PREDICTED'
      });
    }

    return { risks, evidence: newEvidence };
  }
}
