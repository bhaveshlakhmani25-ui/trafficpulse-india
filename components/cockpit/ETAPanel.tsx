import React from 'react';
import { MobilityState } from '../../lib/mobility/types';
import SeeWhyPopover from './SeeWhyPopover';

interface ETAPanelProps {
  mobilityState: MobilityState;
}

export default function ETAPanel({ mobilityState }: ETAPanelProps) {
  const currentRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId);

  if (!currentRoute) return null;

  const totalMinutes = Math.round(currentRoute.overallCost / 60);
  const typicalMinutes = Math.round(currentRoute.baseTimeSeconds / 60);
  const incidentDelayMinutes = Math.round(currentRoute.incidentPenalty / 60);
  const congestionDelayMinutes = Math.round(currentRoute.congestionPenalty / 60);
  const forecastDelayMinutes = Math.round((currentRoute.forecastPenalty || 0) / 60);
  
  const totalDelayMinutes = incidentDelayMinutes + congestionDelayMinutes + forecastDelayMinutes;

  return (
    <div className="w-64 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-4 flex flex-col pointer-events-auto">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase">ETA</h2>
        <SeeWhyPopover evidence={mobilityState.evidence} />
      </div>
      
      <div className="text-4xl font-black text-white mb-4">
        {totalMinutes} <span className="text-xl text-gray-400 font-medium">min</span>
      </div>

      <div className="space-y-2 text-sm border-t border-gray-800 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Typical Base</span>
          <span className="text-white font-mono">{typicalMinutes} min</span>
        </div>
        
        {totalDelayMinutes > 0 && (
          <>
            {congestionDelayMinutes > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-orange-400">Current Congestion</span>
                <span className="text-orange-400 font-mono font-bold">+{congestionDelayMinutes} min</span>
              </div>
            )}
            {incidentDelayMinutes > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-400">Incident Impact</span>
                <span className="text-red-400 font-mono font-bold">+{incidentDelayMinutes} min</span>
              </div>
            )}
            {forecastDelayMinutes > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-400">Forecasted Delay</span>
                <span className="text-purple-400 font-mono font-bold">+{forecastDelayMinutes} min</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
        <span className="text-gray-500">Confidence:</span>
        <span className="text-green-400 font-bold uppercase">
          {mobilityState.forecasts.length > 0 ? `${(mobilityState.forecasts[0].confidence * 100).toFixed(0)}%` : 'High'}
        </span>
      </div>
    </div>
  );
}
