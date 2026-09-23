import { 
  TrafficSegment, Incident, TrafficIntelligenceNode, 
  Camera, RoadCondition, Route, WeatherImpact
} from '../mobility/types';
import { TrafficSource, IncidentSource, CheckpointSource, CameraSource, RoadConditionSource, WeatherSource, HistoricalRiskSource } from './interfaces';

import { getBengaluruSimulation } from '../simulation/cities/bengaluru';
import { getDelhiSimulation } from '../simulation/cities/delhi';
import { getFallbackSimulation } from '../simulation/cities/default';
import { getMumbaiSimulation } from '../simulation/cities/mumbai';

export class SimulationSource implements TrafficSource, IncidentSource, CheckpointSource, CameraSource, RoadConditionSource, WeatherSource, HistoricalRiskSource {
  
  private getSimulationData(cityId: string) {
    if (cityId === 'bengaluru') return getBengaluruSimulation();
    if (cityId === 'delhi') return getDelhiSimulation();
    if (cityId === 'mumbai') return getMumbaiSimulation();
    return getFallbackSimulation(cityId);
  }

  async getSegments(cityId: string): Promise<TrafficSegment[]> {
    return this.getSimulationData(cityId).segments;
  }

  async getActiveIncidents(cityId: string): Promise<Incident[]> {
    return []; // We return empty here, the demo injects an incident manually
  }

  async getNodes(cityId: string): Promise<TrafficIntelligenceNode[]> {
    return this.getSimulationData(cityId).nodes;
  }

  async getCameras(cityId: string): Promise<Camera[]> {
    return this.getSimulationData(cityId).cameras;
  }

  async getConditions(cityId: string): Promise<RoadCondition[]> {
    return this.getSimulationData(cityId).conditions;
  }

  async getCurrentWeather(cityId: string): Promise<WeatherImpact> {
    return this.getSimulationData(cityId).weather;
  }

  async getHistoricalRisk(roadId: string): Promise<number> {
    return 30; // base historical risk
  }

  // Helper method for demo state injection
  getDemoIncident(cityId: string): Incident {
    return this.getSimulationData(cityId).demoIncident;
  }

  getDemoRoutes(cityId: string): Route[] {
    return this.getSimulationData(cityId).routes;
  }
}
