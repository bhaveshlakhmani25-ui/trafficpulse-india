export type SourceType = 'simulation' | 'mapbox' | 'iudx' | 'user';
export type Provenance = 'DEMO_SIMULATION' | 'MAPBOX_DIRECTIONS_API' | 'IUDX_ADAPTIVE_TRAFFIC' | 'BTP_HISTORICAL' | 'SYSTEM_GENERATED' | 'CITY_SIMULATION';
export type IncidentType = 'accident' | 'breakdown' | 'construction' | 'hazard' | 'congestion';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type TrafficState = 'free-flow' | 'moderate' | 'congested' | 'severe';
export type DataClass = 'OBSERVED' | 'HISTORICAL' | 'PREDICTED';

export type FocusedFeature = {
  type: "incident" | "checkpoint" | "camera" | "hotspot" | "route";
  id: string;
  coordinates: [number, number];
};

export interface Evidence {
  id: string;
  type: string;
  source: string;
  observedAt: string;
  value: string;
  contribution: string; // e.g. "increases risk", "causes delay"
  provenance: Provenance;
  dataClass: DataClass;
}

export interface BaseEntity {
  id: string;
  sourceType: SourceType;
  provenance: Provenance;
  dataClass: DataClass;
}

export interface TrafficSegment extends BaseEntity {
  coordinates: [number, number][]; // [lon, lat]
  roadName: string;
  lengthKm: number;
  laneCount: number;
  freeFlowSpeedKmh: number;
  currentSpeedKmh: number;
  trafficState: TrafficState;
  estimatedDensityVehPerKmPerLane: number;
  estimatedFlowVehPerHour: number;
  direction: 'forward' | 'backward';
  trend: 'improving' | 'stable' | 'worsening';
  timestamp: string;
}

export interface Incident extends BaseEntity {
  type: IncidentType;
  severity: IncidentSeverity;
  location: [number, number]; // [lon, lat]
  roadName: string;
  description: string;
  reportedAt: string;
  status: 'active' | 'resolved';
}

export interface Hotspot extends BaseEntity {
  location: [number, number]; // [lon, lat]
  radius: number; // in meters
  score: number; // 0-100 severity index
  severity: IncidentSeverity;
  contributingFactors: string[];
  affectedRoadIds: string[];
  detectedAt: string;
}

export interface Route extends BaseEntity {
  name: string;
  geometry: [number, number][]; // line string
  baseTimeSeconds: number; // The generic routing time (duration_typical or static)
  distanceMeters: number;
  congestionPenalty: number;
  incidentPenalty: number;
  forecastPenalty: number; // From predictions
  overallCost: number; // The computed deterministic cost
  hasAlternatives: boolean;
}

export interface TrafficIntelligenceNode extends BaseEntity {
  name: string;
  city: string;
  location: [number, number]; // [lon, lat]
  roadId: string;
  trafficDensity: 'low' | 'medium' | 'high' | 'critical';
  queueLengthMeters: number;
  averageSpeedKmph: number;
  trend: 'improving' | 'stable' | 'worsening';
  confidence: 'Low' | 'Medium' | 'High';
  observedAt: string; // ISO string
}

export type CameraPreviewType = 'live_authorized' | 'snapshot_authorized' | 'simulated' | 'unavailable';

export interface Camera extends BaseEntity {
  corridor: string;
  location: [number, number];
  direction: string;
  status: 'ACTIVE' | 'INACTIVE';
  accessStatus: 'AUTHORIZED' | 'UNAUTHORIZED';
  previewType: CameraPreviewType;
  lastUpdated: string; // ISO string
}

export interface RoadCondition extends BaseEntity {
  roadName: string;
  surfaceQuality: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  potholeRisk: 'Low' | 'Medium' | 'High';
  roadWork: 'None' | 'Active' | 'Planned';
  floodingRisk: 'Low' | 'Medium' | 'High';
  safetyRisk: 'Low' | 'Medium' | 'High';
  confidence: 'Low' | 'Medium' | 'High';
  observedAt: string; // ISO string
}

export interface WeatherImpact extends BaseEntity {
  rainfall: 'None' | 'Light' | 'Heavy';
  visibility: 'Clear' | 'Reduced' | 'Poor';
  floodingIndicators: boolean;
  trafficImpact: 'None' | 'Minor' | 'Major';
  incidentRiskImpact: 'None' | 'Elevated' | 'High';
  roadRiskImpact: 'None' | 'Elevated' | 'High';
  confidence: 'Low' | 'Medium' | 'High';
}

export interface TrafficForecast extends BaseEntity {
  segmentId: string;
  currentState: TrafficState;
  predictedState: TrafficState;
  forecastHorizon: number; // minutes
  expectedDelay: number; // seconds
  confidence: number; // 0-1
  contributingFactors: string[];
  evidenceIds: string[];
  generatedAt: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';

export interface IncidentRisk extends BaseEntity {
  roadId: string;
  riskLevel: RiskLevel;
  score: number; // 0-100
  forecastWindow: number; // minutes
  confidence: number; // 0-1
  contributingFactors: string[];
  evidenceIds: string[];
  generatedAt: string;
}

export type AlertClass = 'CURRENT_INCIDENT' | 'CONGESTION_FORECAST' | 'INCIDENT_RISK' | 'ROAD_HAZARD' | 'WEATHER' | 'ROUTE_CHANGE';

export interface Alert extends BaseEntity {
  severity: IncidentSeverity;
  alertClass: AlertClass;
  type: string;
  title: string;
  roadName: string;
  distanceMeters: number;
  expectedDelaySeconds: number;
  timestamp: string; // ISO string
  incidentId?: string;
  evidenceIds?: string[];
  confidence?: number;
}

export type ScenarioState = 'NORMAL' | 'INCIDENT_DETECTED' | 'IMPACT' | 'HOTSPOT_FORMED' | 'CAMERA_ACTIVATED' | 'ALERT_APPEARS' | 'ETA_DELAY' | 'ROUTE_REEVALUATED' | 'RECOMMENDATION';

export interface MobilityState {
  scenarioState: ScenarioState;
  cityId: string;
  segments: TrafficSegment[];
  incidents: Incident[];
  hotspots: Hotspot[];
  routes: Route[];
  checkpoints: TrafficIntelligenceNode[];
  cameras: Camera[];
  roadConditions: RoadCondition[];
  weather: WeatherImpact | null;
  forecasts: TrafficForecast[];
  incidentRisks: IncidentRisk[];
  alerts: Alert[];
  evidence: Evidence[];
  recommendedRouteId?: string;
  explanation?: string;
}
