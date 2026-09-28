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
    >
      <span className="nav-icon"><Icon name={item.icon} size={17} /></span>
      <span className="nav-label">{item.label}</span>
      {item.note && <span className="nav-note">{item.note}</span>}
    </Button>
  );
}

export default function CommandCenterSidebar() {
  const { activeSection, setActiveSection, isTransitioning, mobilityState } = useCityContext();

  // Add notes based on active state (e.g., number of incidents)
  const viewsWithNotes = views.map(v => {
    if (v.id === 'incidents' && mobilityState?.incidents?.length) {
      return { ...v, note: mobilityState.incidents.length.toString() };
    }
    return v;
  });

  return (
    <aside className="sidebar">
      <div className="nav-caption">INTELLIGENCE</div>
      <nav className="nav-list" aria-label="Primary navigation">
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
      <div className="sidebar-system">
        <div className="system-orbit"><span>{mobilityState ? calculateMobilityIndex(mobilityState) : '--'}</span><small>MOBILITY</small></div>
        <div>
          <span className="sidebar-system-title">{isTransitioning ? 'Updating Network' : 'Network stable'}</span>
          <small>{isTransitioning ? 'Syncing...' : 'Live'}</small>
        </div>
      </div>
      <div className="sidebar-footer">
        <span>TP / 01.4</span>
        <StatusIndicator label={isTransitioning ? "Syncing" : "Online"} tone={isTransitioning ? "cyan" : "good"} />
      </div>
    </aside>
  );
}
