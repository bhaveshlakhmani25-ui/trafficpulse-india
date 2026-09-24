import React from 'react';
import { MobilityState, TrafficSegment, Alert, FocusedFeature } from '../../lib/mobility/types';
import SeeWhyPopover from './SeeWhyPopover';

interface RoadAheadPanelProps {
  mobilityState: MobilityState;
  onFeatureClick?: (feature: FocusedFeature) => void;
}

export default function RoadAheadPanel({ mobilityState, onFeatureClick }: RoadAheadPanelProps) {
  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'free-flow': return 'bg-emerald-500';
      case 'moderate': return 'bg-amber-500';
      case 'congested': return 'bg-red-500';
      case 'severe': return 'bg-red-800';
      default: return 'bg-gray-500';
    }
  };

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
    <div className="w-80 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
      <div className="px-4 py-3 border-b border-gray-800 bg-black/40 flex justify-between items-center">
        <h2 className="text-sm font-bold text-white tracking-widest uppercase">ROAD AHEAD</h2>
      </div>
      
      {!currentRoute ? (
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 h-64">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-xl">🛣️</span>
          </div>
          <p className="text-sm text-gray-300 font-medium">No active route selected</p>
          <p className="text-xs text-gray-500">Select a route to view the road ahead.</p>
        </div>
      ) : (
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Current Context */}
          <div 
            className="mb-2 pb-2 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors"
            onClick={() => {
              if (onFeatureClick && currentRoute) {
                onFeatureClick({ type: 'route', id: currentRoute.id, coordinates: currentRoute.geometry[0] });
              }
            }}
          >
            <p className="text-xs text-gray-400">Following Route</p>
            <p className="text-sm font-medium text-blue-400">
              {currentRoute?.name || 'Unknown Route'}
            </p>
          </div>

          {/* Global Alerts (High severity) */}
          {mobilityState.alerts.filter(a => a.severity === 'high' || a.severity === 'critical').map(alert => (
            <div 
              key={alert.id} 
              className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 relative cursor-pointer hover:bg-red-900/40 transition-colors"
              onClick={() => {
                if (onFeatureClick && alert.incidentId) {
                  const inc = mobilityState.incidents.find(i => i.id === alert.incidentId);
                  if (inc) {
                    onFeatureClick({ type: 'incident', id: inc.id, coordinates: inc.location });
                  }
                }
              }}
            >
              <div className="absolute top-2 right-2" onClick={e => e.stopPropagation()}>
                <SeeWhyPopover 
                  evidence={mobilityState.evidence.filter(e => alert.evidenceIds?.includes(e.id))} 
                  buttonText="Why?" 
                />
              </div>
              <div className="flex items-start">
                <span className="text-lg mr-2">{getAlertIcon(alert.type)}</span>
                <div className="pr-12">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">{alert.alertClass.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-200 leading-snug">{alert.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.roadName}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* We only show a summary for city-wide architecture to avoid crashing the browser with 46,000 segments */}
          <div className="pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              Active route monitoring engaged. 
              Live traffic, incidents, and road condition alerts will appear here dynamically as you progress along the route.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
