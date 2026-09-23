import { TrafficSegment, Incident, TrafficIntelligenceNode, Camera, RoadCondition, Route, SourceType, Provenance, DataClass, WeatherImpact } from '../../mobility/types';
import { CityRegistry } from '../../config/CityRegistry';

const SOURCE: SourceType = 'simulation';
const PROV: Provenance = 'CITY_SIMULATION';
const OBSERVED: DataClass = 'OBSERVED';

export const getFallbackSimulation = (cityId: string) => {
  const cityConfig = CityRegistry.getCityConfig(cityId);
  const center = cityConfig.centerCoordinates;
  
  // Create a synthetic box around the center
  const offset = 0.02;
  const coords: [number, number][] = [
    [center[0] - offset, center[1] + offset],
    [center[0] + offset, center[1] + offset],
    [center[0] + offset, center[1] - offset],
  ];

  return {
    segments: [
      {
        id: `seg-${cityId}-sim`,
        roadName: `Synthetic Corridor - ${cityConfig.name}`,
        coordinates: coords,
        lengthKm: 4.0,
        laneCount: 2,
        currentSpeedKmh: 30,
        freeFlowSpeedKmh: 50,
        trafficState: 'moderate',
        estimatedDensityVehPerKmPerLane: 20,
        estimatedFlowVehPerHour: 1200,
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
        id: `chk-${cityId}-1`,
        name: `Node A (${cityConfig.name})`,
        city: cityId,
        location: coords[0],
        roadId: `seg-${cityId}-sim`,
        trafficDensity: 'medium',
        queueLengthMeters: 100,
        averageSpeedKmph: 30,
        trend: 'stable',
        confidence: 'Low',
        observedAt: new Date().toISOString(),
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ] as TrafficIntelligenceNode[],
    
    cameras: [
      {
        id: `cam-${cityId}-1`,
        corridor: `Synthetic Corridor - ${cityConfig.name}`,
        location: coords[1],
        direction: 'Unknown',
        status: 'ACTIVE',
        accessStatus: 'UNAUTHORIZED',
        previewType: 'unavailable',
        lastUpdated: new Date().toISOString(),
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ] as Camera[],

    conditions: [] as RoadCondition[],

    weather: {
      id: `wx-${cityId}-sim`,
      rainfall: 'None',
      visibility: 'Clear',
      floodingIndicators: false,
      trafficImpact: 'None',
      incidentRiskImpact: 'None',
      roadRiskImpact: 'None',
      confidence: 'Low',
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    } as WeatherImpact,

    demoIncident: {
      id: `inc-demo-${cityId}`,
      type: 'congestion',
      severity: 'low',
      location: coords[1],
      roadName: `Synthetic Corridor - ${cityConfig.name}`,
      description: 'Minor congestion detected.',
      reportedAt: new Date().toISOString(),
      status: 'active',
      sourceType: SOURCE,
      provenance: PROV,
      dataClass: OBSERVED
    } as Incident,

    routes: [
      {
        id: `route-${cityId}-sim`,
        name: `Synthetic Route (${cityConfig.name})`,
        geometry: coords,
        baseTimeSeconds: 600, 
        distanceMeters: 4000,
        congestionPenalty: 0,
        incidentPenalty: 0,
        forecastPenalty: 0,
        overallCost: 600,
        hasAlternatives: false,
        sourceType: SOURCE,
        provenance: PROV,
        dataClass: OBSERVED
      }
    ] as Route[]
  };
};
