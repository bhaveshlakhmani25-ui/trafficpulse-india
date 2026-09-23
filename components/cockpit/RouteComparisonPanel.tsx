import React from 'react';
import { Route } from '../../lib/mobility/types';

interface RouteComparisonPanelProps {
  routes: Route[];
  recommendedId?: string;
}

export default function RouteComparisonPanel({ routes, recommendedId }: RouteComparisonPanelProps) {
  if (routes.length < 2) return null;

  return (
    <div className="w-96 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-4 flex flex-col">
      <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">ROUTE COMPARISON</h2>
      
      <div className="flex flex-col space-y-4">
        {routes.map(r => {
          const isRecommended = r.id === recommendedId;
          const totalMins = Math.round(r.overallCost / 60);
          const delayMins = Math.round((r.incidentPenalty + r.congestionPenalty) / 60);
          
          return (
            <div key={r.id} className={`p-3 rounded-lg border transition-colors ${isRecommended ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 bg-gray-800/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  {isRecommended && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 block">RECOMMENDED</span>}
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${isRecommended ? 'text-blue-400' : 'text-gray-300'}`}>{totalMins} min</p>
                  <p className="text-xs text-gray-500 font-mono">{(r.distanceMeters / 1000).toFixed(1)} km</p>
                </div>
              </div>
              <div className="flex space-x-3 text-xs">
                <span className={`px-2 py-1 rounded ${delayMins > 0 ? 'bg-red-900/40 text-red-300' : 'bg-emerald-900/40 text-emerald-300'}`}>
                  Delay: +{delayMins}m
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
