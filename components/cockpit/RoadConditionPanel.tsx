import React from 'react';
import { MobilityState } from '../../lib/mobility/types';

interface RoadConditionPanelProps {
  mobilityState: MobilityState;
}

export default function RoadConditionPanel({ mobilityState }: RoadConditionPanelProps) {
  if (mobilityState.roadConditions.length === 0) return null;
  const rc = mobilityState.roadConditions[0];

  const getConditionBar = (quality: string) => {
    switch (quality) {
      case 'Excellent': return '██████████';
      case 'Good': return '████████░░';
      case 'Moderate': return '█████░░░░░';
      case 'Poor': return '██░░░░░░░░';
      default: return '█████░░░░░';
    }
  };

  return (
    <div className="w-64 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-4 flex flex-col mt-4">
      <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">ROAD CONDITION</h2>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-bold">{rc.surfaceQuality}</span>
        <span className="text-gray-400 font-mono tracking-widest text-xs">
          {getConditionBar(rc.surfaceQuality)}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center border-b border-gray-800 pb-1">
          <span className="text-gray-400">Pothole Risk</span>
          <span className={`font-bold ${rc.potholeRisk === 'High' ? 'text-red-400' : rc.potholeRisk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {rc.potholeRisk}
          </span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-800 pb-1">
          <span className="text-gray-400">Road Work</span>
          <span className={`font-bold ${rc.roadWork !== 'None' ? 'text-amber-400' : 'text-gray-300'}`}>
            {rc.roadWork}
          </span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-800 pb-1">
          <span className="text-gray-400">Flood Risk</span>
          <span className={`font-bold ${rc.floodingRisk === 'High' ? 'text-blue-400' : 'text-gray-300'}`}>
            {rc.floodingRisk}
          </span>
        </div>
      </div>
    </div>
  );
}
