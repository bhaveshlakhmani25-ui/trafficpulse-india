import React from 'react';
import { MobilityState, TrafficSegment, Alert } from '../../lib/mobility/types';
import SeeWhyPopover from './SeeWhyPopover';

interface RoadAheadPanelProps {
  mobilityState: MobilityState;
}

export default function RoadAheadPanel({ mobilityState }: RoadAheadPanelProps) {
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
      
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {/* Current Context */}
        <div className="mb-2 pb-2 border-b border-gray-800">
          <p className="text-xs text-gray-400">Following Route</p>
          <p className="text-sm font-medium text-white text-blue-400">
            {currentRoute?.name || 'Unknown Route'}
          </p>
        </div>

        {/* Global Alerts (High severity) */}
        {mobilityState.alerts.filter(a => a.severity === 'high' || a.severity === 'critical').map(alert => (
          <div key={alert.id} className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 relative">
            <div className="absolute top-2 right-2">
              <SeeWhyPopover 
                evidence={mobilityState.evidence.filter(e => alert.evidenceIds?.includes(e.id))} 
                buttonText="Why?" 
              />
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-2">{getAlertIcon(alert.type)}</span>
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">{alert.alertClass.replace('_', ' ')}</p>
                <p className="text-sm text-gray-200 leading-snug">{alert.title}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.roadName}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Traffic Segments Timeline */}
        <div className="space-y-4 pt-2">
          {mobilityState.segments.map((seg: TrafficSegment) => {
            const segmentIncidents = mobilityState.incidents.filter(i => i.roadName === seg.roadName && i.status === 'active');
            const segmentCameras = mobilityState.cameras.filter(c => c.corridor === seg.roadName);
            const segmentForecast = mobilityState.forecasts.find(f => f.segmentId === seg.id);
            const segmentRisk = mobilityState.incidentRisks.find(r => r.roadId === seg.id);

            return (
              <div key={seg.id} className="flex items-start">
                <div className="flex flex-col items-center mr-3 mt-1 shrink-0">
                  <div className={`w-3 h-3 rounded-full ${getTrafficColor(seg.congestionLevel)} ring-2 ring-gray-900`} />
                  <div className="w-0.5 h-full min-h-[3rem] bg-gray-800 my-1" />
                </div>
                
                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-white">{seg.roadName}</p>
                    <p className="text-xs font-mono text-gray-400">{seg.speed} km/h</p>
                  </div>
                  
                  {/* Segment Details */}
                  <div className="space-y-2 mt-2">
                    {/* Incidents */}
                    {segmentIncidents.map(inc => (
                      <div key={inc.id} className="text-xs text-red-400 flex items-center bg-red-950/30 px-2 py-1 rounded">
                        <span className="mr-1">🚨</span> {inc.description}
                      </div>
                    ))}
                    
                    {/* Forecast Warning */}
                    {segmentForecast && segmentForecast.predictedState === 'severe' && (
                      <div className="text-xs text-orange-400 flex justify-between items-center bg-orange-950/30 px-2 py-1 rounded border border-orange-900/30">
                        <span><span className="mr-1">📈</span> Forecast: Severe in {segmentForecast.forecastHorizon}m</span>
                        <SeeWhyPopover 
                          evidence={mobilityState.evidence.filter(e => segmentForecast.evidenceIds.includes(e.id))} 
                          buttonText="Why?" 
                        />
                      </div>
                    )}

                    {/* Risk Warning */}
                    {segmentRisk && segmentRisk.riskLevel === 'HIGH' && (
                      <div className="text-xs text-purple-400 flex justify-between items-center bg-purple-950/30 px-2 py-1 rounded border border-purple-900/30">
                        <span><span className="mr-1">⚠</span> High Incident Risk</span>
                        <SeeWhyPopover 
                          evidence={mobilityState.evidence.filter(e => segmentRisk.evidenceIds.includes(e.id))} 
                          buttonText="Why?" 
                        />
                      </div>
                    )}

                    {/* Cameras */}
                    {segmentCameras.map(cam => (
                      <div key={cam.id} className="text-[10px] text-blue-400 flex items-center">
                        <span className="mr-1">📹</span> Live Camera ({cam.direction})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
