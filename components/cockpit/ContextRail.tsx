import React, { useState } from 'react';
import { MobilityState, Alert, Route, TrafficSegment } from '../../lib/mobility/types';
import { useCityContext } from '../../lib/contexts/CityContext';
import { Button, Icon, DataClassBadge } from '../ui/FigmaShared';
import RoadAheadPanel from './RoadAheadPanel';
import RouteComparisonPanel from './RouteComparisonPanel';
import CameraPreviewPanel from './CameraPreviewPanel';
import CheckpointPanel from './CheckpointPanel';

interface ContextRailProps {
  mobilityState: MobilityState;
}

function EtaCard({ mobilityState, driving }: { mobilityState: MobilityState, driving: boolean }) {
  const activeRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId) || mobilityState.routes[0];
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
  const totalDelay = incidentDelay + congestionDelay + forecastDelay;

  return (
    <section className="rail-section eta-card">
      <div className="section-heading"><span>ESTIMATED ARRIVAL</span><DataClassBadge type="Predicted" /></div>
      <div className="eta-row">
        <div className="eta-value">{totalETA}<small>MIN</small></div>
        <div className="eta-meta">
          <span>Typical <strong>{baseETA} min</strong></span>
          <span>Delay <strong className={totalDelay > 0 ? "severe-text" : "good-text"}>+{totalDelay} min</strong></span>
        </div>
      </div>
      {driving && <div className="drive-progress"><div><span>CURRENT ROUTE</span><strong>In progress</strong></div><div className="progress-track"><span style={{width: "42%"}} /></div></div>}
    </section>
  );
}

function MobilityCard({ mobilityState }: { mobilityState: MobilityState }) {
  const incidentCount = mobilityState.incidents.length;
  const nodeCount = mobilityState.checkpoints.length;
  const trafficState = mobilityState.segments.length > 0 ? mobilityState.segments[0].trafficState : 'unknown';

  const rows = [
    ["Traffic", trafficState.charAt(0).toUpperCase() + trafficState.slice(1)], 
    ["Nodes", `${nodeCount}`], 
    ["Incidents", `${incidentCount}`], 
    ["Avg. speed", `${mobilityState.segments.length > 0 ? Math.round(mobilityState.segments[0].currentSpeedKmh) : '--'} km/h`]
  ];

  return (
    <section className="rail-section">
      <div className="section-heading"><span>TRAFFIC INTELLIGENCE</span><DataClassBadge type="Observed" /></div>
      <div className="intel-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong className={label === "Traffic" && trafficState !== 'free-flow' ? (trafficState === 'severe' ? 'severe-text' : 'moderate-text') : ""}>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlertCard({ alert }: { alert?: Alert }) {
  if (!alert) {
    return (
      <section className="alert-card" style={{opacity: 0.6}}>
        <div className="alert-top"><span><Icon name="alert" size={16} /> NO ACTIVE ALERTS</span></div>
        <div className="alert-copy">Network is currently clear</div>
      </section>
    );
  }

  const isSevere = alert.severity === 'high' || alert.severity === 'critical';
  const delay = alert.expectedDelaySeconds ? Math.round(alert.expectedDelaySeconds/60) : 0;

  return (
    <section className="alert-card" style={isSevere ? { borderColor: 'rgba(255, 60, 60, 0.4)', backgroundColor: 'rgba(255, 60, 60, 0.05)' } : undefined}>
      <div className="alert-top"><span className={isSevere ? "severe-text" : "moderate-text"}><Icon name="alert" size={16} /> ACTIVE ALERT</span><span>NOW</span></div>
      <div className="alert-copy">{alert.title}</div>
      <div className="alert-road">{alert.roadName}</div>
      <div className="alert-stats">
        <div><small>IMPACT</small><strong className={delay > 0 ? "severe-text" : ""}>+{delay} min</strong></div>
        <div><small>CLASS</small><strong>{alert.alertClass.replace('_', ' ')}</strong></div>
        <div><small>FORECAST</small><strong>{alert.severity}</strong></div>
      </div>
    </section>
  );
}

export default function ContextRail({ mobilityState }: ContextRailProps) {
  const { activeSection, selectedFeature, setSelectedFeature, isDemoDriveActive } = useCityContext();

  const renderSectionHeader = (title: string, subtitle?: string, dataClass: "Observed" | "Predicted" | "Historical" | "Simulated" = "Simulated") => (
    <div className="section-heading" style={{ padding: "16px 20px" }}>
      <span>{title}</span>
      <DataClassBadge type={dataClass} />
    </div>
  );

  const renderDataSources = () => (
    <div className="flex flex-col h-full bg-[var(--tp-bg)] w-full">
      {renderSectionHeader('Data Sources', 'System provenance and integrations', "Historical")}
      <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
        {[
          { name: 'OPENSTREETMAP', type: 'Geometry', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: 'Static Cache' },
          { name: 'SIMULATION ENGINE', type: 'Traffic State', status: 'ACTIVE', dataClass: 'SIMULATED', freshness: 'Real-time' },
          { name: 'MAPBOX', type: 'Base Map', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: 'Live' },
          { name: 'INTELLIGENCE NODES', type: 'Sensors', status: 'ACTIVE', dataClass: 'SIMULATED', freshness: 'Real-time' },
          { name: 'WEATHER SERVICE', type: 'Environment', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: '15 mins' }
        ].map((src, i) => (
          <div key={i} className="rail-section" style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
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

  const renderFeatureDetails = () => {
    if (!selectedFeature) return null;

    if (selectedFeature.type === 'camera') {
      const camera = mobilityState.cameras.find(c => c.id === selectedFeature.id);
      if (camera) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)] w-full">
          {renderSectionHeader('Camera Details', undefined, "Observed")}
          <div className="p-4"><CameraPreviewPanel camera={camera} /></div>
        </div>
      );
    }
    if (selectedFeature.type === 'checkpoint') {
      const chk = mobilityState.checkpoints.find(c => c.id === selectedFeature.id);
      if (chk) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)] w-full">
          {renderSectionHeader('Intelligence Node', undefined, "Simulated")}
          <div className="p-4"><CheckpointPanel checkpoint={chk} /></div>
        </div>
      );
    }
    if (selectedFeature.type === 'incident') {
      const inc = mobilityState.incidents.find(i => i.id === selectedFeature.id);
      if (inc) return (
        <div className="flex flex-col h-full bg-[var(--tp-bg)] w-full">
          {renderSectionHeader('Incident Details', undefined, "Simulated")}
          <div className="p-4 space-y-4">
            <div className="rail-section" style={{ borderColor: 'rgba(255, 60, 60, 0.4)', backgroundColor: 'rgba(255, 60, 60, 0.05)', padding: '16px' }}>
              <p className="text-[13px] text-red-400 font-bold mb-2 tracking-wide">🚨 {inc.type.replace('_', ' ').toUpperCase()}</p>
              <p className="text-[var(--tp-text-primary)] text-[14px] font-medium mb-3 leading-snug">{inc.description}</p>
              <p className="text-[11px] text-[var(--tp-text-muted)] font-medium truncate">{inc.roadName}</p>
            </div>
            
            <div className="rail-section" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 8px' }}>
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
        <div className="flex flex-col h-full bg-[var(--tp-bg)] w-full">
          {renderSectionHeader('Road Segment', undefined, "Simulated")}
          <div className="p-4 space-y-4 text-xs">
            <div className="rail-section" style={{ padding: '16px' }}>
              <p className="text-[14px] font-bold text-[var(--tp-text-primary)] mb-1">{seg.roadName || 'Unnamed Road'}</p>
              <p className="text-[11px] text-[var(--tp-text-muted)] font-medium">Class: <span className="uppercase text-[var(--tp-text-secondary)]">{seg.roadClass || 'unclassified'}</span></p>
            </div>
            <div className="rail-section" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 8px' }}>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Traffic State</span><span className={`font-bold tracking-wide ${
                  seg.trafficState === 'free-flow' ? 'text-[var(--tp-traffic-free)]' :
                  seg.trafficState === 'moderate' ? 'text-[var(--tp-traffic-moderate)]' :
                  seg.trafficState === 'congested' ? 'text-[var(--tp-traffic-heavy)]' :
                  seg.trafficState === 'severe' ? 'text-[var(--tp-traffic-severe)]' : 'text-[var(--tp-text-secondary)]'
              } uppercase`}>{seg.trafficState}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Speed</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{Math.round(seg.currentSpeedKmh)} km/h</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Density</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{Math.round(seg.estimatedDensityVehPerKmPerLane)} veh/km/ln</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-[var(--tp-text-muted)] uppercase tracking-wider">Flow</span><span className="text-[13px] text-[var(--tp-text-primary)] font-medium">{seg.estimatedFlowVehPerHour} veh/h</span></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-[var(--tp-bg)] w-full">
        {renderSectionHeader('Feature Selected', undefined, "Observed")}
        <div className="p-4 text-xs text-[var(--tp-text-muted)]">Feature ID: {selectedFeature.id}</div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedFeature) {
      return renderFeatureDetails();
    }

    switch(activeSection) {
      case 'dataSources':
        return renderDataSources();
      case 'overview':
      case 'roadAhead':
      case 'traffic':
      case 'incidents':
      case 'cameras':
      case 'checkpoints':
      case 'weather':
      case 'roadQuality':
      case 'risk':
      case 'routes':
      default:
        return (
          <>
            <EtaCard mobilityState={mobilityState} driving={isDemoDriveActive} />
            <MobilityCard mobilityState={mobilityState} />
            <AlertCard alert={mobilityState.alerts[0]} />
          </>
        );
    }
  };

  return (
    <aside className="context-rail">
      <div className="rail-title">
        <div>
          <span>CONTEXT RAIL</span>
          <small>{selectedFeature ? "FEATURE SELECTED" : activeSection.toUpperCase()}</small>
        </div>
        <Button label="More context">•••</Button>
      </div>
      
      {selectedFeature && (
        <div className="p-3 border-b border-[var(--tp-border)] bg-[var(--tp-surface)] shrink-0 z-30 flex">
          <Button 
            onClick={() => setSelectedFeature(null)}
            className="w-full justify-center"
          >
            ← BACK TO {activeSection.toUpperCase()}
          </Button>
        </div>
      )}
      
      <div className="flex-1 flex flex-col w-full h-full overflow-y-auto no-scrollbar">
        {renderContent()}
      </div>
    </aside>
  );
}
