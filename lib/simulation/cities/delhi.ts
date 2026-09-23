import { TrafficSegment, Incident, TrafficIntelligenceNode, Camera, RoadCondition, Route, SourceType, Provenance, DataClass, WeatherImpact } from '../../mobility/types';

const SOURCE: SourceType = 'simulation';
const PROV: Provenance = 'DEMO_SIMULATION';
const OBSERVED: DataClass = 'OBSERVED';

// Connaught Place to India Gate
const DELHI_CORRIDOR_COORDS: [number, number][] = [
  [77.2177, 28.6304], 
  [77.2200, 28.6250],
  [77.2250, 28.6180],
  [77.2295, 28.6129], 
];

const DELHI_ALTERNATE_COORDS: [number, number][] = [
  [77.2177, 28.6304], 
  [77.2150, 28.6200], 
  [77.2200, 28.6100], 
  [77.2295, 28.6129], 
];

export const getDelhiSimulation = () => ({
  segments: [
    {
      id: 'seg-del-01',
      roadName: 'Kasturba Gandhi Marg to India Gate',
      coordinates: DELHI_CORRIDOR_COORDS,
      lengthKm: 2.8,
      laneCount: 3,
      currentSpeedKmh: 35,
      freeFlowSpeedKmh: 50,
      trafficState: 'moderate',
      estimatedDensityVehPerKmPerLane: 25,
      estimatedFlowVehPerHour: 2625,
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
      id: 'chk-del-cp',
      name: 'Connaught Place Outer Circle',
      city: 'delhi',
      location: [77.2177, 28.6304] as [number, number],
      roadId: 'seg-del-01',
      trafficDensity: 'medium',
      queueLengthMeters: 200,
      averageSpeedKmph: 20,
      trend: 'worsening',
      confidence: 'High',
      observedAt: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    },
    {
      id: 'chk-del-ig',
      name: 'India Gate Circle',
      city: 'delhi',
      location: [77.2295, 28.6129] as [number, number],
      roadId: 'seg-del-01',
      trafficDensity: 'high',
      queueLengthMeters: 300,
      averageSpeedKmph: 15,
      trend: 'stable',
      confidence: 'High',
      observedAt: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    }
  ] as TrafficIntelligenceNode[],
  
  cameras: [
    {
      id: 'cam-del-kgm',
      corridor: 'Kasturba Gandhi Marg',
      location: [77.2200, 28.6250] as [number, number],
      direction: 'Southbound',
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
      id: 'rc-del-01',
      roadName: 'Kasturba Gandhi Marg',
      surfaceQuality: 'Good',
      potholeRisk: 'Low',
      roadWork: 'Planned',
      floodingRisk: 'Low',
      safetyRisk: 'Low',
      confidence: 'High',
      observedAt: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    }
  ] as RoadCondition[],

  weather: {
    id: 'wx-del-01',
    rainfall: 'None',
    visibility: 'Reduced',
    floodingIndicators: false,
    trafficImpact: 'Minor',
    incidentRiskImpact: 'Elevated',
    roadRiskImpact: 'None',
    confidence: 'High',
    sourceType: SOURCE,
    provenance: PROV,
    dataClass: OBSERVED
  } as WeatherImpact,

  demoIncident: {
    id: 'inc-demo-del-01',
    type: 'breakdown',
    severity: 'medium',
    location: [77.2200, 28.6250] as [number, number],
    roadName: 'Kasturba Gandhi Marg',
    description: 'Broken down bus blocking left lane.',
    reportedAt: new Date().toISOString(),
    status: 'active',
    sourceType: SOURCE,
    provenance: PROV,
    dataClass: OBSERVED
  } as Incident,

  routes: [
    {
      id: 'route-del-main',
      name: 'Kasturba Gandhi Marg',
      geometry: DELHI_CORRIDOR_COORDS,
      baseTimeSeconds: 400, 
      distanceMeters: 2800,
      congestionPenalty: 0,
      incidentPenalty: 0,
      forecastPenalty: 0,
      overallCost: 400,
      hasAlternatives: true,
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    },
    {
      id: 'route-del-alt',
      name: 'Janpath Diversion',
      geometry: DELHI_ALTERNATE_COORDS,
      baseTimeSeconds: 500, 
      distanceMeters: 3300,
      congestionPenalty: 0,
      incidentPenalty: 0,
      forecastPenalty: 0,
      overallCost: 500,
      hasAlternatives: true,
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    }
  ] as Route[]
});
