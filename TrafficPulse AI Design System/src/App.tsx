import { useEffect, useState, type ReactNode } from "react";

type IconName =
  | "grid" | "road" | "traffic" | "incident" | "risk" | "quality"
  | "camera" | "checkpoint" | "weather" | "route" | "database"
  | "location" | "layers" | "plus" | "minus" | "compass" | "arrow"
  | "car" | "clock" | "chevron" | "alert" | "spark";

type View = {
  id: string;
  label: string;
  icon: IconName;
  note?: string;
};

const views: View[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "road-ahead", label: "Road Ahead", icon: "road" },
  { id: "traffic", label: "Traffic", icon: "traffic" },
  { id: "incidents", label: "Incidents", icon: "incident", note: "2" },
  { id: "risk", label: "Risk & Forecast", icon: "risk" },
  { id: "quality", label: "Road Quality", icon: "quality" },
  { id: "cameras", label: "Cameras", icon: "camera" },
  { id: "checkpoints", label: "Checkpoints", icon: "checkpoint" },
  { id: "weather", label: "Weather", icon: "weather" },
  { id: "routes", label: "Routes", icon: "route" },
  { id: "sources", label: "Data Sources", icon: "database" },
];

const iconPaths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  road: <><path d="M7 3l-2 18M17 3l2 18M12 4v4m0 4v4m0 4v1" /></>,
  traffic: <><path d="M5 19V9a7 7 0 0114 0v10" /><path d="M8 17h8M9 7h6M9 12h6" /></>,
  incident: <><path d="M12 3L2.8 20h18.4L12 3z" /><path d="M12 9v5m0 3h.01" /></>,
  risk: <><path d="M4 18l4-5 4 2 4-8 4 3" /><path d="M4 5v13h16" /></>,
  quality: <><path d="M4 18L8 6l4 12 4-12 4 12" /><path d="M3 21h18" /></>,
  camera: <><rect x="3" y="6" width="18" height="13" rx="2" /><circle cx="12" cy="12.5" r="3.5" /><path d="M8 6l1.5-2h5L16 6" /></>,
  checkpoint: <><path d="M5 21V5m14 16V5M3 8h18M3 15h18" /><path d="M8 8v7m8-7v7" /></>,
  weather: <><path d="M7 17a4 4 0 010-8 6 6 0 0111.5 2A3 3 0 0118 17H7z" /><path d="M8 20l-1 2m5-2l-1 2m5-2l-1 2" /></>,
  route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18c6 0 2-12 8-12" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z" /><circle cx="12" cy="10" r="2.5" /></>,
  layers: <><path d="M3 9l9-5 9 5-9 5-9-5z" /><path d="M3 14l9 5 9-5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  car: <><path d="M5 16l1.5-6h11l1.5 6" /><rect x="3" y="14" width="18" height="5" rx="2" /><path d="M7 19v2m10-2v2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chevron: <path d="M8 10l4 4 4-4" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6m0 4h.01" /></>,
  spark: <><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" /><path d="M19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16z" /></>,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

const NativeButton = "button";

function Button({ children, className = "", onClick, label, pressed }: { children: ReactNode; className?: string; onClick?: () => void; label?: string; pressed?: boolean }) {
  return <NativeButton className={`button ${className}`} onClick={onClick} aria-label={label} aria-pressed={pressed}>{children}</NativeButton>;
}

function DataClassBadge({ type }: { type: "Observed" | "Historical" | "Predicted" | "Simulated" }) {
  return <span className={`data-badge ${type.toLowerCase()}`}><span className="status-dot" />{type}</span>;
}

function StatusIndicator({ label, tone = "good" }: { label: string; tone?: "good" | "warn" | "danger" | "cyan" }) {
  return <span className={`status-indicator ${tone}`}><span className="status-dot" />{label}</span>;
}

function TrafficPulseHeader({ driving, setDriving }: { driving: boolean; setDriving: (value: boolean) => void }) {
  const [time, setTime] = useState("10:59 AM");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark"><span /><span /><span /></div>
        <div><div className="brand-name">TrafficPulse</div><div className="brand-ai">AI ROAD INTELLIGENCE</div></div>
      </div>
      <Button className="city-selector" label="Select city">
        <Icon name="location" size={16} /><span><small>CITY</small>Delhi</span><Icon name="chevron" size={15} />
      </Button>
      <div className="header-provenance"><DataClassBadge type="Simulated" /><span className="header-rule" /><span className="network-label">NETWORK 09–DEL</span></div>
      <div className="header-actions">
        <StatusIndicator label="System active" />
        <div className="clock"><small>LOCAL TIME</small>{time}</div>
        <Button className={driving ? "drive-button active" : "drive-button"} onClick={() => setDriving(!driving)}>
          <Icon name={driving ? "route" : "car"} size={17} />{driving ? "Drive active" : "Start demo drive"}
        </Button>
      </div>
    </header>
  );
}

function SidebarItem({ item, active, onSelect }: { item: View; active: boolean; onSelect: () => void }) {
  return (
    <Button className={`nav-item ${active ? "active" : ""}`} onClick={onSelect} pressed={active}>
      <span className="nav-icon"><Icon name={item.icon} size={17} /></span>
      <span className="nav-label">{item.label}</span>
      {item.note && <span className="nav-note">{item.note}</span>}
    </Button>
  );
}

function SidebarNavigation({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <aside className="sidebar">
      <div className="nav-caption">INTELLIGENCE</div>
      <nav className="nav-list" aria-label="Primary navigation">
        {views.map((item) => <SidebarItem key={item.id} item={item} active={active === item.id} onSelect={() => onSelect(item.id)} />)}
      </nav>
      <div className="sidebar-system">
        <div className="system-orbit"><span>78</span><small>MOBILITY</small></div>
        <div><span className="sidebar-system-title">Network stable</span><small>Last sync 12s ago</small></div>
      </div>
      <div className="sidebar-footer"><span>TP / 01.4</span><StatusIndicator label="Online" /></div>
    </aside>
  );
}

function KpiMetric({ label, value, unit, meta, tone = "cyan" }: { label: string; value: string; unit?: string; meta: string; tone?: string }) {
  return (
    <div className={`kpi ${tone}`}>
      <div className="eyebrow">{label}</div>
      <div className="kpi-value">{value}<small>{unit}</small></div>
      <div className="kpi-meta"><span className="status-dot" />{meta}</div>
    </div>
  );
}

function TrafficLegend() {
  return (
    <div className="traffic-legend">
      {[["free", "Free flow"], ["moderate", "Moderate"], ["heavy", "Heavy"], ["severe", "Severe"]].map(([tone, label]) => (
        <div key={tone}><span className={`legend-line ${tone}`} />{label}</div>
      ))}
    </div>
  );
}

function MapControls() {
  return (
    <div className="map-controls">
      <Button label="Recenter map"><Icon name="compass" /></Button>
      <Button label="Map layers"><Icon name="layers" /></Button>
      <span />
      <Button label="Zoom in"><Icon name="plus" /></Button>
      <Button label="Zoom out"><Icon name="minus" /></Button>
    </div>
  );
}

function MobilityMap({ activeView, onIncident }: { activeView: string; onIncident: () => void }) {
  const showLayer = activeView !== "sources";
  return (
    <section className="map-frame" aria-label="Delhi road intelligence map">
      <div className="map-top">
        <div>
          <div className="map-title"><span>DELHI</span><small>CITY MOBILITY</small></div>
          <div className="map-subtitle">LIVE NETWORK VIEW <span>•</span> 28.6139° N, 77.2090° E</div>
        </div>
        <DataClassBadge type={activeView === "risk" ? "Predicted" : "Simulated"} />
      </div>
      <svg className="map-canvas" viewBox="0 0 900 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="mapGrid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="currentColor" strokeOpacity=".07" /></pattern>
          <filter id="cyanGlow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width="900" height="520" className="map-base" />
        <rect width="900" height="520" fill="url(#mapGrid)" />
        <g className="districts">
          <path d="M-40 112C120 80 172 155 278 116S445 56 548 96s175 20 382-38" />
          <path d="M-20 416c120-52 208-20 292-72s160-29 260 23 218 45 390-18" />
          <path d="M86-20c30 95-3 157 52 226s59 159 32 336" />
          <path d="M676-30c-43 91-17 173-57 239s-12 185 70 342" />
        </g>
        <g className="blocks">
          <path d="M110 104l73-22 46 45-18 68-86 8-38-49zM285 78l91 9 30 55-60 49-77-20-16-54zM447 79l83-17 63 59-18 71-98 9-39-60zM640 91l87-24 75 47-8 80-94 20-60-49zM76 251l100-23 58 56-22 86-103 12-59-65zM279 226l89-9 53 56-16 90-107 10-48-67zM472 233l86-18 70 65-24 80-93 12-62-59zM681 247l104-22 58 54-19 88-112 7-43-65z" />
        </g>
        <g className="minor-roads">
          <path d="M0 186C132 167 209 219 321 190s191-15 290 24 184 22 289 4M0 306c127-22 198 29 297 10s187-15 276 19 204 12 327-6M55 0c54 105 14 208 68 309s68 132 70 211M255 0c-28 108 18 186 3 278s17 162 64 242M458 0c18 80-30 162 8 257s20 175-13 263M774 0c-21 103 22 185-6 293s13 167 49 227" />
          <path d="M0 243l900 26M194 0l62 520M592 0l-31 520" />
        </g>
        {showLayer && <g className="traffic-roads">
          <path className="road-shadow" d="M-20 420C118 363 207 390 313 315s183-127 295-107 142 17 312-95" />
          <path className="route-active" d="M-20 420C118 363 207 390 313 315s183-127 295-107 142 17 312-95" />
          <path className="road-free" d="M82 130c125 10 174 65 286 58" />
          <path className="road-moderate" d="M368 188c98-8 157 40 239 20" />
          <path className="road-heavy" d="M608 208c71-16 115-35 179-67" />
          <path className="road-severe" d="M548 354c84-25 161-3 273-58" />
        </g>}
        <g className="labels">
          <text x="90" y="113">CONNAUGHT PLACE</text><text x="674" y="118">INDIA GATE</text>
          <text x="365" y="291">KASTURBA GANDHI MARG</text><text x="608" y="391">LODHI ROAD</text>
          <text x="109" y="404">CENTRAL DELHI</text>
        </g>
        {showLayer && <g>
          <g transform="translate(116 370)" className="route-pin start"><circle r="8" /><circle r="3" /></g>
          <g transform="translate(774 142)" className="route-pin end"><circle r="10" /><path d="M-3-3h6v6h-6z" /></g>
          <g transform="translate(593 343)" className="incident-pin" onClick={onIncident}><circle r="16" /><path d="M0-7L8 7H-8z" /><path d="M0-2v4m0 2h.01" /></g>
          <g transform="translate(432 254)" className="selected-road"><rect x="-74" y="-21" width="148" height="42" rx="9" /><text x="-58" y="-4">SELECTED ROAD</text><text x="-58" y="11">ASHOKA ROAD · 31 KM/H</text></g>
          <g className="vehicles">
            <g transform="translate(230 353) rotate(-20)"><rect x="-8" y="-4" width="16" height="8" rx="3" /><circle cx="-4" cy="5" r="1.5" /><circle cx="4" cy="5" r="1.5" /></g>
            <g transform="translate(510 224) rotate(-10)"><rect x="-8" y="-4" width="16" height="8" rx="3" /><circle cx="-4" cy="5" r="1.5" /><circle cx="4" cy="5" r="1.5" /></g>
            <g transform="translate(690 189) rotate(-22)"><rect x="-8" y="-4" width="16" height="8" rx="3" /><circle cx="-4" cy="5" r="1.5" /><circle cx="4" cy="5" r="1.5" /></g>
          </g>
        </g>}
      </svg>
      <MapControls />
      <TrafficLegend />
      <div className="map-scale">500 M <span /></div>
    </section>
  );
}

function EtaCard({ driving }: { driving: boolean }) {
  return (
    <section className="rail-section eta-card">
      <div className="section-heading"><span>ESTIMATED ARRIVAL</span><DataClassBadge type="Predicted" /></div>
      <div className="eta-row"><div className="eta-value">7<small>MIN</small></div><div className="eta-meta"><span>Typical <strong>7 min</strong></span><span>Delay <strong className="good-text">+0 min</strong></span></div></div>
      {driving && <div className="drive-progress"><div><span>CURRENT ROUTE</span><strong>42% complete</strong></div><div className="progress-track"><span /></div></div>}
    </section>
  );
}

function MobilityCard() {
  const rows = [["Traffic", "Moderate"], ["Density", "42 veh/km"], ["Flow", "1,420 veh/h"], ["Avg. speed", "28 km/h"]];
  return (
    <section className="rail-section">
      <div className="section-heading"><span>TRAFFIC INTELLIGENCE</span><DataClassBadge type="Observed" /></div>
      <div className="intel-grid">{rows.map(([label, value]) => <div key={label}><span>{label}</span><strong className={label === "Traffic" ? "moderate-text" : ""}>{value}</strong></div>)}</div>
    </section>
  );
}

function AlertCard() {
  return (
    <section className="alert-card">
      <div className="alert-top"><span><Icon name="alert" size={16} /> ACTIVE ALERT</span><span>15 MIN</span></div>
      <div className="alert-copy">Moderate congestion likely ahead</div>
      <div className="alert-road">Kasturba Gandhi Marg <Icon name="arrow" size={14} /> India Gate</div>
      <div className="alert-stats"><div><small>IMPACT</small><strong>+6 min</strong></div><div><small>FORECAST</small><strong>Heavy</strong></div><div><small>CONFIDENCE</small><strong>High</strong></div></div>
    </section>
  );
}

function RoadAheadTimeline() {
  const stops = [
    ["NOW", "Ashoka Road", "Free flow", "free"],
    ["+2 MIN", "K. Gandhi Marg", "Moderate", "moderate"],
    ["+5 MIN", "India Gate Approach", "Heavy", "heavy"],
  ];
  return (
    <section className="rail-section road-ahead">
      <div className="section-heading"><span>ROAD AHEAD</span><span className="distance">3.2 KM</span></div>
      <div className="timeline">{stops.map(([time, road, state, tone]) => <div className="timeline-stop" key={time}><span className={`timeline-dot ${tone}`} /><div><small>{time}</small><strong>{road}</strong><span className={`${tone}-text`}>{state}</span></div></div>)}</div>
    </section>
  );
}

function ContextRail({ driving, selectedIncident }: { driving: boolean; selectedIncident: boolean }) {
  return (
    <aside className="context-rail">
      <div className="rail-title"><div><span>CONTEXT RAIL</span><small>{selectedIncident ? "INCIDENT SELECTED" : "ROUTE 01 / ACTIVE"}</small></div><Button label="More context">•••</Button></div>
      <EtaCard driving={driving} />
      <MobilityCard />
      <AlertCard />
      <RoadAheadTimeline />
    </aside>
  );
}

function TrafficTrend() {
  return (
    <section className="analytics-card trend-card">
      <div className="analytics-head"><div><span>TRAFFIC TREND</span><small>PAST 30 MIN → NEXT 15 MIN</small></div><div><DataClassBadge type="Observed" /><DataClassBadge type="Predicted" /></div></div>
      <svg viewBox="0 0 500 100" className="trend-chart" preserveAspectRatio="none" aria-label="Traffic intensity trend">
        <path className="chart-grid" d="M0 20H500M0 50H500M0 80H500" />
        <path className="area-path" d="M0 78C42 70 48 64 90 68s52 9 86-10 56-35 88-22 42 29 81 6 54-8 72-23l83-11v92H0z" />
        <path className="observed-path" d="M0 78C42 70 48 64 90 68s52 9 86-10 56-35 88-22 42 29 81 6" />
        <path className="predicted-path" d="M345 42c39-23 54-8 72-23l83-11" />
        <path className="now-line" d="M345 0v100" /><circle cx="345" cy="42" r="4" />
      </svg>
      <div className="chart-axis"><span>-30 MIN</span><span>NOW</span><span>+15 MIN</span></div>
    </section>
  );
}

function CongestionDistribution() {
  const rows = [["Free flow", "38%", "free", 38], ["Moderate", "42%", "moderate", 42], ["Heavy", "16%", "heavy", 16], ["Severe", "4%", "severe", 4]];
  return (
    <section className="analytics-card distribution">
      <div className="analytics-head"><div><span>CONGESTION MIX</span><small>DELHI NETWORK</small></div><DataClassBadge type="Simulated" /></div>
      <div className="bar-list">{rows.map(([label, percent, tone, width]) => <div className="bar-row" key={String(label)}><span><i className={String(tone)} />{label}</span><div className="bar-track"><i className={String(tone)} style={{ width: `${width}%` }} /></div><strong>{percent}</strong></div>)}</div>
    </section>
  );
}

function RiskForecast() {
  return (
    <section className="analytics-card risk-card">
      <div className="analytics-head"><div><span>RISK FORECAST</span><small>NEXT 15 MIN</small></div><DataClassBadge type="Predicted" /></div>
      <div className="risk-shift"><span>MODERATE</span><Icon name="arrow" size={15} /><strong>HEAVY</strong></div>
      <div className="risk-stats"><span>Incident risk <strong>Elevated</strong></span><span>Expected delay <strong>+6 min</strong></span><span>Confidence <strong>78%</strong></span></div>
    </section>
  );
}

function RoadQualityCard() {
  return (
    <section className="analytics-card quality-card">
      <div className="analytics-head"><div><span>ROAD QUALITY</span><small>ACTIVE ROUTE</small></div><DataClassBadge type="Historical" /></div>
      <div className="quality-score"><span>86<small>/100</small></span><div><strong>GOOD</strong><small>2 minor surface events</small></div></div>
      <div className="quality-line"><span /><i /><i /></div>
    </section>
  );
}

const viewContent: Record<string, { title: string; intro: string; facts: Array<[string, string]> }> = {
  "road-ahead": { title: "Road Ahead", intro: "A sequenced view of conditions you are about to experience.", facts: [["NEXT CHANGE", "Moderate in 2 min"], ["ROUTE WINDOW", "7 minutes"], ["AHEAD", "3.2 km"]] },
  traffic: { title: "Traffic Network", intro: "Live mobility performance across the simulated Delhi road network.", facts: [["NETWORK STATE", "Moderate"], ["AVG. SPEED", "28 km/h"], ["FLOW", "1,420 veh/h"]] },
  incidents: { title: "Active Incidents", intro: "Two verified events currently influence central Delhi mobility.", facts: [["OPEN EVENTS", "02"], ["ROUTE IMPACT", "+6 min"], ["PRIORITY", "Elevated"]] },
  risk: { title: "Risk & Forecast", intro: "Predicted network conditions for the next fifteen minutes.", facts: [["FORECAST", "Moderate → Heavy"], ["CONFIDENCE", "78%"], ["DELAY RISK", "+6 min"]] },
  quality: { title: "Road Quality", intro: "Surface quality and ride consistency on the active route.", facts: [["ROUTE SCORE", "86 / 100"], ["SURFACE EVENTS", "02"], ["CONDITION", "Good"]] },
  cameras: { title: "Camera Network", intro: "Roadside vision feeds available along the current route.", facts: [["AVAILABLE", "18"], ["ON ROUTE", "04"], ["STATUS", "All operational"]] },
  checkpoints: { title: "Checkpoints", intro: "Verified traffic and safety checkpoints across the network.", facts: [["ACTIVE", "06"], ["ON ROUTE", "01"], ["NEXT", "2.1 km"]] },
  weather: { title: "Weather Context", intro: "Local atmospheric conditions and their effect on road mobility.", facts: [["CONDITION", "Light haze"], ["VISIBILITY", "4.8 km"], ["ROAD EFFECT", "Low"]] },
  routes: { title: "Route Alternatives", intro: "Three route strategies balance arrival time, risk and consistency.", facts: [["FASTEST", "7 min"], ["BALANCED", "9 min"], ["LOW RISK", "11 min"]] },
  sources: { title: "Data Sources", intro: "Transparent provenance for every layer in the current network view.", facts: [["OPENSTREETMAP", "Geometry · Loaded"], ["MAPBOX", "Routing · Available"], ["TRAFFICPULSE", "Model · Active"]] },
};

function FeaturePanel({ view }: { view: string }) {
  const content = viewContent[view];
  if (!content) return null;
  return (
    <section className="feature-panel">
      <div className="feature-title"><span className="eyebrow">{view === "sources" ? "SYSTEM PROVENANCE" : "SELECTED FEATURE"}</span><div>{content.title}</div><p>{content.intro}</p></div>
      <div className="feature-facts">{content.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="feature-actions"><DataClassBadge type={view === "risk" ? "Predicted" : view === "quality" ? "Historical" : "Simulated"} /><Button>View details <Icon name="arrow" size={14} /></Button></div>
    </section>
  );
}

function RouteBar({ driving, setDriving }: { driving: boolean; setDriving: (value: boolean) => void }) {
  return (
    <footer className="route-bar">
      <div className="route-path">
        <div className="route-node start"><span /><div><small>FROM</small><strong>Central Delhi</strong></div></div>
        <div className="route-connector"><span /></div>
        <div className="route-node end"><span /><div><small>TO</small><strong>India Gate</strong></div></div>
      </div>
      <div className="route-summary"><div><strong>7</strong><small>MIN</small></div><span>+0 MIN DELAY</span><span className="moderate-text"><i /> MODERATE</span></div>
      {driving && <div className="current-road"><small>CURRENT ROAD</small><strong>Ashoka Road</strong><span>Next · K. Gandhi Marg</span></div>}
      <div className="route-actions"><Button className="route-options"><Icon name="route" size={16} />Route options</Button><Button className={driving ? "drive-button active" : "drive-button"} onClick={() => setDriving(!driving)}><Icon name={driving ? "route" : "car"} size={17} />{driving ? "Drive active" : "Start demo drive"}</Button></div>
    </footer>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("overview");
  const [driving, setDriving] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(false);
  return (
    <main className="page">
      <div className="ambient-lines" />
      <div className="app-shell">
        <TrafficPulseHeader driving={driving} setDriving={setDriving} />
        <SidebarNavigation active={activeView} onSelect={(id) => { setActiveView(id); setSelectedIncident(id === "incidents"); }} />
        <div className="workspace">
          <div className="primary-column">
            <div className="kpi-row">
              <KpiMetric label="Mobility index" value="78" unit="/100" meta="+4 today" />
              <KpiMetric label="Traffic" value="Moderate" meta="Stable for 8 min" tone="moderate" />
              <KpiMetric label="Avg. speed" value="31" unit="km/h" meta="+2.1 km/h" />
              <KpiMetric label="Active incidents" value="02" meta="1 on route" tone="orange" />
            </div>
            <MobilityMap activeView={activeView} onIncident={() => { setSelectedIncident(true); setActiveView("incidents"); }} />
            {activeView !== "overview" && <FeaturePanel view={activeView} />}
            <div className="analytics-grid">
              <TrafficTrend />
              <CongestionDistribution />
              <RiskForecast />
              <RoadQualityCard />
            </div>
          </div>
          <ContextRail driving={driving} selectedIncident={selectedIncident} />
        </div>
        <RouteBar driving={driving} setDriving={setDriving} />
      </div>
    </main>
  );
}
