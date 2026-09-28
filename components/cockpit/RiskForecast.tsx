'use client';

import React from 'react';
import { DataClassBadge, Icon } from '../ui/FigmaShared';
import { useCityContext } from '../../lib/contexts/CityContext';
import { getNetworkTrafficState } from '../../lib/mobility/selectors';

export default function RiskForecast() {
  const { mobilityState } = useCityContext();
  
  const currentRisk = mobilityState?.incidentRisks.length || 0;
  let riskLabel = "Normal";
  if (currentRisk > 5) riskLabel = "High";
  else if (currentRisk > 2) riskLabel = "Elevated";
  
  const delay = mobilityState?.incidents.length ? (mobilityState.incidents.length * 3) : 0;
  
  return (
    <section className="analytics-card risk-card">
      <div className="analytics-head">
        <div>
          <span>RISK FORECAST</span>
          <small>NEXT 15 MIN</small>
        </div>
        <DataClassBadge type="Predicted" />
      </div>
      <div className="risk-shift">
        <span>{mobilityState ? getNetworkTrafficState(mobilityState).toUpperCase() : 'MODERATE'}</span>
        <Icon name="arrow" size={15} />
        <strong>{riskLabel === 'High' ? 'SEVERE' : (riskLabel === 'Elevated' ? 'HEAVY' : 'MODERATE')}</strong>
      </div>
      <div className="risk-stats">
        <span>Incident risk <strong>{riskLabel}</strong></span>
        <span>Expected delay <strong>+{delay} min</strong></span>
        <span>Confidence <strong>85%</strong></span>
      </div>
    </section>
  );
}
