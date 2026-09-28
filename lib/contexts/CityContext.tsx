'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CityConfig, CityRegistry } from '../config/CityRegistry';
import { MobilityState, FocusedFeature } from '../mobility/types';
import { demoScenarioEngine } from '../simulation/ScenarioEngine';
import { getRouteContextState } from '../mobility/selectors';

interface CityContextValue {
  activeCity: CityConfig;
  activeSection: string;
  selectedFeature: FocusedFeature | null;
  isDemoDriveActive: boolean;
  isTransitioning: boolean;
  mobilityState: MobilityState | null;
  sidebarCollapsed: boolean;
  mapMode: '3d' | '2d' | 'satellite';
  
  setActiveCity: (cityId: string) => Promise<void>;
  setActiveSection: (section: string) => void;
  setSelectedFeature: (feature: FocusedFeature | null) => void;
  setDemoDriveActive: (active: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMapMode: (mode: '3d' | '2d' | 'satellite') => void;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [activeCity, setActiveCityState] = useState<CityConfig>(CityRegistry.getCityConfig('delhi')); // Default to Delhi
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedFeature, setSelectedFeature] = useState<FocusedFeature | null>(null);
  const [isDemoDriveActive, setDemoDriveActive] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true); // start as transitioning
  const [mobilityState, setMobilityState] = useState<MobilityState | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'3d' | '2d' | 'satellite'>('2d');

  const transitionRef = useRef(0); // Version ID for stale request protection

  useEffect(() => {
    // Initial load
    let mounted = true;
    demoScenarioEngine.resetScenario(activeCity.id).then(() => {
      if (mounted) setIsTransitioning(false);
    });

    const unsubscribe = demoScenarioEngine.subscribe((state) => {
      // Only update mobility state if it belongs to the active city
      // This enforces stale request protection
      if (state.cityId === activeCity.id) {
        setMobilityState(getRouteContextState({ ...state }));
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [activeCity.id]);

  const setActiveCity = async (cityId: string) => {
    if (cityId === activeCity.id) return;

    const newCity = CityRegistry.getCityConfig(cityId);
    if (!newCity) return;

    // Start transition
    setIsTransitioning(true);
    const currentVersion = ++transitionRef.current;

    // Clear UI state
    setActiveSection('overview');
    setSelectedFeature(null);
    setDemoDriveActive(false);

    // Swap city context
    setActiveCityState(newCity);
    
    // Stop simulator, regenerate and restart (handled internally by ScenarioEngine)
    await demoScenarioEngine.resetScenario(newCity.id);

    // If another city switch happened while we were loading, ignore this completion
    if (transitionRef.current === currentVersion) {
      setIsTransitioning(false);
    }
  };

  const value: CityContextValue = {
    activeCity,
    activeSection,
    selectedFeature,
    isDemoDriveActive,
    isTransitioning,
    mobilityState,
    sidebarCollapsed,
    mapMode,
    setActiveCity,
    setActiveSection,
    setSelectedFeature,
    setDemoDriveActive,
    setSidebarCollapsed,
    setMapMode,
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
}

export function useCityContext() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}
