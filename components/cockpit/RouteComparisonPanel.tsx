import React from 'react';
import { Route } from '../../lib/mobility/types';

interface RouteComparisonPanelProps {
  routes: Route[];
  recommendedId?: string;
}

export default function RouteComparisonPanel({ routes, recommendedId }: RouteComparisonPanelProps) {
  if (routes.length < 1) return null;

  return (
    <div className="w-full bg-transparent flex flex-col gap-3">
      <div className="flex flex-col space-y-3">
        {routes.map(r => {
          const isRecommended = r.id === recommendedId;
          const totalMins = Math.round(r.overallCost / 60);
          const delayMins = Math.round((r.incidentPenalty + r.congestionPenalty) / 60);

          return (
            <div key={r.id} className={`p-4 rounded-xl border transition-[var(--tp-transition)] shadow-sm ${isRecommended ? 'border-[var(--tp-accent)] bg-[var(--tp-accent-dim)]' : 'border-[var(--tp-border)] bg-[var(--tp-surface)]'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  {isRecommended && <span className="text-[10px] font-bold text-[var(--tp-accent)] uppercase tracking-widest bg-[var(--tp-accent)]/10 self-start px-2 py-0.5 rounded-full mb-1 shadow-[0_0_8px_var(--tp-accent)]">RECOMMENDED</span>}
                  <p className="text-[14px] font-bold text-[var(--tp-text-primary)]">{r.name}</p>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <p className={`text-[18px] font-bold leading-none ${isRecommended ? 'text-[var(--tp-accent)]' : 'text-[var(--tp-text-primary)]'}`}>{totalMins} <span className="text-[12px] font-medium text-[var(--tp-text-muted)]">min</span></p>
                  <p className="text-[11px] text-[var(--tp-text-secondary)] font-medium">{(r.distanceMeters / 1000).toFixed(1)} km</p>
                </div>
              </div>
              <div className="flex space-x-3 text-[11px] font-bold">
                <span className={`px-2.5 py-1 rounded-md ${delayMins > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-[var(--tp-traffic-free)] border border-emerald-500/20'}`}>
                  Delay: +{delayMins} min
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
