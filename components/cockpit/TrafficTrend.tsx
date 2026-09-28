'use client';

import React from 'react';
import { DataClassBadge } from '../ui/FigmaShared';

export default function TrafficTrend() {
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
        <path className="area-path" d="M0 78C42 70 48 64 90 68s52 9 86-10 56-35 88-22 42 29 81 6 54-8 72-23l83-11v92H0z" />
        <path className="observed-path" d="M0 78C42 70 48 64 90 68s52 9 86-10 56-35 88-22 42 29 81 6" />
        <path className="predicted-path" d="M345 42c39-23 54-8 72-23l83-11" />
        <path className="now-line" d="M345 0v100" />
        <circle cx="345" cy="42" r="4" />
      </svg>
      <div className="chart-axis">
        <span>-30 MIN</span>
        <span>NOW</span>
        <span>+15 MIN</span>
      </div>
    </section>
  );
}
