'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const MobilityMap = dynamic(() => import('../map/MobilityMap'), { ssr: false });
import { demoScenarioEngine } from '../../lib/simulation/ScenarioEngine';
import { MobilityState } from '../../lib/mobility/types';
import { CityRegistry, CityConfig } from '../../lib/config/CityRegistry';
import LocationSelector from '../LocationSelector';
import CockpitHeader from '../cockpit/CockpitHeader';
import RoadAheadPanel from '../cockpit/RoadAheadPanel';
import ETAPanel from '../cockpit/ETAPanel';
import RouteComparisonPanel from '../cockpit/RouteComparisonPanel';
import CityOverviewPanel from '../cockpit/CityOverviewPanel';
import DataSourcesDrawer from '../cockpit/DataSourcesDrawer';
import AlertPreviewPanel from '../cockpit/AlertPreviewPanel';
import RoadConditionPanel from '../cockpit/RoadConditionPanel';

export default function DashboardShell() {
  const [mobilityState, setMobilityState] = useState<MobilityState | null>(null);
  const [activeCity, setActiveCity] = useState<CityConfig | null>(null);

  useEffect(() => {
    const unsubscribe = demoScenarioEngine.subscribe((state) => {
      setMobilityState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  if (!mobilityState) return null;

  if (!activeCity) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-950">
        <LocationSelector 
          onCitySelected={(cityName) => {
            setActiveCity(CityRegistry.getCityConfig(cityName));
          }} 
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden font-sans text-gray-100 selection:bg-blue-500/30">
      
      {/* BACKGROUND MAP */}
      <div className="absolute inset-0 z-0">
        <MobilityMap mobilityState={mobilityState} activeCity={activeCity} />
      </div>

      {/* FOREGROUND COCKPIT UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        <CockpitHeader 
          activeCity={activeCity} 
          setActiveCity={setActiveCity} 
          mobilityState={mobilityState} 
        />
        
        {/* LEFT COLUMN: Road Ahead & Navigation Context */}
        <div className="absolute left-6 top-20 flex flex-col pointer-events-auto">
          <RoadAheadPanel mobilityState={mobilityState} />
          <RoadConditionPanel mobilityState={mobilityState} />
        </div>

        {/* BOTTOM CENTER: Route comparison */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6 items-end pointer-events-auto">
          {mobilityState.scenarioState === 'RECOMMENDATION' && (
            <RouteComparisonPanel 
              routes={mobilityState.routes} 
              recommendedId={mobilityState.recommendedRouteId} 
            />
          )}
        </div>

        {/* RIGHT COLUMN: ETA, Alerts, Overview */}
        <div className="absolute right-6 top-20 flex flex-col space-y-4 pointer-events-auto items-end">
          <CityOverviewPanel mobilityState={mobilityState} activeCity={activeCity} />
          
          <ETAPanel mobilityState={mobilityState} />

          {mobilityState.alerts.length > 0 && (
            <AlertPreviewPanel alert={mobilityState.alerts[0]} />
          )}
        </div>

        {/* BOTTOM RIGHT: Sources drawer */}
        <div className="pointer-events-auto">
          <DataSourcesDrawer />
        </div>
      </div>

    </div>
  );
}
