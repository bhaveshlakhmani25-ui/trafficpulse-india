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
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col shrink-0">
      <div className="p-4 flex flex-col space-y-3">
        <div className="flex items-center text-gray-400 text-xs font-semibold tracking-wider uppercase">
          <Navigation className="w-3 h-3 mr-1.5" />
          Estimated Arrival
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-4xl font-light text-white tracking-tight">
            {totalETA} <span className="text-xl text-gray-500 font-normal">min</span>
          </div>
          <div className="text-right flex flex-col gap-0.5">
            <div className="text-xs text-gray-500">Typical: {baseETA} min</div>
            {incidentDelay + congestionDelay > 0 && (
              <div className="text-xs text-orange-400 font-medium">Delay: +{incidentDelay + congestionDelay} min</div>
            )}
            {forecastDelay > 0 && (
              <div className="text-xs text-red-400 font-medium">Forecast: +{forecastDelay} min</div>
            )}
          </div>
        </div>
        
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden flex">
          <div className="bg-blue-500 h-full" style={{ width: `${(baseETA / Math.max(1, totalETA)) * 100}%` }}></div>
          {(incidentDelay + congestionDelay) > 0 && (
            <div className="bg-orange-500 h-full" style={{ width: `${((incidentDelay + congestionDelay) / totalETA) * 100}%` }}></div>
          )}
          {forecastDelay > 0 && (
            <div className="bg-red-500 h-full" style={{ width: `${(forecastDelay / totalETA) * 100}%` }}></div>
          )}
        </div>
        
        <button 
          onClick={() => setShowETAWhy(!showETAWhy)}
          className="text-xs text-blue-400 hover:text-blue-300 self-start font-medium transition-colors"
        >
          {showETAWhy ? 'Hide Analysis' : 'See Why'}
        </button>
      </div>

      {showETAWhy && (
        <div className="bg-gray-800/50 p-4 border-t border-gray-800 text-sm">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="text-gray-400">WHY IS ETA {totalETA} MIN?</span>
            <span className="text-blue-400 font-medium">Confidence: High</span>
          </div>
          <ul className="space-y-1.5 text-gray-300">
            {mobilityState.evidence.length > 0 ? (
              mobilityState.evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="flex-1 leading-snug">{ev.value} - {ev.contribution}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="flex-1 leading-snug">Normal traffic conditions observed</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  const renderMobilitySummary = () => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col space-y-3 shrink-0">
       <div className="flex items-center text-gray-400 text-xs font-semibold tracking-wider uppercase">
          <Activity className="w-3 h-3 mr-1.5" />
          Mobility
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Traffic</span>
            <span className={`text-sm font-medium ${
              trafficState === 'FREE' ? 'text-green-400' :
              trafficState === 'MODERATE' ? 'text-yellow-400' :
              trafficState === 'HEAVY' ? 'text-orange-400' :
              trafficState === 'SEVERE' ? 'text-red-400' : 'text-gray-300'
            }`}>{trafficState}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Incidents</span>
            <span className="text-sm font-medium text-gray-200">{incidentCount.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Hotspots</span>
            <span className="text-sm font-medium text-gray-200">{hotspotCount.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Nodes</span>
            <span className="text-sm font-medium text-gray-200">{nodeCount.toString().padStart(2, '0')}</span>
          </div>
        </div>
    </div>
  );

  const renderActiveAlert = () => (
    <div className={`border rounded-xl p-4 shadow-lg flex flex-col space-y-2 shrink-0 ${
      activeAlert 
        ? 'bg-red-950/20 border-red-900/50' 
        : 'bg-gray-900 border-gray-800'
    }`}>
      <div className="flex items-center text-xs font-semibold tracking-wider uppercase mb-1">
        {activeAlert ? (
          <span className="text-red-400 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1.5" />
            ⚠ ACTIVE ALERT
          </span>
        ) : (
          <span className="text-gray-500 flex items-center">
            <ShieldAlert className="w-3 h-3 mr-1.5" />
            NO ACTIVE ALERTS
          </span>
        )}
      </div>
      
      {activeAlert && (
        <>
          <div className="text-sm text-gray-100 font-medium">
            {activeAlert.title}
          </div>
          <div className="text-xs text-gray-400 line-clamp-2">
            {activeAlert.roadName} - {activeAlert.alertClass.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <div className="flex flex-col">
              <span className="text-gray-500 uppercase">Impact</span>
              <span className="text-red-400 font-medium">+{activeAlert.expectedDelaySeconds ? Math.round(activeAlert.expectedDelaySeconds/60) : 0} min</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 uppercase">Forecast</span>
              <span className="text-orange-400 font-medium">HEAVY</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderDataSources = () => (
    <div className="flex flex-col h-full bg-gray-950">
      {renderSectionHeader('Data Sources', 'System provenance and active data integrations')}
      <div className="p-4 overflow-y-auto no-scrollbar space-y-4">
        {[
          { name: 'OPENSTREETMAP', type: 'Geometry', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: 'Static Cache' },
          { name: 'SIMULATION ENGINE', type: 'Traffic State', status: 'ACTIVE', dataClass: 'SIMULATED', freshness: 'Real-time' },
          { name: 'MAPBOX', type: 'Base Map', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: 'Live' },
          { name: 'INTELLIGENCE NODES', type: 'Sensors', status: 'ACTIVE', dataClass: 'SIMULATED', freshness: 'Real-time' },
          { name: 'WEATHER SERVICE', type: 'Environment', status: 'ACTIVE', dataClass: 'OBSERVED', freshness: '15 mins' }
        ].map((src, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">{src.name}</span>
              <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded font-medium">{src.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Type</span><span className="text-gray-300">{src.type}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Data Class</span><span className="text-blue-400">{src.dataClass}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Freshness</span><span className="text-gray-300">{src.freshness}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionHeader = (title: string, subtitle?: string) => (
    <div className="bg-gray-900 border-b border-gray-800 p-4 shrink-0">
      <h2 className="text-sm font-bold text-white tracking-widest uppercase">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const renderFeatureDetails = () => {
    if (!selectedFeature) return null;

    if (selectedFeature.type === 'camera') {
      const camera = mobilityState.cameras.find(c => c.id === selectedFeature.id);
      if (camera) return (
        <div className="flex flex-col h-full bg-gray-950">
          {renderSectionHeader('Camera Details')}
          <div className="p-4"><CameraPreviewPanel camera={camera} /></div>
        </div>
      );
    }
    if (selectedFeature.type === 'checkpoint') {
      const chk = mobilityState.checkpoints.find(c => c.id === selectedFeature.id);
      if (chk) return (
        <div className="flex flex-col h-full bg-gray-950">
          {renderSectionHeader('Intelligence Node')}
          <div className="p-4"><CheckpointPanel checkpoint={chk} /></div>
        </div>
      );
    }
    if (selectedFeature.type === 'incident') {
      const inc = mobilityState.incidents.find(i => i.id === selectedFeature.id);
      if (inc) return (
        <div className="flex flex-col h-full bg-gray-950">
          {renderSectionHeader('Incident Details')}
          <div className="p-4 space-y-4">
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
              <p className="text-sm text-red-400 font-bold mb-1">🚨 {inc.type.toUpperCase()}</p>
              <p className="text-white text-sm mb-2">{inc.description}</p>
              <p className="text-xs text-gray-400">{inc.roadName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Severity</span><span className="text-orange-400 font-medium uppercase">{inc.severity}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Status</span><span className="text-gray-300 uppercase">{inc.status}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Data Class</span><span className="text-blue-400 font-medium">{inc.dataClass}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Provenance</span><span className="text-gray-300">{inc.provenance}</span></div>
            </div>
          </div>
        </div>
      );
    }
    
    if (selectedFeature.type === 'route') {
      const seg = mobilityState.segments.find(s => s.id === selectedFeature.id);
      if (seg) return (
        <div className="flex flex-col h-full bg-gray-950">
          {renderSectionHeader('Road Segment Details')}
          <div className="p-4 space-y-4 text-xs">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-sm font-bold text-white mb-1">{seg.roadName || 'Unnamed Road'}</p>
              <p className="text-gray-400">Class: {seg.roadClass || 'unclassified'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Traffic State</span><span className="text-orange-400 font-medium uppercase">{seg.trafficState}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Speed</span><span className="text-gray-300">{Math.round(seg.currentSpeedKmh)} km/h</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Density</span><span className="text-gray-300">{Math.round(seg.estimatedDensityVehPerKmPerLane)} veh/km/ln</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Flow</span><span className="text-gray-300">{seg.estimatedFlowVehPerHour} veh/h</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Lanes</span><span className="text-gray-300">{seg.laneCount}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Length</span><span className="text-gray-300">{seg.lengthKm.toFixed(2)} km</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Data Class</span><span className="text-blue-400 font-medium">{seg.dataClass}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 uppercase">Provenance</span><span className="text-gray-300">{seg.provenance}</span></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-gray-950">
        {renderSectionHeader('Feature Selected')}
        <div className="p-4 text-xs text-gray-400">Feature ID: {selectedFeature.id}</div>
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
          <div className="flex flex-col h-full bg-gray-950">
            <div className="flex-1 overflow-y-auto no-scrollbar p-2">
              <RoadAheadPanel mobilityState={mobilityState} onFeatureClick={setSelectedFeature} />
            </div>
          </div>
        );

      case 'routes':
        return (
          <div className="flex flex-col h-full bg-gray-950 overflow-y-auto no-scrollbar">
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
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('Traffic Density', 'Top 50 congested segments')}
            <div className="p-4 overflow-y-auto no-scrollbar space-y-3">
              {topSegments.map(s => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-800" onClick={() => setSelectedFeature({ type: 'route', id: s.id, coordinates: s.coordinates[0] })}>
                  <div className="flex flex-col w-3/4">
                    <span className="text-sm font-semibold text-white truncate">{s.roadName || 'Unnamed Road'}</span>
                    <span className="text-xs text-gray-400">{Math.round(s.currentSpeedKmh)} km/h - {s.trafficState}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    s.trafficState === 'severe' ? 'bg-red-500' :
                    s.trafficState === 'congested' ? 'bg-orange-500' :
                    s.trafficState === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'incidents':
        return (
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('Active Incidents')}
            <div className="p-4 overflow-y-auto no-scrollbar space-y-3">
              {mobilityState.incidents.map(inc => (
                <div key={inc.id} className="bg-gray-900 border border-red-900/30 p-3 rounded-lg cursor-pointer hover:bg-gray-800" onClick={() => setSelectedFeature({ type: 'incident', id: inc.id, coordinates: inc.location })}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-red-400 block">🚨 {inc.type.toUpperCase()}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded uppercase">{inc.severity}</span>
                  </div>
                  <span className="text-xs text-gray-200 block">{inc.description}</span>
                  <span className="text-xs text-gray-500 mt-2 block truncate">{inc.roadName}</span>
                </div>
              ))}
              {mobilityState.incidents.length === 0 && (
                <div className="text-xs text-gray-500 text-center mt-10">No active incidents in this city.</div>
              )}
            </div>
          </div>
        );

      case 'cameras':
        return (
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('Road Cameras')}
            <div className="p-4 overflow-y-auto no-scrollbar space-y-3">
              {mobilityState.cameras.length > 0 ? mobilityState.cameras.map(cam => (
                <div key={cam.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-800" onClick={() => setSelectedFeature({ type: 'camera', id: cam.id, coordinates: cam.location })}>
                  <span className="text-sm font-semibold text-white block mb-1">📹 {cam.corridor}</span>
                  <span className="text-xs text-blue-400">{cam.direction} | {cam.status}</span>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center mt-10">NO CAMERAS AVAILABLE</div>
              )}
            </div>
          </div>
        );
        
      case 'checkpoints':
        return (
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('Intelligence Nodes')}
            <div className="p-4 overflow-y-auto no-scrollbar space-y-3">
              {mobilityState.checkpoints.length > 0 ? mobilityState.checkpoints.map(chk => (
                <div key={chk.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-800" onClick={() => setSelectedFeature({ type: 'checkpoint', id: chk.id, coordinates: chk.location })}>
                  <span className="text-sm font-semibold text-white block mb-1 truncate">● {chk.name}</span>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-400 mt-2">
                    <span className="text-amber-400">Density: {chk.trafficDensity}</span>
                    <span>Speed: {chk.averageSpeedKmph} km/h</span>
                    <span>Data: <span className="text-blue-400 uppercase">{chk.dataClass}</span></span>
                    <span>Confidence: {chk.confidence}</span>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center mt-10">NO DATA</div>
              )}
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('City Weather Context')}
            <div className="p-4 overflow-y-auto no-scrollbar">
              {mobilityState.weather ? (
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col"><span className="text-gray-500 uppercase">Rainfall</span><span className="text-white">{mobilityState.weather.rainfall}</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 uppercase">Visibility</span><span className="text-white">{mobilityState.weather.visibility}</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 uppercase">Traffic Impact</span><span className="text-orange-400 font-medium">{mobilityState.weather.trafficImpact}</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 uppercase">Road Risk</span><span className="text-orange-400 font-medium">{mobilityState.weather.roadRiskImpact}</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 uppercase">Data Class</span><span className="text-blue-400 font-medium uppercase">{mobilityState.weather.dataClass}</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center mt-10">WEATHER UNAVAILABLE</div>
              )}
            </div>
          </div>
        );

      case 'roadQuality':
        return (
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('Road Quality', 'Surface conditions and hazards')}
            <div className="p-4 overflow-y-auto no-scrollbar space-y-3">
              {mobilityState.roadConditions.length > 0 ? mobilityState.roadConditions.map(rc => (
                <div key={rc.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex flex-col space-y-2">
                  <span className="text-sm font-semibold text-white block">{rc.roadName}</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                    <div className="flex flex-col"><span>Surface</span><span className={rc.surfaceQuality === 'Poor' ? 'text-red-400' : 'text-gray-200'}>{rc.surfaceQuality}</span></div>
                    <div className="flex flex-col"><span>Pothole Risk</span><span className={rc.potholeRisk === 'High' ? 'text-red-400' : 'text-gray-200'}>{rc.potholeRisk}</span></div>
                    <div className="flex flex-col"><span>Data Class</span><span className="text-blue-400 uppercase">{rc.dataClass}</span></div>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center mt-10">NO DATA</div>
              )}
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="flex flex-col h-full bg-gray-950">
            {renderSectionHeader('Risk & Forecast')}
            <div className="p-4 overflow-y-auto no-scrollbar space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase">Traffic Forecasts</h3>
              {mobilityState.forecasts.length > 0 ? mobilityState.forecasts.map(f => (
                <div key={f.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Segment: {f.segmentId}</span>
                    <span className="text-blue-400 uppercase">{f.dataClass}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <span className="text-gray-300 uppercase">{f.currentState}</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-orange-400 uppercase">{f.predictedState}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Horizon: +{f.forecastHorizon} min</div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center">NO DATA</div>
              )}
              
              <h3 className="text-xs font-semibold text-gray-400 uppercase mt-4">Incident Risks</h3>
              {mobilityState.incidentRisks && mobilityState.incidentRisks.length > 0 ? mobilityState.incidentRisks.map(r => (
                <div key={r.id} className="bg-gray-900 border border-red-900/30 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Road: {r.roadId}</span>
                    <span className="text-red-400 font-medium uppercase">{r.riskLevel}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Score: {r.score}/100</div>
                  <div className="text-[10px] text-gray-400">Factors: {r.contributingFactors.join(', ')}</div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center">NO DATA</div>
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
    <div className="w-80 h-full bg-gray-950 border-l border-gray-800 shrink-0 flex flex-col min-w-0 min-h-0">
      {selectedFeature && (
        <div className="p-2 border-b border-gray-800 bg-gray-900 shrink-0">
          <button 
            onClick={() => setSelectedFeature(null)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center font-medium"
          >
            ← Back to {activeSection.toUpperCase()}
          </button>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
