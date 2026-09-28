import React from 'react';
import { useCityContext } from '../../lib/contexts/CityContext';
import { Button, Icon, StatusIndicator, IconName } from '../ui/FigmaShared';
import { calculateMobilityIndex } from '../../lib/mobility/selectors';

type View = {
  id: string;
  label: string;
  icon: IconName;
  note?: string;
};

const views: View[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "roadAhead", label: "Road Ahead", icon: "road" },
  { id: "traffic", label: "Traffic", icon: "traffic" },
  { id: "incidents", label: "Incidents", icon: "incident" },
  { id: "risk", label: "Risk & Forecast", icon: "risk" },
  { id: "roadQuality", label: "Road Quality", icon: "quality" },
  { id: "cameras", label: "Cameras", icon: "camera" },
  { id: "checkpoints", label: "Checkpoints", icon: "checkpoint" },
  { id: "weather", label: "Weather", icon: "weather" },
  { id: "routes", label: "Routes", icon: "route" },
  { id: "dataSources", label: "Data Sources", icon: "database" },
];

function SidebarItem({ item, active, onSelect, disabled }: { item: View; active: boolean; onSelect: () => void; disabled: boolean }) {
  return (
    <Button 
      className={`nav-item ${active ? "active" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} 
      onClick={disabled ? undefined : onSelect} 
      pressed={active}
      title={item.label}
    >
      <span className="nav-icon"><Icon name={item.icon} size={17} /></span>
      <span className="nav-label">{item.label}</span>
      {item.note && <span className="nav-note">{item.note}</span>}
    </Button>
  );
}

export default function CommandCenterSidebar() {
  const { activeSection, setActiveSection, isTransitioning, mobilityState, sidebarCollapsed, setSidebarCollapsed } = useCityContext();

  // Add notes based on active state (e.g., number of incidents)
  const viewsWithNotes = views.map(v => {
    if (v.id === 'incidents' && mobilityState?.incidents?.length) {
      return { ...v, note: mobilityState.incidents.length.toString() };
    }
    return v;
  });

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div className="nav-caption shrink-0 flex justify-between items-center w-full">
        <span className="sidebar-title-text">INTELLIGENCE</span>
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-[var(--sidebar-muted)] hover:text-white transition-colors"
          aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          <Icon name={sidebarCollapsed ? "chevron-right" : "chevron"} size={16} />
        </button>
      </div>
      <nav className="nav-list shrink-0" aria-label="Primary navigation">
        {viewsWithNotes.map((item) => (
          <SidebarItem 
            key={item.id} 
            item={item} 
            active={activeSection === item.id} 
            onSelect={() => setActiveSection(item.id)} 
            disabled={isTransitioning}
          />
        ))}
      </nav>
      
      <div className="nav-caption shrink-0 mt-6 border-t border-[var(--sidebar-border)] pt-6">ACCOUNT</div>
      <nav className="nav-list shrink-0 mb-6">
         <div className="nav-item opacity-60 cursor-not-allowed flex items-center">
            <span className="nav-icon"><Icon name="clock" size={17} /></span>
            <span className="nav-label">Sign in</span>
         </div>
         <div className="nav-item opacity-60 cursor-not-allowed flex items-center">
            <span className="nav-icon"><Icon name="route" size={17} /></span>
            <span className="nav-label">Manage profile</span>
         </div>
         <div className="nav-item opacity-60 cursor-not-allowed flex items-center">
            <span className="nav-icon"><Icon name="layers" size={17} /></span>
            <span className="nav-label">Preferences</span>
         </div>
      </nav>

      <div className="sidebar-system shrink-0 mt-auto">
        <div className="system-orbit"><span>{mobilityState ? calculateMobilityIndex(mobilityState) : '--'}</span><small>MOBILITY</small></div>
        <div>
          <span className="sidebar-system-title">{isTransitioning ? 'Updating Network' : 'Network stable'}</span>
          <small>{isTransitioning ? 'Syncing...' : 'Live'}</small>
        </div>
      </div>
      <div className="sidebar-footer shrink-0">
        <span>TP / 01.4</span>
        <StatusIndicator label={isTransitioning ? "Syncing" : "Online"} tone={isTransitioning ? "cyan" : "good"} />
      </div>
    </aside>
  );
}
