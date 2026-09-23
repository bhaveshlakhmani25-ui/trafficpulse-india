import React, { useState } from 'react';
import { MobilityState, Alert, Route } from '../../lib/mobility/types';
import { Clock, Navigation, AlertTriangle, ShieldAlert, Database, ChevronRight, ChevronDown, Activity, MapPin } from 'lucide-react';

interface ContextRailProps {
  mobilityState: MobilityState;
}

export default function ContextRail({ mobilityState }: ContextRailProps) {
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

  return (
    <div className="flex flex-col space-y-4 w-80 h-full overflow-y-auto no-scrollbar pb-4 shrink-0">
      
      {/* 1. ETA CARD */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
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

        {/* INLINE SEE WHY */}
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
            <div className="mt-3 text-[10px] text-gray-500 uppercase tracking-wider">
              Data: OBSERVED + HISTORICAL + PREDICTED
            </div>
          </div>
        )}
      </div>

      {/* 2. MOBILITY SUMMARY */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col space-y-3">
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

      {/* 3. ACTIVE ALERT */}
      <div className={`border rounded-xl p-4 shadow-lg flex flex-col space-y-2 ${
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

      {/* 4. DATA SOURCES */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <button 
          onClick={() => setShowSources(!showSources)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
        >
          <div className="flex items-center text-gray-400 text-xs font-semibold tracking-wider uppercase">
            <Database className="w-3 h-3 mr-1.5" />
            Data Sources
          </div>
          {showSources ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {showSources && (
          <div className="p-4 pt-0 border-t border-gray-800 bg-gray-900/50 text-xs flex flex-col space-y-3">
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400">Traffic</span>
              <span className="text-blue-400 font-medium uppercase text-[10px] bg-blue-900/30 px-2 py-0.5 rounded">SIMULATED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Checkpoints</span>
              <span className="text-blue-400 font-medium uppercase text-[10px] bg-blue-900/30 px-2 py-0.5 rounded">SIMULATED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Road Cameras</span>
              <span className="text-purple-400 font-medium uppercase text-[10px] bg-purple-900/30 px-2 py-0.5 rounded">DEMO SNAPSHOT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Road Quality</span>
              <span className="text-blue-400 font-medium uppercase text-[10px] bg-blue-900/30 px-2 py-0.5 rounded">SIMULATED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Routing</span>
              <span className="text-green-400 font-medium uppercase text-[10px] bg-green-900/30 px-2 py-0.5 rounded">MAPBOX / DETERMINISTIC</span>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
