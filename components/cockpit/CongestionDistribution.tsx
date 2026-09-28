'use client';

import React from 'react';
import { DataClassBadge } from '../ui/FigmaShared';
import { useCityContext } from '../../lib/contexts/CityContext';

export default function CongestionDistribution() {
  const { mobilityState } = useCityContext();
  
  let free = 38, moderate = 42, heavy = 16, severe = 4;
  
  if (mobilityState && mobilityState.segments.length > 0) {
    let counts = { free: 0, moderate: 0, heavy: 0, severe: 0 };
    mobilityState.segments.forEach(seg => {
      if (seg.trafficState === 'severe') counts.severe++;
      else if (seg.trafficState === 'congested') counts.heavy++;
      else if (seg.trafficState === 'moderate') counts.moderate++;
      else counts.free++;
    });
    const total = mobilityState.segments.length;
    free = Math.round((counts.free / total) * 100);
    moderate = Math.round((counts.moderate / total) * 100);
    heavy = Math.round((counts.heavy / total) * 100);
    severe = Math.round((counts.severe / total) * 100);
  }

  const rows = [
    ["Free flow", `${free}%`, "free", free], 
    ["Moderate", `${moderate}%`, "moderate", moderate], 
    ["Heavy", `${heavy}%`, "heavy", heavy], 
    ["Severe", `${severe}%`, "severe", severe]
  ];
  
  return (
    <section className="analytics-card distribution">
      <div className="analytics-head">
        <div>
          <span>CONGESTION MIX</span>
          <small>CITY NETWORK</small>
        </div>
        <DataClassBadge type="Simulated" />
      </div>
      <div className="bar-list">
        {rows.map(([label, percent, tone, width]) => (
          <div className="bar-row" key={String(label)}>
            <span><i className={String(tone)} />{label}</span>
            <div className="bar-track">
              <i className={String(tone)} style={{ width: `${width}%` }} />
            </div>
            <strong>{percent}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
