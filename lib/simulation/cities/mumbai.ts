import { TrafficSegment, Incident, TrafficIntelligenceNode, Camera, RoadCondition, Route, SourceType, Provenance, DataClass, WeatherImpact } from '../../mobility/types';

const SOURCE: SourceType = 'simulation';
const PROV: Provenance = 'CITY_SIMULATION';
const SIMULATED: DataClass = 'PREDICTED';

// Eastern Express Highway coordinates roughly
const CORRIDOR_COORDS: [number, number][] = [
  [72.9348, 19.0833], 
  [72.9320, 19.0910],
  [72.9280, 19.1000], 
];

// Alternate via LBS Marg
const ALTERNATE_COORDS: [number, number][] = [
  [72.9348, 19.0833], 
  [72.9150, 19.0880], 
  [72.9100, 19.0950], 
  [72.9280, 19.1000], 
];

export const getMumbaiSimulation = () => ({
  segments: [
    {
      id: 'seg-eeh-mum-01',
      roadName: 'Eastern Express Highway (Kurla to Ghatkopar)',
      coordinates: CORRIDOR_COORDS,
      lengthKm: 3.2,
      laneCount: 4,
      currentSpeedKmh: 45,
      freeFlowSpeedKmh: 70,
      trafficState: 'moderate',
      estimatedDensityVehPerKmPerLane: 20,
      estimatedFlowVehPerHour: 3600,
      direction: 'forward',
      trend: 'stable',
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED,
      timestamp: new Date().toISOString(),
    }
  ] as TrafficSegment[],
  
  nodes: [
    {
      id: 'chk-mum-kurla',
      name: 'Kurla Junction Node',
      city: 'mumbai',
      location: [72.9348, 19.0833] as [number, number],
      roadId: 'seg-eeh-mum-01',
      trafficDensity: 'medium',
      queueLengthMeters: 200,
      averageSpeedKmph: 30,
      trend: 'worsening',
      confidence: 'High',
      observedAt: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED
    },
    {
      id: 'chk-mum-ghatkopar',
      name: 'Ghatkopar Entry Node',
      city: 'mumbai',
      location: [72.9280, 19.1000] as [number, number],
      roadId: 'seg-eeh-mum-01',
      trafficDensity: 'low',
      queueLengthMeters: 60,
      averageSpeedKmph: 50,
      trend: 'improving',
      confidence: 'High',
      observedAt: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED
    }
  ] as TrafficIntelligenceNode[],
  
  cameras: [
    {
      id: 'cam-mum-eeh-08',
      corridor: 'Eastern Express Highway',
      location: [72.9320, 19.0910] as [number, number],
      direction: 'Northbound',
      status: 'ACTIVE',
      accessStatus: 'AUTHORIZED',
      previewType: 'simulated',
      lastUpdated: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED
    }
  ] as Camera[],

  conditions: [
    {
      id: 'rc-mum-eeh',
      roadName: 'Eastern Express Highway (Kurla to Ghatkopar)',
      surfaceQuality: 'Good',
      potholeRisk: 'Low',
      roadWork: 'Active',
      floodingRisk: 'Low',
      safetyRisk: 'Low',
      confidence: 'High',
      observedAt: new Date().toISOString(),
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED
    }
  ] as RoadCondition[],

  weather: {
    id: 'wx-mum-01',
    rainfall: 'Light',
    visibility: 'Reduced',
    floodingIndicators: false,
    trafficImpact: 'Minor',
    incidentRiskImpact: 'None',
    roadRiskImpact: 'None',
    confidence: 'High',
    sourceType: SOURCE,
    provenance: PROV,
    dataClass: SIMULATED
  } as WeatherImpact,

  demoIncident: {
    id: 'inc-demo-mum-01',
    type: 'accident',
    severity: 'high',
    location: [72.9320, 19.0910] as [number, number],
    roadName: 'Eastern Express Highway (Kurla to Ghatkopar)',
    description: 'Vehicle breakdown blocking the rightmost lane.',
    reportedAt: new Date().toISOString(),
    status: 'active',
    sourceType: SOURCE,
    provenance: PROV,
    dataClass: SIMULATED
  } as Incident,

  routes: [
    {
      id: 'route-mum-main',
      name: 'Eastern Express Highway (Primary)',
      geometry: CORRIDOR_COORDS,
      baseTimeSeconds: 250, 
      distanceMeters: 3200,
      congestionPenalty: 0,
      incidentPenalty: 0,
      forecastPenalty: 0,
      overallCost: 250,
      hasAlternatives: true,
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED
    },
    {
      id: 'route-mum-alt',
      name: 'LBS Marg Alternative',
      geometry: ALTERNATE_COORDS,
      baseTimeSeconds: 380, 
      distanceMeters: 3800,
      congestionPenalty: 0,
      incidentPenalty: 0,
      forecastPenalty: 0,
      overallCost: 380,
      hasAlternatives: true,
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: SIMULATED
    }
  ] as Route[]
});
