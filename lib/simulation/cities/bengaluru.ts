import { TrafficSegment, Incident, TrafficIntelligenceNode, Camera, RoadCondition, Route, SourceType, Provenance, DataClass, WeatherImpact } from '../../mobility/types';

const SOURCE: SourceType = 'simulation';
const PROV: Provenance = 'DEMO_SIMULATION';
const OBSERVED: DataClass = 'OBSERVED';

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

export const getBengaluruSimulation = () => ({
  segments: [
    {
      id: 'seg-orr-blr-01',
      roadName: 'Outer Ring Road (Silk Board to HSR)',
      coordinates: CORRIDOR_COORDS,
      lengthKm: 2.5,
      laneCount: 3,
      currentSpeedKmh: 40,
      freeFlowSpeedKmh: 60,
      trafficState: 'moderate',
      estimatedDensityVehPerKmPerLane: 25,
      estimatedFlowVehPerHour: 3000,
      direction: 'forward',
      trend: 'stable',
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED,
      timestamp: new Date().toISOString(),
    }
  ] as TrafficSegment[],
  
  nodes: [
    {
      id: 'chk-blr-silkboard',
      name: 'Silk Board Junction Node',
      city: 'bengaluru',
      location: [77.6225, 12.9176] as [number, number],
      roadId: 'seg-orr-blr-01',
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
      id: 'chk-blr-hsr',
      name: 'HSR Layout Entry Node',
      city: 'bengaluru',
      location: [77.6402, 12.9125] as [number, number],
      roadId: 'seg-orr-blr-01',
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
  ] as TrafficIntelligenceNode[],
  
  cameras: [
    {
      id: 'cam-blr-orr-12',
      corridor: 'Outer Ring Road',
      location: [77.6322, 12.9150] as [number, number],
      direction: 'Eastbound',
      status: 'ACTIVE',
      accessStatus: 'AUTHORIZED',
      previewType: 'simulated',
      lastUpdated: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    }
  ] as Camera[],

  conditions: [
    {
      id: 'rc-blr-orr',
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
  ] as RoadCondition[],

  weather: {
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
  } as WeatherImpact,

  demoIncident: {
    id: 'inc-demo-blr-01',
    type: 'accident',
    severity: 'high',
    location: [77.6322, 12.9150] as [number, number],
    roadName: 'Outer Ring Road (Silk Board to HSR)',
    description: 'Multi-vehicle collision blocking two lanes.',
    reportedAt: new Date().toISOString(),
    status: 'active',
    sourceType: SOURCE,
    provenance: PROV,
    dataClass: OBSERVED
  } as Incident,

  routes: [
    {
      id: 'route-blr-main',
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
      id: 'route-blr-alt',
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
  ] as Route[]
});
