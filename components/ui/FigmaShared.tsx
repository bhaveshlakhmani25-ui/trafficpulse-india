import React, { ReactNode } from "react";

export type IconName =
  | "grid" | "road" | "traffic" | "incident" | "risk" | "quality"
  | "camera" | "checkpoint" | "weather" | "route" | "database"
  | "location" | "layers" | "plus" | "minus" | "compass" | "arrow"
  | "car" | "clock" | "chevron" | "alert" | "spark";

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

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

const NativeButton = "button";

export function Button({ children, className = "", onClick, label, pressed }: { children: ReactNode; className?: string; onClick?: () => void; label?: string; pressed?: boolean }) {
  return <NativeButton className={`button ${className}`} onClick={onClick} aria-label={label} aria-pressed={pressed}>{children}</NativeButton>;
}

export function DataClassBadge({ type }: { type: "Observed" | "Historical" | "Predicted" | "Simulated" }) {
  return <span className={`data-badge ${type.toLowerCase()}`}><span className="status-dot" />{type}</span>;
}

export function StatusIndicator({ label, tone = "good" }: { label: string; tone?: "good" | "warn" | "danger" | "cyan" }) {
  return <span className={`status-indicator ${tone}`}><span className="status-dot" />{label}</span>;
}
