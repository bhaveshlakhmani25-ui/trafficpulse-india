import { 
  TrafficSegment, Incident, TrafficIntelligenceNode, 
  Camera, RoadCondition, Route, SourceType, Provenance, DataClass,
  WeatherImpact
} from '../mobility/types';
import { TrafficSource, IncidentSource, CheckpointSource, CameraSource, RoadConditionSource, WeatherSource, HistoricalRiskSource } from './interfaces';

const SOURCE: SourceType = 'simulation';
const PROV: Provenance = 'DEMO_SIMULATION';
const OBSERVED: DataClass = 'OBSERVED';
const HISTORICAL: DataClass = 'HISTORICAL';

const CORRIDOR_COORDS: [number, number][] = [
  [77.6225, 12.9176], 
  [77.6322, 12.9150],
  [77.6402, 12.9125], 
];

const ALTERNATE_COORDS: [number, number][] = [
  [77.6225, 12.9176], 
  [77.6250, 12.9250], 
  [77.6350, 12.9230], 
  [77.6402, 12.9125], 
];

export class SimulationSource implements TrafficSource, IncidentSource, CheckpointSource, CameraSource, RoadConditionSource, WeatherSource, HistoricalRiskSource {

  async getSegments(cityId: string): Promise<TrafficSegment[]> {
    return [
      {
        id: 'seg-orr-01',
        roadName: 'Outer Ring Road (Silk Board to HSR)',
        coordinates: CORRIDOR_COORDS,
        speed: 40,
        freeFlowSpeed: 60,
        congestionLevel: 'moderate',
        trend: 'stable',
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED,
        timestamp: new Date().toISOString(),
      }
    ];
  }

  async getActiveIncidents(cityId: string): Promise<Incident[]> {
    return [];
  }

  async getNodes(cityId: string): Promise<TrafficIntelligenceNode[]> {
    return [
      {
        id: 'chk-silkboard',
        name: 'Silk Board Junction Node',
        city: 'bengaluru',
        location: [77.6225, 12.9176],
        roadId: 'seg-orr-01',
        trafficDensity: 'medium',
        queueLengthMeters: 150,
        averageSpeedKmph: 25,
        trend: 'stable',
        confidence: 'High',
        observedAt: new Date().toISOString(),
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      },
      {
        id: 'chk-hsr',
        name: 'HSR Layout Entry Node',
        city: 'bengaluru',
        location: [77.6402, 12.9125],
        roadId: 'seg-orr-01',
        trafficDensity: 'low',
        queueLengthMeters: 50,
        averageSpeedKmph: 45,
        trend: 'improving',
        confidence: 'High',
        observedAt: new Date().toISOString(),
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ];
  }

  async getCameras(cityId: string): Promise<Camera[]> {
    return [
      {
        id: 'cam-orr-12',
        corridor: 'Outer Ring Road',
        location: [77.6322, 12.9150],
        direction: 'Eastbound',
        status: 'ACTIVE',
        accessStatus: 'AUTHORIZED',
        previewType: 'simulated',
        lastUpdated: new Date().toISOString(),
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ];
  }

  async getConditions(cityId: string): Promise<RoadCondition[]> {
    return [
      {
        id: 'rc-orr',
        roadName: 'Outer Ring Road (Silk Board to HSR)',
        surfaceQuality: 'Moderate',
        potholeRisk: 'Medium',
        roadWork: 'None',
        floodingRisk: 'Low',
        safetyRisk: 'Medium',
        confidence: 'High',
        observedAt: new Date().toISOString(),
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ];
  }

  async getCurrentWeather(cityId: string): Promise<WeatherImpact> {
    return {
      id: 'wx-blr-01',
      rainfall: 'None',
      visibility: 'Clear',
      floodingIndicators: false,
      trafficImpact: 'None',
      incidentRiskImpact: 'None',
      roadRiskImpact: 'None',
      confidence: 'High',
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    };
  }

  async getHistoricalRisk(roadId: string): Promise<number> {
    return 30; // base historical risk
  }

  // Helper method for demo state injection
  getDemoIncident(): Incident {
    return {
      id: 'inc-demo-01',
      type: 'accident',
      severity: 'high',
      location: [77.6322, 12.9150],
      roadName: 'Outer Ring Road (Silk Board to HSR)',
      description: 'Multi-vehicle collision blocking two lanes.',
      reportedAt: new Date().toISOString(),
      status: 'active',
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    };
  }

  getDemoRoutes(): Route[] {
    return [
      {
        id: 'route-main',
        name: 'Outer Ring Road (Primary)',
        geometry: CORRIDOR_COORDS,
        baseTimeSeconds: 300, 
        distanceMeters: 2500,
        congestionPenalty: 0,
        incidentPenalty: 0,
        forecastPenalty: 0,
        overallCost: 300,
        hasAlternatives: true,
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      },
      {
        id: 'route-alt',
        name: 'Koramangala Inner Route',
        geometry: ALTERNATE_COORDS,
        baseTimeSeconds: 420, 
        distanceMeters: 3100,
        congestionPenalty: 0,
        incidentPenalty: 0,
        forecastPenalty: 0,
        overallCost: 420,
        hasAlternatives: true,
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ];
  }
}
