import { MobilityState, TrafficIntelligenceNode, Camera, Incident, Hotspot, RoadCondition } from './types';

// Simple turf-like distance calculation (haversine) in meters
function getDistanceMeters(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371e3; // Earth radius in meters
  const lat1 = (coord1[1] * Math.PI) / 180;
  const lat2 = (coord2[1] * Math.PI) / 180;
  const deltaLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const deltaLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Checks if a point is within a given distance of any point on a line string
function isPointNearLine(point: [number, number], line: [number, number][], thresholdMeters: number): boolean {
  for (const linePoint of line) {
    if (getDistanceMeters(point, linePoint) <= thresholdMeters) {
      return true;
    }
  }
  return false;
}

const ROUTE_PROXIMITY_THRESHOLD_METERS = 500; // 500 meters

/**
 * Returns a filtered MobilityState containing only nodes relevant to the recommended route.
 * If no recommended route is active, returns the original state (City Overview mode).
 */
export function getRouteContextState(state: MobilityState): MobilityState {
  if (!state.recommendedRouteId || state.routes.length === 0) {
    return state; // No active route, return all
  }

  const activeRoute = state.routes.find(r => r.id === state.recommendedRouteId);
  if (!activeRoute) {
    return state;
  }

  const geom = activeRoute.geometry;

  const relevantCheckpoints = state.checkpoints.filter(chk => isPointNearLine(chk.location, geom, ROUTE_PROXIMITY_THRESHOLD_METERS));
  const relevantCameras = state.cameras.filter(cam => isPointNearLine(cam.location, geom, ROUTE_PROXIMITY_THRESHOLD_METERS));
  const relevantIncidents = state.incidents.filter(inc => isPointNearLine(inc.location, geom, ROUTE_PROXIMITY_THRESHOLD_METERS));
  const relevantHotspots = state.hotspots.filter(h => isPointNearLine(h.location, geom, ROUTE_PROXIMITY_THRESHOLD_METERS));
  
  // For segments and road conditions, we ideally check string matching or proximity
  // For demo simplicity, we just check if it's the active route.
  
  return {
    ...state,
    checkpoints: relevantCheckpoints,
    cameras: relevantCameras,
    incidents: relevantIncidents,
    hotspots: relevantHotspots,
  };
}

export function calculateAverageSpeed(state: MobilityState): number {
  if (!state.segments || state.segments.length === 0) return 0;
  
  // Calculate a length-weighted average speed
  let totalLength = 0;
  let weightedSpeed = 0;
  
  for (const segment of state.segments) {
    totalLength += segment.lengthKm;
    weightedSpeed += segment.currentSpeedKmh * segment.lengthKm;
  }
  
  return totalLength > 0 ? Math.round(weightedSpeed / totalLength) : 0;
}

export function calculateMobilityIndex(state: MobilityState): number {
  if (!state.segments || state.segments.length === 0) return 100;
  
  // 1. Base score derived from average speed vs free flow speed (0-100)
  let totalLength = 0;
  let weightedCurrentSpeed = 0;
  let weightedFreeFlowSpeed = 0;
  
  let congestionPenalty = 0;
  
  for (const segment of state.segments) {
    totalLength += segment.lengthKm;
    weightedCurrentSpeed += segment.currentSpeedKmh * segment.lengthKm;
    weightedFreeFlowSpeed += segment.freeFlowSpeedKmh * segment.lengthKm;
    
    if (segment.trafficState === 'severe') congestionPenalty += 10 * segment.lengthKm;
    if (segment.trafficState === 'congested') congestionPenalty += 5 * segment.lengthKm;
    if (segment.trafficState === 'moderate') congestionPenalty += 1 * segment.lengthKm;
  }
  
  const avgCurrent = totalLength > 0 ? (weightedCurrentSpeed / totalLength) : 0;
  const avgFree = totalLength > 0 ? (weightedFreeFlowSpeed / totalLength) : 60;
  
  const speedRatio = avgFree > 0 ? Math.min(avgCurrent / avgFree, 1) : 1;
  let baseScore = speedRatio * 100;
  
  // 2. Apply penalties for active incidents
  const incidentPenalty = state.incidents.reduce((penalty, incident) => {
    switch (incident.severity) {
      case 'critical': return penalty + 15;
      case 'high': return penalty + 8;
      case 'medium': return penalty + 3;
      case 'low': return penalty + 1;
      default: return penalty;
    }
  }, 0);
  
  // 3. Normalize congestion penalty by network size
  const normalizedCongestionPenalty = totalLength > 0 ? Math.min(congestionPenalty / totalLength * 15, 30) : 0;
  
  let finalScore = baseScore - incidentPenalty - normalizedCongestionPenalty;
  
  return Math.max(0, Math.min(100, Math.round(finalScore)));
}

export function getNetworkTrafficState(state: MobilityState): string {
  if (!state.segments || state.segments.length === 0) return 'Unknown';
  
  const score = calculateMobilityIndex(state);
  
  if (score >= 80) return 'Free Flow';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Heavy';
  return 'Severe';
}


export function getTrafficTrendPath(state: MobilityState, cityId: string): { observed: string, predicted: string, area: string, currentY: number } {
  let seed = 0;
  for (let i = 0; i < cityId.length; i++) {
    seed += cityId.charCodeAt(i);
  }
  
  // Incorporate the current hour/minute into the seed slightly so it changes slowly
  const date = new Date();
  const timeSlice = Math.floor(date.getMinutes() / 5); // Changes every 5 minutes
  seed += date.getHours() * 100 + timeSlice;

  const random = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  const baseMobility = calculateMobilityIndex(state);
  const currentY = Math.max(10, Math.min(90, baseMobility));
  
  const pastPts: {x: number, y: number}[] = [{x: 345, y: currentY}];
  for (let i = 1; i <= 6; i++) {
    const x = 345 - (345 / 6) * i;
    const variance = (random() - 0.5) * 60; 
    let y = currentY + variance;
    y = Math.max(10, Math.min(95, y));
    pastPts.unshift({x, y});
  }
  
  let observedStr = `M${Math.round(pastPts[0].x)} ${Math.round(pastPts[0].y)}`;
  for (let i = 1; i < pastPts.length; i++) {
    const pt = pastPts[i];
    const prev = pastPts[i-1];
    const cp1X = prev.x + (pt.x - prev.x) / 2;
    observedStr += ` C${Math.round(cp1X)} ${Math.round(prev.y)} ${Math.round(cp1X)} ${Math.round(pt.y)} ${Math.round(pt.x)} ${Math.round(pt.y)}`;
  }
  
  const futurePts: {x: number, y: number}[] = [{x: 345, y: currentY}];
  for (let i = 1; i <= 3; i++) {
    const x = 345 + ((500 - 345) / 3) * i;
    const variance = (random() - 0.5) * 50; 
    let y = currentY + variance;
    y = Math.max(10, Math.min(95, y));
    futurePts.push({x, y});
  }
  
  let predictedStr = `M${Math.round(futurePts[0].x)} ${Math.round(futurePts[0].y)}`;
  for (let i = 1; i < futurePts.length; i++) {
    const pt = futurePts[i];
    const prev = futurePts[i-1];
    const cp1X = prev.x + (pt.x - prev.x) / 2;
    predictedStr += ` C${Math.round(cp1X)} ${Math.round(prev.y)} ${Math.round(cp1X)} ${Math.round(pt.y)} ${Math.round(pt.x)} ${Math.round(pt.y)}`;
  }
  
  const areaStr = observedStr + ` L345 100 L0 100 Z`;

  return { observed: observedStr, predicted: predictedStr, area: areaStr, currentY };
}
