import React from 'react';
import { TrafficIntelligenceNode } from '../../lib/mobility/types';

interface CheckpointPanelProps {
  checkpoint: TrafficIntelligenceNode;
}

export default function CheckpointPanel({ checkpoint }: CheckpointPanelProps) {
  return (
    <div className="w-full bg-[var(--tp-surface)] text-[var(--tp-text-primary)] rounded-xl p-5 shadow-sm border border-[var(--tp-border)]">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[var(--tp-accent)] shadow-[0_0_8px_var(--tp-accent)]"></div>
        <h3 className="text-[10px] font-bold tracking-widest uppercase text-[var(--tp-text-muted)]">CHECKPOINT</h3>
      </div>
      <p className="text-[14px] font-bold mb-4 text-[var(--tp-text-primary)]">{checkpoint.name}</p>
      
      <div className="flex flex-col gap-2.5 text-[11px] font-medium">
        <div className="flex justify-between border-b border-[var(--tp-border-light)] pb-2">
          <span className="text-[var(--tp-text-muted)] uppercase tracking-wider">Traffic</span>
          <span className="font-bold capitalize text-[var(--tp-traffic-heavy)]">{checkpoint.trafficDensity}</span>
        </div>
        <div className="flex justify-between border-b border-[var(--tp-border-light)] pb-2">
          <span className="text-[var(--tp-text-muted)] uppercase tracking-wider">Queue</span>
          <span className="font-bold">{checkpoint.queueLengthMeters} m</span>
        </div>
        <div className="flex justify-between border-b border-[var(--tp-border-light)] pb-2">
          <span className="text-[var(--tp-text-muted)] uppercase tracking-wider">Speed</span>
          <span className="font-bold">{checkpoint.averageSpeedKmph} km/h</span>
        </div>
        <div className="flex justify-between border-b border-[var(--tp-border-light)] pb-2">
          <span className="text-[var(--tp-text-muted)] uppercase tracking-wider">Trend</span>
          <span className="capitalize">{checkpoint.trend === 'worsening' ? '↑ Worsening' : '↓ Improving'}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-2 text-[10px] text-[var(--tp-text-muted)] font-semibold uppercase tracking-wider flex justify-between bg-[var(--tp-bg)] p-2 rounded">
        <span>Src: {checkpoint.sourceType}</span>
        <span className="text-[var(--tp-accent)]">{checkpoint.confidence} Conf</span>
      </div>
    </div>
  );
}
