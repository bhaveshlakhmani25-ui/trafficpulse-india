import React from 'react';
import { CityRegistry } from '../../lib/config/CityRegistry';
import { useCityContext } from '../../lib/contexts/CityContext';
import { Activity, Clock } from 'lucide-react';

export default function CockpitHeader() {
  const { activeCity, setActiveCity, isDemoDriveActive, setDemoDriveActive, isTransitioning } = useCityContext();

  return (
    <header className="flex items-center justify-between px-6 py-0 bg-[var(--tp-surface)] border-b border-[var(--tp-border)] text-[var(--tp-text-primary)] shrink-0 h-16 relative z-30 shadow-lg select-none">
      
      {/* Left: Branding & City Selector */}
      <div className="flex items-center gap-6 h-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Activity className="w-5 h-5 text-[var(--tp-accent)]" />
          </div>
          <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-gray-400">
            TrafficPulse
          </h1>
        </div>
        
        <div className="h-6 w-px bg-[var(--tp-border)]" />
        
        <div className="relative flex items-center">
          <select 
            value={activeCity.id}
            disabled={isTransitioning}
            onChange={(e) => setActiveCity(e.target.value)}
            className={`appearance-none bg-[var(--tp-surface-hover)] border border-[var(--tp-border-light)] text-[var(--tp-text-primary)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--tp-accent)] rounded px-3 py-1.5 pr-8 cursor-pointer transition-[var(--tp-transition)] hover:bg-gray-800 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Select City"
          >
            {CityRegistry.getAllSupportedCities().map(name => {
              const cfg = CityRegistry.getCityConfig(name);
              return <option key={cfg.id} value={cfg.id} className="bg-[var(--tp-surface)]">{cfg.name}</option>;
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--tp-text-secondary)]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Middle: Data Provenance Badge */}
      <div className="flex-1 flex justify-center h-full items-center pointer-events-none">
        {activeCity.dataMode === 'simulation' && (
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            SIMULATED DATA
          </div>
        )}
      </div>

      {/* Right: System Status & Demo Controls */}
      <div className="flex items-center gap-6 h-full">
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-[var(--tp-text-secondary)]">
          {isTransitioning ? (
            <div className="flex items-center gap-2 text-[var(--tp-accent)]">
              <span className="animate-pulse">●</span>
              <span>SWITCHING CONTEXT</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">●</span>
              <span>SYSTEM ACTIVE</span>
            </div>
          )}
          <div className="h-4 w-px bg-[var(--tp-border)]" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 opacity-70" />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <button
          disabled={isTransitioning}
          onClick={() => setDemoDriveActive(!isDemoDriveActive)}
          className={`hidden sm:flex items-center justify-center text-xs font-bold py-1.5 px-4 rounded transition-[var(--tp-transition)] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--tp-bg)] ${
            isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isDemoDriveActive 
              ? 'bg-[var(--tp-surface-hover)] text-red-400 border border-red-500/30 hover:bg-red-500/10 focus:ring-red-500' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500 focus:ring-cyan-500'
          }`}
        >
          {isDemoDriveActive ? 'STOP DEMO DRIVE' : 'START DEMO DRIVE'}
        </button>
      </div>
    </header>
  );
}
