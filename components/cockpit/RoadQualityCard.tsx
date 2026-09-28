'use client';

import React from 'react';
import { DataClassBadge } from '../ui/FigmaShared';
import { useCityContext } from '../../lib/contexts/CityContext';

export default function RoadQualityCard() {
  const { mobilityState } = useCityContext();
  
  let score = 86;
  let label = "GOOD";
  let events = "0 surface events";
  
  if (mobilityState) {
    const total = mobilityState.roadConditions.length;
    if (total > 0) {
      let poor = mobilityState.roadConditions.filter(r => r.surfaceQuality === 'Poor').length;
      let moderate = mobilityState.roadConditions.filter(r => r.surfaceQuality === 'Moderate').length;
      
      score = Math.max(0, 100 - (poor * 15) - (moderate * 5));
      if (score >= 80) label = "GOOD";
      else if (score >= 50) label = "MODERATE";
      else label = "POOR";
      
      events = `${poor + moderate} minor surface events`;
    }
  }

  return (
    <section className="analytics-card quality-card">
      <div className="analytics-head">
        <div>
          <span>ROAD QUALITY</span>
          <small>ACTIVE ROUTE</small>
        </div>
        <DataClassBadge type="Historical" />
      </div>
      <div className="quality-score">
        <span>{score}<small>/100</small></span>
        <div>
          <strong>{label}</strong>
          <small>{events}</small>
        </div>
      </div>
      <div className="quality-line">
        <span />
        <i />
        <i />
      </div>
    </section>
  );
}
