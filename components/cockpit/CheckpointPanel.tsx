import React from 'react';
import { TrafficIntelligenceNode } from '../../lib/mobility/types';

interface CheckpointPanelProps {
  checkpoint: TrafficIntelligenceNode;
}

export default function CheckpointPanel({ checkpoint }: CheckpointPanelProps) {
  return (
    <div className="w-56 bg-gray-900 text-white rounded p-3 shadow-lg border border-gray-700">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-gray-300">CHECKPOINT</h3>
      </div>
      <p className="text-sm font-semibold mb-3">{checkpoint.name}</p>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-gray-400">Traffic:</span>
          <span className="font-bold capitalize text-amber-400">{checkpoint.trafficDensity}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-gray-400">Queue:</span>
          <span className="font-mono">{checkpoint.queueLengthMeters} m</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-gray-400">Average speed:</span>
          <span className="font-mono">{checkpoint.averageSpeedKmph} km/h</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span className="text-gray-400">Trend:</span>
          <span className="capitalize">{checkpoint.trend === 'worsening' ? '↑ Worsening' : '↓ Improving'}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 text-[10px] text-gray-500 uppercase tracking-wider flex justify-between">
        <span>Source: {checkpoint.sourceType}</span>
        <span>{checkpoint.confidence} Conf</span>
      </div>
    </div>
  );
}
