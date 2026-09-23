import { TrafficSegment, Incident, TrafficIntelligenceNode, Camera, RoadCondition, WeatherImpact } from '../mobility/types';

export interface TrafficSource {
  getSegments(cityId: string): Promise<TrafficSegment[]>;
}

export interface IncidentSource {
  getActiveIncidents(cityId: string): Promise<Incident[]>;
}

export interface CheckpointSource {
  getNodes(cityId: string): Promise<TrafficIntelligenceNode[]>;
}

export interface CameraSource {
  getCameras(cityId: string): Promise<Camera[]>;
}

export interface RoadConditionSource {
  getConditions(cityId: string): Promise<RoadCondition[]>;
}

export interface WeatherSource {
  getCurrentWeather(cityId: string): Promise<WeatherImpact>;
}

export interface HistoricalRiskSource {
  getHistoricalRisk(roadId: string): Promise<number>;
}
