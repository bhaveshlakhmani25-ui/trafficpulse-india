import React from 'react';

export default function DataSourcesDrawer() {
  return (
    <div className="w-72 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-4 flex flex-col absolute bottom-6 right-6">
      <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">DATA SOURCES</h2>
      
      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Traffic</span>
          <span className="text-amber-500 font-mono flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" /> Simulation
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Checkpoints</span>
          <span className="text-amber-500 font-mono flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" /> Simulation
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Road Cameras</span>
          <span className="text-blue-400 font-mono flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5" /> Demo Snapshot
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Road Quality</span>
          <span className="text-amber-500 font-mono flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" /> Simulation
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Routing</span>
          <span className="text-emerald-400 font-mono flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" /> Deterministic Cost
          </span>
        </div>
      </div>
    </div>
  );
}
