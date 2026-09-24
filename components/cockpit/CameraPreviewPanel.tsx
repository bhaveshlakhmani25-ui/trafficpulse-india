import React from 'react';
import { Camera } from '../../lib/mobility/types';

interface CameraPreviewPanelProps {
  camera: Camera;
}

export default function CameraPreviewPanel({ camera }: CameraPreviewPanelProps) {
  return (
    <div className="w-full bg-[var(--tp-surface)] text-[var(--tp-text-primary)] rounded-xl p-4 shadow-sm border border-[var(--tp-border)]">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm">📹</span>
        <h3 className="text-[10px] font-bold tracking-widest uppercase text-[var(--tp-text-muted)]">ROAD CAMERA</h3>
      </div>
      
      <div className="w-full h-36 bg-[var(--tp-bg)] rounded-lg flex items-center justify-center mb-4 border border-[var(--tp-border-light)] overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <p className="text-[10px] font-bold text-[var(--tp-text-muted)] tracking-widest bg-[var(--tp-surface)]/80 px-2 py-1 rounded">
            {camera.previewType === 'simulated' ? 'SIMULATED PREVIEW' : 'PREVIEW UNAVAILABLE'}
          </p>
        </div>
        {/* Placeholder for actual image if live_authorized */}
        <div className="w-full h-full bg-gradient-to-br from-[var(--tp-surface-hover)] to-[var(--tp-bg)] opacity-50"></div>
      </div>
      
      <div className="space-y-2 text-[11px] font-medium">
        <div className="flex justify-between items-center">
          <span className="text-[var(--tp-text-muted)] uppercase tracking-wider">Corridor</span>
          <span className="font-bold text-[var(--tp-text-primary)]">{camera.corridor}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--tp-text-muted)] uppercase tracking-wider">Status</span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded">{camera.status}</span>
        </div>
      </div>
      
      <button className="mt-4 w-full bg-[var(--tp-surface-hover)] hover:bg-[var(--tp-border)] border border-[var(--tp-border-light)] text-[var(--tp-text-primary)] text-[11px] font-bold py-2 rounded-lg transition-[var(--tp-transition)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)]">
        OPEN FULL PREVIEW
      </button>
    </div>
  );
}
