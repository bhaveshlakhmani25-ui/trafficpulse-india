import React from 'react';
import { CityConfig, CityRegistry } from '../../lib/config/CityRegistry';
import { demoScenarioEngine } from '../../lib/simulation/ScenarioEngine';
import { MobilityState } from '../../lib/mobility/types';

interface CockpitHeaderProps {
  activeCity: CityConfig;
  setActiveCity: (city: CityConfig) => void;
  mobilityState: MobilityState;
}

export default function CockpitHeader({ activeCity, setActiveCity, mobilityState }: CockpitHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 text-white z-20 absolute top-0 left-0 right-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-black tracking-tight flex items-center">
          <span className="text-blue-500 mr-2">⧖</span>
          TrafficPulse
        </h1>
        <div className="h-6 w-px bg-gray-700" />
        <select 
          value={activeCity.id}
          onChange={(e) => {
            const newCity = CityRegistry.getCityConfig(e.target.value);
            setActiveCity(newCity);
            demoScenarioEngine.resetScenario();
          }}
          className="bg-transparent text-sm font-medium focus:outline-none focus:ring-0 text-white cursor-pointer"
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
        <div className="text-xs text-gray-400 font-mono flex items-center space-x-4 mr-4">
          <span>● SYSTEM ACTIVE</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <button
          onClick={() => demoScenarioEngine.triggerIncident()}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded shadow transition-colors"
        >
          SIMULATE INCIDENT
        </button>
        <button
          onClick={() => demoScenarioEngine.resetScenario()}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1.5 px-3 rounded shadow transition-colors"
        >
          RESET
        </button>
      </div>
    </div>
  );
}
