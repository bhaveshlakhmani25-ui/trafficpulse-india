'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import { useCityContext } from '../../lib/contexts/CityContext';
import CockpitHeader from '../cockpit/CockpitHeader';
import CommandCenterSidebar from './CommandCenterSidebar';
import ContextRail from '../cockpit/ContextRail';
import RoadAheadPanel from '../cockpit/RoadAheadPanel';
import RouteComparisonPanel from '../cockpit/RouteComparisonPanel';
import LocationSelector from '../LocationSelector';
import RouteBar from '../cockpit/RouteBar';
import { DataClassBadge } from '../ui/FigmaShared';
import TrafficTrend from '../cockpit/TrafficTrend';
import CongestionDistribution from '../cockpit/CongestionDistribution';
import RiskForecast from '../cockpit/RiskForecast';
import RoadQualityCard from '../cockpit/RoadQualityCard';
import FeaturePanel from '../cockpit/FeaturePanel';
import { calculateMobilityIndex, calculateAverageSpeed, getNetworkTrafficState } from '../../lib/mobility/selectors';

// Dynamically import MobilityMap
const MobilityMap = dynamic(() => import('../map/MobilityMap'), { ssr: false });

export default function CommandCenterLayout() {
  const { activeCity, mobilityState, isDemoDriveActive, isTransitioning, activeSection, selectedFeature, setSelectedFeature } = useCityContext();

  const mapContainerRef = useRef<HTMLDivElement>(null);

  if (!activeCity) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-950">
        <LocationSelector 
          onCitySelected={(cityName) => {}} 
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="ambient-lines" />
      <div className="app-shell">
        
        {/* HEADER ROW */}
        <CockpitHeader />
        
        {/* MAIN WORKSPACE */}
        <div className="workspace">
          
          {/* LEFT SIDEBAR (FIXED NAVIGATION) */}
          <CommandCenterSidebar />
          
          {/* CONTENT AREA */}
          <div className="content-area">
            
            {/* KPI Row */}
              <div className="kpi-row">
                <div className="kpi cyan">
                  <div className="eyebrow">Mobility index</div>
                  <div className="kpi-value">{mobilityState ? calculateMobilityIndex(mobilityState) : '--'}<small>/100</small></div>
                  <div className="kpi-meta"><span className="status-dot" />Current Simulated Score</div>
                </div>
                <div className="kpi moderate">
                  <div className="eyebrow">Traffic</div>
                  <div className="kpi-value">{mobilityState ? getNetworkTrafficState(mobilityState) : '--'}</div>
                  <div className="kpi-meta"><span className="status-dot" />Network-wide</div>
                </div>
                <div className="kpi cyan">
                  <div className="eyebrow">Avg. speed</div>
                  <div className="kpi-value">{mobilityState ? calculateAverageSpeed(mobilityState) : '--'}<small>km/h</small></div>
                  <div className="kpi-meta"><span className="status-dot" />Simulated Network</div>
                </div>
                <div className="kpi orange">
                  <div className="eyebrow">Active incidents</div>
                  <div className="kpi-value">{mobilityState ? (mobilityState.incidents.length.toString().padStart(2, '0')) : '00'}</div>
                  <div className="kpi-meta"><span className="status-dot" />Simulated</div>
                </div>
              </div>

              {/* CENTER MAP FRAME */}
              <div 
                ref={mapContainerRef} 
                className="map-frame"
              >
                {mobilityState && (
                  <MobilityMap 
                    mobilityState={mobilityState} 
                    activeCity={activeCity} 
                    focusedFeature={selectedFeature}
                    onFeatureSelect={setSelectedFeature}
                    isDemoDriveActive={isDemoDriveActive}
                    activeSection={activeSection}
                  />
                )}
                
                {/* COMPACT MAP LEGEND */}
                <div className="absolute bottom-4 right-4 bg-[#0d1724]/80 backdrop-blur-md border border-[var(--border)] rounded-lg p-3 text-xs shadow-lg pointer-events-none z-10">
                  <h4 className="font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Traffic</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--green)]"></div><span className="text-[var(--text-primary)]">Free</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--yellow)]"></div><span className="text-[var(--text-primary)]">Moderate</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--orange)]"></div><span className="text-[var(--text-primary)]">Heavy</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--red)]"></div><span className="text-[var(--text-primary)]">Severe</span></div>
                  </div>
                </div>
                
                {/* TRANSITION OVERLAY */}
                {isTransitioning && (
                   <div className="absolute inset-0 bg-[#0d1724]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                      <span className="text-[var(--cyan)] text-4xl mb-4 animate-spin">⧖</span>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">SWITCHING MOBILITY CONTEXT</h2>
                      <h3 className="text-xl text-[var(--text-secondary)] mb-4">{activeCity.name}</h3>
                      <p className="text-[var(--text-muted)]">Loading city intelligence...</p>
                   </div>
                )}
              </div>
              
              {activeSection === 'roadAhead' && mobilityState && (
                <div className="mb-4 mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-4">
                  <RoadAheadPanel mobilityState={mobilityState} onFeatureClick={setSelectedFeature} />
                </div>
              )}
              {activeSection === 'routes' && mobilityState && (
                <div className="mb-4 mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-4">
                  <RouteComparisonPanel routes={mobilityState.routes} recommendedId={mobilityState.recommendedRouteId} />
                </div>
              )}
              
              {activeSection !== 'overview' && <FeaturePanel view={activeSection} />}
              
              {/* Analytics Grid Container (Replaces old fixed elements) */}
            {activeSection !== 'overview' && (
              <div className="analytics-grid">
                <TrafficTrend />
                <CongestionDistribution />
                <RiskForecast />
                <RoadQualityCard />
              </div>
            )}
          </div>

          {/* RIGHT CONTEXT RAIL (DYNAMIC BASED ON SECTION) */}
          {mobilityState && (
            <ContextRail mobilityState={mobilityState} />
          )}
        </div>

        {/* BOTTOM ROUTE BAR */}
        {mobilityState && (
          <RouteBar />
        )}

      </div>
    </div>
  );
}
