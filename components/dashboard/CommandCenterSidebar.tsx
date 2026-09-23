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
    <div className="w-16 md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="p-4 border-b border-gray-800 flex flex-col items-center md:items-start">
        <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">Active Context</span>
        <div className="font-bold text-gray-100 mt-1 flex items-center justify-center md:justify-start">
          <MapPin className="w-5 h-5 text-blue-500 mr-2 hidden md:block" />
          <span className="truncate">{activeCity.name}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-1">
        {SECTIONS.map(section => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              disabled={isTransitioning}
              className={`w-full flex items-center p-3 md:px-4 md:py-3 transition-colors ${
                isActive 
                  ? 'bg-blue-900/30 text-blue-400 border-r-4 border-blue-500' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-r-4 border-transparent'
              } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={section.label}
              aria-label={section.label}
            >
              <Icon className="w-6 h-6 shrink-0 mx-auto md:mx-0" />
              <span className="ml-3 text-sm font-medium hidden md:block truncate">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
