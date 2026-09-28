'use client';

import React from 'react';
import { DataClassBadge } from '../ui/FigmaShared';
import { useCityContext } from '../../lib/contexts/CityContext';
import { getTrafficTrendPath } from '../../lib/mobility/selectors';

export default function TrafficTrend() {
  const { activeCity, mobilityState } = useCityContext();
  
  if (!mobilityState || !activeCity) {
    return null;
  }

  const { observed, predicted, area, currentY } = getTrafficTrendPath(mobilityState, activeCity.id);

  return (
    <section className="analytics-card trend-card">
      <div className="analytics-head">
        <div>
          <span>TRAFFIC TREND</span>
          <small>PAST 30 MIN → NEXT 15 MIN</small>
        </div>
        <div>
          <DataClassBadge type="Observed" />
          <DataClassBadge type="Predicted" />
        </div>
      </div>
      <svg viewBox="0 0 500 100" className="trend-chart" preserveAspectRatio="none" aria-label="Traffic intensity trend">
        <path className="chart-grid" d="M0 20H500M0 50H500M0 80H500" />
        <path className="area-path" d={area} />
        <path className="observed-path" d={observed} />
        <path className="predicted-path" d={predicted} />
        <path className="now-line" d="M345 0v100" />
        <circle cx="345" cy={currentY} r="4" />
      </svg>
      <div className="chart-axis">
        <span>-30 MIN</span>
        <span>NOW</span>
        <span>+15 MIN</span>
      </div>
    </section>
  );
}
