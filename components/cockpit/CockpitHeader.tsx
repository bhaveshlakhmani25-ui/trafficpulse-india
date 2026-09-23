import React from 'react';
import { CityRegistry } from '../../lib/config/CityRegistry';
import { useCityContext } from '../../lib/contexts/CityContext';

export default function CockpitHeader() {
  const { activeCity, setActiveCity, mobilityState, isDemoDriveActive, setDemoDriveActive, isTransitioning } = useCityContext();

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 text-white shrink-0 h-16 relative z-30 shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-black tracking-tight flex items-center">
          <span className="text-blue-500 mr-2">⧖</span>
          TrafficPulse
        </h1>
        <div className="h-6 w-px bg-gray-700" />
        <select 
          value={activeCity.id}
          disabled={isTransitioning}
          onChange={(e) => {
            setActiveCity(e.target.value);
          }}
          className={`bg-transparent text-sm font-medium focus:outline-none focus:ring-0 text-white cursor-pointer ${isTransitioning ? 'opacity-50' : ''}`}
        >
          {CityRegistry.getAllSupportedCities().map(name => {
            const cfg = CityRegistry.getCityConfig(name);
            return <option key={cfg.id} value={cfg.id} className="bg-gray-900">{cfg.name}</option>;
          })}
        </select>
        {activeCity.dataMode === 'simulation' && (
          <div className="flex items-center text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5" />
            SIMULATED DATA
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-xs text-gray-400 font-mono flex items-center space-x-4 mr-4 hidden md:flex">
          {isTransitioning ? (
            <span className="text-blue-400 animate-pulse">● SWITCHING MOBILITY CONTEXT...</span>
          ) : (
            <span>● SYSTEM ACTIVE</span>
          )}
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <button
          disabled={isTransitioning}
          onClick={() => setDemoDriveActive(!isDemoDriveActive)}
          className={`${isDemoDriveActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'} text-white text-xs font-bold py-1.5 px-3 rounded shadow transition-colors hidden sm:block ${isTransitioning ? 'opacity-50' : ''}`}
        >
          {isDemoDriveActive ? 'STOP DEMO DRIVE' : 'START DEMO DRIVE'}
        </button>
      </div>
    </div>
  );
}
