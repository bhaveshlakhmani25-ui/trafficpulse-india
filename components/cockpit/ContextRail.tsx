import React, { useState } from 'react';
import { MobilityState, Alert, Route, TrafficSegment } from '../../lib/mobility/types';
import { useCityContext } from '../../lib/contexts/CityContext';
import { Navigation, AlertTriangle, ShieldAlert, Database, ChevronRight, ChevronDown, Activity, MapPin, Search } from 'lucide-react';
import RoadAheadPanel from './RoadAheadPanel';
import RouteComparisonPanel from './RouteComparisonPanel';
import CameraPreviewPanel from './CameraPreviewPanel';
import CheckpointPanel from './CheckpointPanel';

interface ContextRailProps {
  mobilityState: MobilityState;
}

export default function ContextRail({ mobilityState }: ContextRailProps) {
  const { activeSection, selectedFeature, setSelectedFeature } = useCityContext();

  const [showETAWhy, setShowETAWhy] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const activeRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId) || mobilityState.routes[0];
  const activeAlert = mobilityState.alerts[0]; // Primary alert
  
  // Computations for ETA
  let baseETA = 0;
  let incidentDelay = 0;
  let congestionDelay = 0;
  let forecastDelay = 0;

  if (activeRoute) {
    baseETA = Math.round(activeRoute.baseTimeSeconds / 60);
    incidentDelay = Math.round(activeRoute.incidentPenalty / 60);
    congestionDelay = Math.round(activeRoute.congestionPenalty / 60);
    forecastDelay = Math.round(activeRoute.forecastPenalty / 60);
  }

  const totalETA = baseETA + incidentDelay + congestionDelay + forecastDelay;
  
  // Mobility counts
  const incidentCount = mobilityState.incidents.length;
  const hotspotCount = mobilityState.hotspots.length;
  const nodeCount = mobilityState.checkpoints.length;
  const trafficState = mobilityState.segments.length > 0 ? mobilityState.segments[0].trafficState.toUpperCase() : 'UNKNOWN';

  // HELPER RENDERS
  const renderETA = () => (
    <div className="bg-[var(--tp-surface)] border border-[var(--tp-border)] rounded-xl overflow-hidden shadow-sm flex flex-col shrink-0">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center text-[var(--tp-text-secondary)] text-[10px] font-bold tracking-widest uppercase">
          <Navigation className="w-3.5 h-3.5 mr-2 opacity-80" />
          Estimated Arrival
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-light text-[var(--tp-text-primary)] tracking-tighter leading-none">{totalETA}</span>
            <span className="text-lg text-[var(--tp-text-muted)] font-medium">min</span>
          </div>
          <div className="text-right flex flex-col justify-end gap-1 mb-1 text-xs font-medium">
            <div className="text-[var(--tp-text-muted)]">Typical {baseETA} min</div>
            {incidentDelay + congestionDelay > 0 && (
              <div className="text-[var(--tp-traffic-moderate)]">+{incidentDelay + congestionDelay} min delay</div>
            )}
            {forecastDelay > 0 && (
              <div className="text-[var(--tp-traffic-severe)]">+{forecastDelay} min forecast</div>
            )}
          </div>
        </div>
        
        <div className="w-full h-1.5 bg-[var(--tp-bg)] rounded-full overflow-hidden flex shadow-inner">
          <div className="bg-[var(--tp-accent)] h-full transition-all duration-500" style={{ width: `${(baseETA / Math.max(1, totalETA)) * 100}%` }}></div>
          {(incidentDelay + congestionDelay) > 0 && (
            <div className="bg-[var(--tp-traffic-moderate)] h-full transition-all duration-500" style={{ width: `${((incidentDelay + congestionDelay) / totalETA) * 100}%` }}></div>
          )}
          {forecastDelay > 0 && (
            <div className="bg-[var(--tp-traffic-severe)] h-full transition-all duration-500" style={{ width: `${(forecastDelay / totalETA) * 100}%` }}></div>
          )}
        </div>
        
        <button 
          onClick={() => setShowETAWhy(!showETAWhy)}
          className="text-xs text-[var(--tp-text-muted)] hover:text-[var(--tp-text-primary)] self-start font-medium transition-[var(--tp-transition)] flex items-center gap-1"
        >
          {showETAWhy ? 'Hide Analysis' : 'See Why'}
          <ChevronDown className={`w-3 h-3 transition-transform ${showETAWhy ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showETAWhy && (
        <div className="bg-[var(--tp-bg)]/40 p-4 border-t border-[var(--tp-border-light)] text-sm">
          <div className="flex justify-between items-center mb-3 text-xs">
            <span className="text-[var(--tp-text-muted)] font-medium">WHY IS ETA {totalETA} MIN?</span>
            <span className="text-[var(--tp-accent)] font-medium bg-[var(--tp-accent-dim)] px-2 py-0.5 rounded-full">High Confidence</span>
          </div>
          <ul className="space-y-2 text-[var(--tp-text-secondary)] text-xs">
            {mobilityState.evidence.length > 0 ? (
              mobilityState.evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[var(--tp-traffic-free)] mt-0.5 shrink-0">✓</span>
                  <span className="flex-1 leading-snug">{ev.value} <span className="text-[var(--tp-text-muted)] ml-1">({ev.contribution})</span></span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2.5">
                <span className="text-[var(--tp-traffic-free)] mt-0.5 shrink-0">✓</span>
                <span className="flex-1 leading-snug">Normal traffic conditions observed</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  const renderMobilitySummary = () => (
    <div className="bg-[var(--tp-surface)] border border-[var(--tp-border)] rounded-xl p-5 shadow-sm flex flex-col shrink-0">
       <div className="flex items-center text-[var(--tp-text-secondary)] text-[10px] font-bold tracking-widest uppercase mb-4">
          <Activity className="w-3.5 h-3.5 mr-2 opacity-80" />
          Mobility
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[var(--tp-text-muted)] font-semibold uppercase tracking-wider">Traffic</span>
            <span className={`text-[13px] font-bold tracking-wide ${
              trafficState === 'FREE' ? 'text-[var(--tp-traffic-free)]' :
              trafficState === 'MODERATE' ? 'text-[var(--tp-traffic-moderate)]' :
              trafficState === 'HEAVY' ? 'text-[var(--tp-traffic-heavy)]' :
              trafficState === 'SEVERE' ? 'text-[var(--tp-traffic-severe)]' : 'text-[var(--tp-text-secondary)]'
            }`}>{trafficState}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[var(--tp-text-muted)] font-semibold uppercase tracking-wider">Incidents</span>
            <span className="text-lg font-light text-[var(--tp-text-primary)] leading-none">{incidentCount.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[var(--tp-text-muted)] font-semibold uppercase tracking-wider">Hotspots</span>
            <span className="text-lg font-light text-[var(--tp-text-primary)] leading-none">{hotspotCount.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[var(--tp-text-muted)] font-semibold uppercase tracking-wider">Nodes</span>
            <span className="text-lg font-light text-[var(--tp-text-primary)] leading-none">{nodeCount.toString().padStart(2, '0')}</span>
          </div>
        </div>
    </div>
  );

  const renderActiveAlert = () => {
    const isSevere = activeAlert && (activeAlert.severity === 'high' || activeAlert.severity === 'critical');
    
    return (
      <div className={`border rounded-xl p-5 shadow-sm flex flex-col gap-3 shrink-0 transition-[var(--tp-transition)] ${
        activeAlert 
          ? isSevere 
            ? 'bg-red-950/20 border-red-900/50' 
            : 'bg-[var(--tp-surface)] border-[var(--tp-traffic-moderate)]/40 border-l-[3px] border-l-[var(--tp-traffic-moderate)]'
          : 'bg-[var(--tp-bg)] border-[var(--tp-border-light)] border-dashed opacity-70'
      }`}>
        <div className="flex items-center text-[10px] font-bold tracking-widest uppercase mb-1">
          {activeAlert ? (
            <span className={`flex items-center ${isSevere ? 'text-red-400' : 'text-[var(--tp-traffic-moderate)]'}`}>
              <AlertTriangle className="w-3.5 h-3.5 mr-2 opacity-90" />
              ⚠ ACTIVE ALERT
            </span>
          ) : (
            <span className="text-[var(--tp-text-muted)] flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-2 opacity-70" />
              NO ACTIVE ALERTS
            </span>
          )}
        </div>
        
        {activeAlert && (
          <>
            <div className="text-[14px] text-[var(--tp-text-primary)] font-semibold leading-tight">
              {activeAlert.title}
            </div>
            <div className="text-xs text-[var(--tp-text-secondary)]">
              {activeAlert.roadName} — <span className="uppercase text-[10px] font-medium bg-[var(--tp-bg)] px-1.5 py-0.5 rounded ml-1">{activeAlert.alertClass.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Impact</span>
                <span className="text-[13px] text-red-400 font-bold">+{activeAlert.expectedDelaySeconds ? Math.round(activeAlert.expectedDelaySeconds/60) : 0} min</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Forecast</span>
                <span className="text-[13px] text-[var(--tp-traffic-heavy)] font-bold">HEAVY</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDataSources = () => (
    <div className="flex flex-col h-full bg-[var(--tp-bg)]">
      {renderSectionHeader('Data Sources', 'System provenance and integrations')}
      <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
        {[
          { name: 'OPENSTREETMAP', type: 'Geometry', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: 'Static Cache' },
          { name: 'SIMULATION ENGINE', type: 'Traffic State', status: 'ACTIVE', dataClass: 'SIMULATED', freshness: 'Real-time' },
          { name: 'MAPBOX', type: 'Base Map', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: 'Live' },
          { name: 'INTELLIGENCE NODES', type: 'Sensors', status: 'ACTIVE', dataClass: 'SIMULATED', freshness: 'Real-time' },
          { name: 'WEATHER SERVICE', type: 'Environment', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: '15 mins' }
        ].map((src, i) => (
          <div key={i} className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-4 rounded-xl flex flex-col gap-3 shadow-sm hover:border-[var(--tp-border-light)] transition-[var(--tp-transition)]">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-[var(--tp-text-primary)] tracking-wide">{src.name}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold tracking-wider">{src.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Type</span><span className="text-[var(--tp-text-secondary)] font-medium">{src.type}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Data Class</span>
                {src.dataClass === 'SIMULATED' ? (
                   <span className="text-amber-400 font-semibold text-[11px] bg-amber-500/10 self-start px-1.5 py-0.5 rounded">{src.dataClass}</span>
                ) : (
                   <span className="text-[var(--tp-accent)] font-semibold text-[11px] bg-[var(--tp-accent-dim)] self-start px-1.5 py-0.5 rounded">{src.dataClass}</span>
                )}
              </div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Freshness</span><span className="text-[var(--tp-text-secondary)] font-medium">{src.freshness}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionHeader = (title: string, subtitle?: string) => (
    <div className="bg-[var(--tp-surface)] border-b border-[var(--tp-border)] p-5 shrink-0 shadow-sm z-10 relative">
      <h2 className="text-[14px] font-bold text-[var(--tp-text-primary)] tracking-widest uppercase">{title}</h2>
      {subtitle && <p className="text-[11px] font-medium text-[var(--tp-text-muted)] mt-1.5">{subtitle}</p>}
    </div>
  );

  const renderFeatureDetails = () => {
    if (!selectedFeature) return null;

    if (selectedFeature.type === 'camera') {
      const camera = mobilityState.cameras.find(c => c.id === selectedFeature.id);
      if (camera) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)]">
          {renderSectionHeader('Camera Details')}
          <div className="p-4"><CameraPreviewPanel camera={camera} /></div>
        </div>
      );
    }
    if (selectedFeature.type === 'checkpoint') {
      const chk = mobilityState.checkpoints.find(c => c.id === selectedFeature.id);
      if (chk) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)]">
          {renderSectionHeader('Intelligence Node')}
          <div className="p-4"><CheckpointPanel checkpoint={chk} /></div>
        </div>
      );
    }
    if (selectedFeature.type === 'incident') {
      const inc = mobilityState.incidents.find(i => i.id === selectedFeature.id);
      if (inc) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)]">
          {renderSectionHeader('Incident Details')}
          <div className="p-4 space-y-4">
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 shadow-sm">
              <p className="text-[13px] text-red-400 font-bold mb-2 tracking-wide">🚨 {inc.type.replace('_', ' ').toUpperCase()}</p>
              <p className="text-[var(--tp-text-primary)] text-[14px] font-medium mb-3 leading-snug">{inc.description}</p>
              <p className="text-[11px] text-[var(--tp-text-muted)] font-medium truncate">{inc.roadName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-[var(--tp-surface)] border border-[var(--tp-border)] rounded-xl p-4 shadow-sm text-xs">
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Severity</span><span className="text-[var(--tp-traffic-severe)] font-bold uppercase tracking-wider">{inc.severity}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Status</span><span className="text-[var(--tp-text-primary)] font-medium uppercase">{inc.status}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Data Class</span><span className="text-[var(--tp-accent)] font-medium bg-[var(--tp-accent-dim)] px-1.5 py-0.5 rounded self-start">{inc.dataClass}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Provenance</span><span className="text-[var(--tp-text-secondary)] font-medium">{inc.provenance}</span></div>
            </div>
          </div>
        </div>
      );
    }
    
    if (selectedFeature.type === 'route') {
      const seg = mobilityState.segments.find(s => s.id === selectedFeature.id);
      if (seg) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)]">
          {renderSectionHeader('Road Segment Details')}
          <div className="p-4 space-y-4 text-xs">
            <div className="bg-[var(--tp-surface)] border border-[var(--tp-border)] rounded-xl p-4">
              <p className="text-[14px] font-bold text-[var(--tp-text-primary)] mb-1">{seg.roadName || 'Unnamed Road'}</p>
              <p className="text-[11px] text-[var(--tp-text-muted)] font-medium">Class: <span className="uppercase text-[var(--tp-text-secondary)]">{seg.roadClass || 'unclassified'}</span></p>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-[var(--tp-surface)] border border-[var(--tp-border)] rounded-xl p-4">
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Traffic State</span><span className={`font-bold tracking-wide ${
                  seg.trafficState === 'free-flow' ? 'text-[var(--tp-traffic-free)]' :
                  seg.trafficState === 'moderate' ? 'text-[var(--tp-traffic-moderate)]' :
                  seg.trafficState === 'congested' ? 'text-[var(--tp-traffic-heavy)]' :
                  seg.trafficState === 'severe' ? 'text-[var(--tp-traffic-severe)]' : 'text-[var(--tp-text-secondary)]'
              } uppercase`}>{seg.trafficState}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Speed</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{Math.round(seg.currentSpeedKmh)} km/h</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Density</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{Math.round(seg.estimatedDensityVehPerKmPerLane)} veh/km/ln</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Flow</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{seg.estimatedFlowVehPerHour} veh/h</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Lanes</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{seg.laneCount}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Length</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{seg.lengthKm.toFixed(2)} km</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Data Class</span><span className="text-[var(--tp-accent)] font-medium">{seg.dataClass}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Provenance</span><span className="text-[var(--tp-text-secondary)] font-medium">{seg.provenance}</span></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-[var(--tp-bg)]">
        {renderSectionHeader('Feature Selected')}
        <div className="p-4 text-xs text-[var(--tp-text-muted)]">Feature ID: {selectedFeature.id}</div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedFeature) {
      return renderFeatureDetails();
    }

    switch(activeSection) {
      case 'overview':
        return (
          <div className="flex flex-col h-full space-y-4 p-4 overflow-y-auto no-scrollbar">
            {renderETA()}
            {renderMobilitySummary()}
            {renderActiveAlert()}
          </div>
        );
      
      case 'roadAhead':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            <div className="flex-1 overflow-y-auto no-scrollbar p-2">
              <RoadAheadPanel mobilityState={mobilityState} onFeatureClick={setSelectedFeature} />
            </div>
          </div>
        );

      case 'routes':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)] overflow-y-auto no-scrollbar">
             {renderSectionHeader('Active Routes', 'Comparison matrix of available routes')}
             <div className="p-4">
               <RouteComparisonPanel routes={mobilityState.routes} recommendedId={mobilityState.recommendedRouteId} />
             </div>
          </div>
        );
        
      case 'traffic': {
        const topSegments = [...mobilityState.segments].sort((a,b) => {
          const scoreA = (a.trafficState === 'severe' ? 3 : a.trafficState === 'congested' ? 2 : a.trafficState === 'moderate' ? 1 : 0);
          const scoreB = (b.trafficState === 'severe' ? 3 : b.trafficState === 'congested' ? 2 : b.trafficState === 'moderate' ? 1 : 0);
          return scoreB - scoreA;
        }).slice(0, 50);

        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('Traffic Density', 'Top 50 congested segments')}
            <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-2">
              {topSegments.map(s => (
                <button key={s.id} className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-3 rounded-xl flex justify-between items-center cursor-pointer hover:border-[var(--tp-border-light)] hover:bg-[var(--tp-surface-hover)] transition-[var(--tp-transition)] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)]" onClick={() => setSelectedFeature({ type: 'route', id: s.id, coordinates: s.coordinates[0] })}>
                  <div className="flex flex-col w-3/4 gap-1">
                    <span className="text-[13px] font-bold text-[var(--tp-text-primary)] truncate">{s.roadName || 'Unnamed Road'}</span>
                    <span className="text-[11px] text-[var(--tp-text-muted)] font-medium">{Math.round(s.currentSpeedKmh)} km/h — <span className="uppercase">{s.trafficState}</span></span>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    s.trafficState === 'severe' ? 'bg-[var(--tp-traffic-severe)]' :
                    s.trafficState === 'congested' ? 'bg-[var(--tp-traffic-heavy)]' :
                    s.trafficState === 'moderate' ? 'bg-[var(--tp-traffic-moderate)]' : 'bg-[var(--tp-traffic-free)]'
                  } shadow-sm ring-2 ring-black/20`} />
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'incidents':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('Active Incidents')}
            <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {mobilityState.incidents.map(inc => (
                <button key={inc.id} className="bg-[var(--tp-surface)] border border-red-900/30 p-4 rounded-xl cursor-pointer hover:bg-[var(--tp-surface-hover)] transition-[var(--tp-transition)] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)]" onClick={() => setSelectedFeature({ type: 'incident', id: inc.id, coordinates: inc.location })}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[12px] font-bold text-red-400 block tracking-wide">🚨 {inc.type.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-[9px] font-bold text-[var(--tp-text-muted)] bg-[var(--tp-bg)] border border-[var(--tp-border)] px-1.5 py-0.5 rounded uppercase tracking-wider">{inc.severity}</span>
                  </div>
                  <span className="text-[13px] font-medium text-[var(--tp-text-primary)] block leading-snug">{inc.description}</span>
                  <span className="text-[11px] text-[var(--tp-text-muted)] font-medium mt-2 block truncate">{inc.roadName}</span>
                </button>
              ))}
              {mobilityState.incidents.length === 0 && (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center mt-10 p-6 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">No active incidents in this city scenario.</div>
              )}
            </div>
          </div>
        );

      case 'cameras':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('Road Cameras')}
            <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {mobilityState.cameras.length > 0 ? mobilityState.cameras.map(cam => (
                <button key={cam.id} className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-4 rounded-xl cursor-pointer hover:bg-[var(--tp-surface-hover)] hover:border-[var(--tp-border-light)] transition-[var(--tp-transition)] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)]" onClick={() => setSelectedFeature({ type: 'camera', id: cam.id, coordinates: cam.location })}>
                  <span className="text-[13px] font-bold text-[var(--tp-text-primary)] block mb-1">📹 {cam.corridor}</span>
                  <span className="text-[11px] text-[var(--tp-accent)] font-medium uppercase tracking-wider">{cam.direction} | {cam.status}</span>
                </button>
              )) : (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center mt-10 p-6 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">NO CAMERAS AVAILABLE</div>
              )}
            </div>
          </div>
        );
        
      case 'checkpoints':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('Intelligence Nodes')}
            <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {mobilityState.checkpoints.length > 0 ? mobilityState.checkpoints.map(chk => (
                <button key={chk.id} className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-4 rounded-xl cursor-pointer hover:bg-[var(--tp-surface-hover)] hover:border-[var(--tp-border-light)] transition-[var(--tp-transition)] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)]" onClick={() => setSelectedFeature({ type: 'checkpoint', id: chk.id, coordinates: chk.location })}>
                  <span className="text-[13px] font-bold text-[var(--tp-text-primary)] block mb-2 truncate">● {chk.name}</span>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-[var(--tp-text-muted)] font-medium">
                    <span className="text-amber-400">Density: {chk.trafficDensity}</span>
                    <span>Speed: {chk.averageSpeedKmph} km/h</span>
                    <span>Data: <span className="text-[var(--tp-accent)] uppercase">{chk.dataClass}</span></span>
                    <span>Confidence: {chk.confidence}</span>
                  </div>
                </button>
              )) : (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center mt-10 p-6 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">NO DATA</div>
              )}
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('City Weather Context')}
            <div className="p-4 overflow-y-auto no-scrollbar">
              {mobilityState.weather ? (
                <div className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-5 rounded-xl shadow-sm">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Rainfall</span><span className="text-[13px] font-medium text-[var(--tp-text-primary)]">{mobilityState.weather.rainfall}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Visibility</span><span className="text-[13px] font-medium text-[var(--tp-text-primary)]">{mobilityState.weather.visibility}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Traffic Impact</span><span className="text-[13px] text-[var(--tp-traffic-heavy)] font-bold">{mobilityState.weather.trafficImpact}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Road Risk</span><span className="text-[13px] text-[var(--tp-traffic-severe)] font-bold">{mobilityState.weather.roadRiskImpact}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Data Class</span><span className="text-[11px] text-[var(--tp-accent)] font-medium uppercase bg-[var(--tp-accent-dim)] px-1.5 py-0.5 rounded self-start">{mobilityState.weather.dataClass}</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center mt-10 p-6 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">WEATHER UNAVAILABLE</div>
              )}
            </div>
          </div>
        );

      case 'roadQuality':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('Road Quality', 'Surface conditions and hazards')}
            <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {mobilityState.roadConditions.length > 0 ? mobilityState.roadConditions.map(rc => (
                <div key={rc.id} className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-4 rounded-xl flex flex-col gap-2 shadow-sm">
                  <span className="text-[13px] font-bold text-[var(--tp-text-primary)] block">{rc.roadName}</span>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-[var(--tp-text-muted)] font-medium">
                    <div className="flex flex-col"><span>Surface</span><span className={rc.surfaceQuality === 'Poor' ? 'text-red-400 font-bold' : 'text-[var(--tp-text-primary)]'}>{rc.surfaceQuality}</span></div>
                    <div className="flex flex-col"><span>Pothole Risk</span><span className={rc.potholeRisk === 'High' ? 'text-red-400 font-bold' : 'text-[var(--tp-text-primary)]'}>{rc.potholeRisk}</span></div>
                    <div className="flex flex-col"><span>Data Class</span><span className="text-[var(--tp-accent)] uppercase">{rc.dataClass}</span></div>
                  </div>
                </div>
              )) : (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center mt-10 p-6 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">NO DATA</div>
              )}
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="flex flex-col h-full bg-[var(--tp-bg)]">
            {renderSectionHeader('Risk & Forecast')}
            <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-4">
              <h3 className="text-[10px] font-bold text-[var(--tp-text-muted)] uppercase tracking-widest border-b border-[var(--tp-border)] pb-2 mb-1">Traffic Forecasts</h3>
              {mobilityState.forecasts.length > 0 ? mobilityState.forecasts.map(f => (
                <div key={f.id} className="bg-[var(--tp-surface)] border border-[var(--tp-border)] p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    <span className="text-[var(--tp-text-muted)]">Segment: {f.segmentId}</span>
                    <span className="text-[var(--tp-accent)] uppercase bg-[var(--tp-accent-dim)] px-1.5 py-0.5 rounded">{f.dataClass}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[13px] font-bold tracking-wide">
                    <span className="text-[var(--tp-text-secondary)] uppercase">{f.currentState}</span>
                    <span className="text-[var(--tp-text-muted)]">→</span>
                    <span className="text-[var(--tp-traffic-heavy)] uppercase">{f.predictedState}</span>
                  </div>
                  <div className="text-[10px] text-[var(--tp-text-muted)] font-medium">Horizon: +{f.forecastHorizon} min</div>
                </div>
              )) : (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center p-4 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">NO DATA</div>
              )}
              
              <h3 className="text-[10px] font-bold text-[var(--tp-text-muted)] uppercase tracking-widest border-b border-[var(--tp-border)] pb-2 mt-2 mb-1">Incident Risks</h3>
              {mobilityState.incidentRisks && mobilityState.incidentRisks.length > 0 ? mobilityState.incidentRisks.map(r => (
                <div key={r.id} className="bg-[var(--tp-surface)] border border-red-900/30 p-4 rounded-xl flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    <span className="text-[var(--tp-text-muted)]">Road: {r.roadId}</span>
                    <span className="text-[var(--tp-traffic-severe)] font-bold uppercase tracking-wider">{r.riskLevel}</span>
                  </div>
                  <div className="text-[10px] text-[var(--tp-text-muted)] font-medium">Score: <span className="text-[var(--tp-text-primary)]">{r.score}/100</span></div>
                  <div className="text-[10px] text-[var(--tp-text-muted)] font-medium leading-relaxed">Factors: {r.contributingFactors.join(', ')}</div>
                </div>
              )) : (
                <div className="text-[12px] font-medium text-[var(--tp-text-muted)] text-center p-4 bg-[var(--tp-surface)] rounded-xl border border-dashed border-[var(--tp-border)]">NO DATA</div>
              )}
            </div>
          </div>
        );

      case 'dataSources':
        return renderDataSources();

      default:
        return (
          <div className="flex flex-col h-full space-y-4 p-4 overflow-y-auto no-scrollbar">
            {renderETA()}
            {renderMobilitySummary()}
          </div>
        );
    }
  };

  return (
    <div className="w-[332px] h-full bg-[var(--tp-bg)] border-l border-[var(--tp-border)] shrink-0 flex flex-col min-w-0 min-h-0 shadow-[-4px_0_24px_rgba(0,0,0,0.5)] z-20">
      {selectedFeature && (
        <div className="p-3 border-b border-[var(--tp-border)] bg-[var(--tp-surface)] shrink-0 shadow-sm z-30">
          <button 
            onClick={() => setSelectedFeature(null)}
            className="text-[11px] font-bold tracking-wide text-[var(--tp-accent)] hover:text-[var(--tp-accent-light)] flex items-center transition-[var(--tp-transition)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)] px-2 py-1 rounded"
          >
            ← BACK TO {activeSection.toUpperCase()}
          </button>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
    </div>
  );
}
