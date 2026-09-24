'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import { useCityContext } from '../../lib/contexts/CityContext';
import CockpitHeader from '../cockpit/CockpitHeader';
import CommandCenterSidebar from './CommandCenterSidebar';
import RouteComparisonPanel from '../cockpit/RouteComparisonPanel';
import ContextRail from '../cockpit/ContextRail';
import LocationSelector from '../LocationSelector';

// Dynamically import MobilityMap
const MobilityMap = dynamic(() => import('../map/MobilityMap'), { ssr: false });

export default function CommandCenterLayout() {
  const { activeCity, mobilityState, isDemoDriveActive, isTransitioning, activeSection, selectedFeature, setSelectedFeature } = useCityContext();

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // When activeSection changes, you might want to adjust map state, handled inside MobilityMap via context.

  if (!activeCity) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-950">
        <LocationSelector 
          onCitySelected={(cityName) => {
            // Handled through the city context provider logic but this acts as fallback
          }} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-gray-100 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* HEADER ROW */}
      <CockpitHeader />
      
      {/* MAIN CONTENT GRID */}
      <div 
        className="flex-1 grid overflow-hidden" 
        style={{ gridTemplateColumns: '264px minmax(0, 1fr) 332px' }}
      >
        
        {/* LEFT SIDEBAR (FIXED NAVIGATION) */}
        <div className="min-w-0 min-h-0 overflow-hidden h-full">
          <CommandCenterSidebar />
        </div>

        {/* CENTER MAP FRAME */}
        <div 
          ref={mapContainerRef} 
          className="relative bg-gray-900 border-x border-gray-800 shadow-2xl overflow-hidden min-w-0 min-h-0 h-full w-full map-frame-container"
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
          <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg p-3 text-xs shadow-lg pointer-events-none z-10">
            <h4 className="font-semibold text-gray-300 mb-2 uppercase tracking-wider">Traffic</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Free</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span>Moderate</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span>Heavy</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div><span>Severe</span></div>
            </div>
          </div>
          
          {/* TRANSITION OVERLAY */}
          {isTransitioning && (
             <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <span className="text-blue-500 text-4xl mb-4 animate-spin">⧖</span>
                <h2 className="text-2xl font-bold text-white mb-2">SWITCHING MOBILITY CONTEXT</h2>
                <h3 className="text-xl text-gray-400 mb-4">{activeCity.name}</h3>
                <p className="text-gray-500">Loading city intelligence...</p>
             </div>
          )}
        </div>

        {/* RIGHT CONTEXT RAIL (DYNAMIC BASED ON SECTION) */}
        <div className="min-w-0 min-h-0 overflow-hidden h-full">
          {mobilityState && (
            <ContextRail mobilityState={mobilityState} />
          )}
        </div>

      </div>

      {/* BOTTOM ROUTE BAR (ONLY SHOW IF ROUTES PRESENT OR IN A SPECIFIC SECTION) */}
      {mobilityState && (activeSection === 'routes' || activeSection === 'roadAhead') && (
        <div className="h-48 shrink-0 bg-gray-900 border-t border-gray-800 p-4 overflow-y-auto no-scrollbar z-20">
          <div className="max-w-7xl mx-auto flex gap-6">
            <div className="w-80 shrink-0 flex flex-col justify-center space-y-4 border-r border-gray-800 pr-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">From</span>
                <div className="bg-gray-800 rounded px-3 py-2 text-sm font-medium truncate">Current Location</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">To</span>
                <div className="bg-gray-800 rounded px-3 py-2 text-sm font-medium truncate">Destination</div>
              </div>
            </div>
            
            <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar pb-2 items-center">
              {mobilityState.scenarioState === 'RECOMMENDATION' ? (
                <RouteComparisonPanel 
                  routes={mobilityState.routes} 
                  recommendedId={mobilityState.recommendedRouteId} 
                />
              ) : (
                <div className="text-gray-500 text-sm flex items-center h-full">
                  {mobilityState.routes.length > 0 ? (
                    <RouteComparisonPanel 
                      routes={mobilityState.routes} 
                      recommendedId={mobilityState.recommendedRouteId} 
                    />
                  ) : (
                    <span>Route calculation pending...</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
