import React from 'react';
import { Camera } from '../../lib/mobility/types';

interface CameraPreviewPanelProps {
  camera: Camera;
}

export default function CameraPreviewPanel({ camera }: CameraPreviewPanelProps) {
  return (
    <div className="w-64 bg-gray-900 text-white rounded p-3 shadow-lg border border-gray-700">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm">📹</span>
        <h3 className="text-xs font-bold tracking-widest uppercase text-gray-300">ROAD CAMERA</h3>
      </div>
      
      <div className="w-full h-32 bg-gray-800 rounded flex items-center justify-center mb-3 border border-gray-700 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
          <p className="text-xs font-bold text-gray-300 tracking-wider">
            {camera.previewType === 'simulated' ? 'SIMULATED PREVIEW' : 'PREVIEW UNAVAILABLE'}
          </p>
        </div>
        {/* Placeholder for actual image if live_authorized */}
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 opacity-50"></div>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Corridor:</span>
          <span>{camera.corridor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className="text-emerald-400 font-bold">{camera.status}</span>
        </div>
      </div>
      
      <button className="mt-3 w-full bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-1.5 rounded transition-colors">
        OPEN FULL PREVIEW
      </button>
    </div>
  );
}
