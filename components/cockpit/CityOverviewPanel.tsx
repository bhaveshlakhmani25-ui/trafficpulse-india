import React from 'react';
import { MobilityState } from '../../lib/mobility/types';
import { CityConfig } from '../../lib/config/CityRegistry';

interface CityOverviewPanelProps {
  mobilityState: MobilityState;
  activeCity: CityConfig;
}

export default function CityOverviewPanel({ mobilityState, activeCity }: CityOverviewPanelProps) {
  return (
    <div className="w-64 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-4 flex flex-col absolute top-20 right-6">
      <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-1">{activeCity.name.toUpperCase()}</h2>
      <p className="text-2xl font-black text-white mb-4">Mobility Index 72<span className="text-sm text-gray-400 font-normal">/100</span></p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-800/50 p-2 rounded border border-gray-800">
          <p className="text-gray-500 mb-1">Traffic</p>
          <p className="text-amber-400 font-bold">Elevated</p>
        </div>
        <div className="bg-gray-800/50 p-2 rounded border border-gray-800">
          <p className="text-gray-500 mb-1">Incidents</p>
          <p className={`font-bold ${mobilityState.incidents.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {mobilityState.incidents.length} Active
          </p>
        </div>
        <div className="bg-gray-800/50 p-2 rounded border border-gray-800">
          <p className="text-gray-500 mb-1">Hotspots</p>
          <p className={`font-bold ${mobilityState.hotspots.length > 0 ? 'text-orange-400' : 'text-gray-300'}`}>
            {mobilityState.hotspots.length}
          </p>
        </div>
        <div className="bg-gray-800/50 p-2 rounded border border-gray-800">
          <p className="text-gray-500 mb-1">Nodes</p>
          <p className="text-gray-300 font-bold">{mobilityState.checkpoints.length}</p>
        </div>
      </div>
    </div>
  );
}
