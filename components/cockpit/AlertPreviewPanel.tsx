import React from 'react';
import { Alert } from '../../lib/mobility/types';

interface AlertPreviewPanelProps {
  alert: Alert;
}

export default function AlertPreviewPanel({ alert }: AlertPreviewPanelProps) {
  return (
    <div className="w-80 bg-red-900/90 backdrop-blur-xl border border-red-700 rounded-xl shadow-2xl p-4 flex flex-col text-white">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xl">🚨</span>
        <h2 className="text-sm font-bold tracking-widest uppercase text-red-200">INCIDENT PREVIEW</h2>
      </div>

      <p className="text-lg font-bold mb-1">{alert.title}</p>
      <p className="text-xs text-red-300 mb-4">{alert.roadName}</p>

      <div className="space-y-2 text-sm border-t border-red-800 pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-red-300">Distance</span>
          <span className="font-mono">{(alert.distanceMeters / 1000).toFixed(1)} km</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-300">Traffic impact</span>
          <span className="font-bold capitalize">{alert.severity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-300">ETA impact</span>
          <span className="font-mono font-bold text-red-200">+{Math.round(alert.expectedDelaySeconds / 60)} min</span>
        </div>
      </div>

      <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm">
        VIEW INCIDENT
      </button>
    </div>
  );
}
