import React from 'react';
import { MobilityState, TrafficSegment, Alert, FocusedFeature } from '../../lib/mobility/types';
import SeeWhyPopover from './SeeWhyPopover';

interface RoadAheadPanelProps {
  mobilityState: MobilityState;
  onFeatureClick?: (feature: FocusedFeature) => void;
}

export default function RoadAheadPanel({ mobilityState, onFeatureClick }: RoadAheadPanelProps) {
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'accident': return '🚨';
      case 'congestion': return '🛑';
      case 'risk': return '⚠';
      default: return 'ℹ️';
    }
  }

  const currentRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId);

  return (
    <div className="w-full h-full flex flex-col">
      {!currentRoute ? (
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 h-64 border border-dashed border-[var(--tp-border)] rounded-xl mt-4">
          <div className="w-12 h-12 rounded-full bg-[var(--tp-surface)] border border-[var(--tp-border)] shadow-sm flex items-center justify-center">
            <span className="text-xl">🛣️</span>
          </div>
          <p className="text-[14px] text-[var(--tp-text-primary)] font-bold">No active route selected</p>
          <p className="text-[11px] text-[var(--tp-text-muted)] font-medium">Select a route to view the road ahead.</p>
        </div>
      ) : (
        <div className="p-2 space-y-4 max-h-full overflow-y-auto no-scrollbar">
          {/* Current Context */}
          <div 
            className="mb-2 pb-4 border-b border-[var(--tp-border-light)] cursor-pointer hover:bg-[var(--tp-surface)] p-3 rounded-xl transition-[var(--tp-transition)] border border-transparent hover:border-[var(--tp-border-light)]"
            onClick={() => {
              if (onFeatureClick && currentRoute) {
                onFeatureClick({ type: 'route', id: currentRoute.id, coordinates: currentRoute.geometry[0] });
              }
            }}
          >
            <p className="text-[10px] text-[var(--tp-text-muted)] font-bold uppercase tracking-widest mb-1">Following Route</p>
            <p className="text-[14px] font-bold text-[var(--tp-accent)]">
              {currentRoute?.name || 'Unknown Route'}
            </p>
          </div>

          {/* Global Alerts (High severity) */}
          {mobilityState.alerts.filter(a => a.severity === 'high' || a.severity === 'critical').map(alert => (
            <div 
              key={alert.id} 
              className="bg-[var(--tp-surface)] border border-red-900/40 rounded-xl p-4 shadow-sm relative cursor-pointer hover:border-red-900/60 transition-[var(--tp-transition)]"
              onClick={() => {
                if (onFeatureClick && alert.incidentId) {
                  const inc = mobilityState.incidents.find(i => i.id === alert.incidentId);
                  if (inc) {
                    onFeatureClick({ type: 'incident', id: inc.id, coordinates: inc.location });
                  }
                }
              }}
            >
              <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
                <SeeWhyPopover 
                  evidence={mobilityState.evidence.filter(e => alert.evidenceIds?.includes(e.id))} 
                  buttonText="Why?" 
                />
              </div>
              <div className="flex items-start">
                <span className="text-xl mr-3">{getAlertIcon(alert.type)}</span>
                <div className="pr-14">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">{alert.alertClass.replace('_', ' ')}</p>
                  <p className="text-[13px] font-medium text-[var(--tp-text-primary)] leading-snug">{alert.title}</p>
                  <p className="text-[11px] text-[var(--tp-text-muted)] font-medium mt-1">{alert.roadName}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-6">
            <p className="text-[11px] text-[var(--tp-text-muted)] text-center font-medium leading-relaxed bg-[var(--tp-surface)] p-4 rounded-xl border border-dashed border-[var(--tp-border)]">
              Active route monitoring engaged. <br/>
              Live traffic, incidents, and road condition alerts will appear here dynamically as you progress.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
