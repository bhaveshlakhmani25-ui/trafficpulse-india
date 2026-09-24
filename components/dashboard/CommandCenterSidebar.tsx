import React from 'react';
import { useCityContext } from '../../lib/contexts/CityContext';
import { 
  Map, 
  Eye, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Video, 
  Info, 
  Cloud, 
  ArrowRightLeft, 
  Server 
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', label: 'OVERVIEW', icon: Activity },
  { id: 'roadAhead', label: 'ROAD AHEAD', icon: Eye },
  { id: 'traffic', label: 'TRAFFIC', icon: Map },
  { id: 'incidents', label: 'INCIDENTS', icon: AlertTriangle },
  { id: 'risk', label: 'RISK & FORECAST', icon: ShieldCheck },
  { id: 'roadQuality', label: 'ROAD QUALITY', icon: MapPin },
  { id: 'cameras', label: 'CAMERAS', icon: Video },
  { id: 'checkpoints', label: 'CHECKPOINTS', icon: Info },
  { id: 'weather', label: 'WEATHER', icon: Cloud },
  { id: 'routes', label: 'ROUTES', icon: ArrowRightLeft },
  { id: 'dataSources', label: 'DATA SOURCES', icon: Server },
];

export default function CommandCenterSidebar() {
  const { activeCity, activeSection, setActiveSection, isTransitioning } = useCityContext();

  return (
    <nav aria-label="Main Navigation" className="w-full bg-[var(--tp-surface)] border-r border-[var(--tp-border)] flex flex-col h-full shrink-0 select-none">
      
      <div className="p-4 border-b border-[var(--tp-border)] flex flex-col items-center md:items-start bg-[var(--tp-bg)]/30">
        <span className="text-[10px] text-[var(--tp-text-muted)] font-semibold uppercase tracking-[0.15em] hidden md:block mb-1.5">
          Active Context
        </span>
        <div className="font-medium text-[var(--tp-text-primary)] flex items-center justify-center md:justify-start">
          <MapPin className="w-4 h-4 text-[var(--tp-accent)] mr-2 hidden md:block opacity-80" />
          <span className="truncate">{activeCity.name}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-0.5">
        {SECTIONS.map(section => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              disabled={isTransitioning}
              className={`group w-full flex items-center p-3 md:px-5 md:py-2.5 transition-[var(--tp-transition)] outline-none focus-visible:bg-[var(--tp-surface-hover)] focus-visible:ring-1 focus-visible:ring-[var(--tp-accent)] focus-visible:ring-inset ${
                isActive 
                  ? 'bg-[var(--tp-surface-elevated)] text-[var(--tp-text-primary)] border-r-[3px] border-[var(--tp-accent)]' 
                  : 'text-[var(--tp-text-secondary)] hover:bg-[var(--tp-surface-hover)] hover:text-[var(--tp-text-primary)] border-r-[3px] border-transparent'
              } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={section.label}
              aria-label={section.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className={`w-[18px] h-[18px] shrink-0 mx-auto md:mx-0 transition-[var(--tp-transition)] ${
                  isActive ? 'text-[var(--tp-accent)]' : 'group-hover:text-gray-300'
                }`} 
              />
              <span className={`ml-3.5 text-[13px] tracking-wide hidden md:block truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
