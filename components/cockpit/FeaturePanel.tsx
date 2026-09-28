'use client';

import React from 'react';
import { DataClassBadge, Button, Icon } from '../ui/FigmaShared';
import { useCityContext } from '../../lib/contexts/CityContext';
import { calculateAverageSpeed, getNetworkTrafficState } from '../../lib/mobility/selectors';

export default function FeaturePanel({ view }: { view: string }) {
  const { mobilityState, activeCity } = useCityContext();
  
  if (!mobilityState || !activeCity) return null;

  let title = '';
  let intro = '';
  let facts: Array<[string, string]> = [];
  let badgeType: 'Observed' | 'Simulated' | 'Historical' | 'Predicted' = 'Simulated';

  switch (view) {
    case "roadAhead":
      title = "Road Ahead";
      intro = "A sequenced view of conditions you are about to experience.";
      const activeRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId) || mobilityState.routes[0];
      facts = [
        ["ROUTE", activeRoute ? activeRoute.name : "None"],
        ["DISTANCE", activeRoute ? `${(activeRoute.distanceMeters / 1000).toFixed(1)} km` : "--"],
        ["ETA", activeRoute ? `${Math.round(activeRoute.baseTimeSeconds / 60)} min` : "--"]
      ];
      break;
    case "traffic":
      title = "Traffic Network";
      intro = "Live mobility performance across the simulated city road network.";
      const flow = mobilityState.segments.reduce((acc, seg) => acc + seg.estimatedFlowVehPerHour, 0);
      facts = [
        ["NETWORK STATE", getNetworkTrafficState(mobilityState)],
        ["AVG. SPEED", `${calculateAverageSpeed(mobilityState)} km/h`],
        ["FLOW", `${flow.toLocaleString()} veh/h`]
      ];
      break;
    case "incidents":
      title = "Active Incidents";
      intro = "Verified events currently influencing city mobility.";
      const criticalIncidents = mobilityState.incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length;
      facts = [
        ["OPEN EVENTS", mobilityState.incidents.length.toString().padStart(2, '0')],
        ["CRITICAL", criticalIncidents.toString().padStart(2, '0')],
        ["PRIORITY", criticalIncidents > 0 ? "Elevated" : "Normal"]
      ];
      break;
    case "risk":
      title = "Risk & Forecast";
      intro = "Predicted network conditions for the next fifteen minutes.";
      const highRisk = mobilityState.incidentRisks.filter(r => r.riskLevel === 'HIGH').length;
      badgeType = "Predicted";
      facts = [
        ["HIGH RISKS", highRisk.toString().padStart(2, '0')],
        ["CONFIDENCE", "85%"],
        ["AVG SCORE", `${Math.round(mobilityState.incidentRisks.reduce((a, b) => a + b.score, 0) / (mobilityState.incidentRisks.length || 1))}/100`]
      ];
      break;
    case "roadQuality":
      title = "Road Quality";
      intro = "Surface quality and ride consistency on the active route.";
      badgeType = "Historical";
      const poorRoads = mobilityState.roadConditions.filter(r => r.surfaceQuality === 'Poor').length;
      facts = [
        ["MONITORED", mobilityState.roadConditions.length.toString().padStart(2, '0')],
        ["POOR SURFACES", poorRoads.toString().padStart(2, '0')],
        ["CONDITION", poorRoads > 0 ? "Needs Attention" : "Good"]
      ];
      break;
    case "cameras":
      title = "Camera Network";
      intro = "Roadside vision feeds available along the current route.";
      facts = [
        ["AVAILABLE", mobilityState.cameras.length.toString().padStart(2, '0')],
        ["ACTIVE", mobilityState.cameras.filter(c => c.status === 'ACTIVE').length.toString().padStart(2, '0')],
        ["STATUS", mobilityState.cameras.length > 0 ? "Operational" : "Offline"]
      ];
      break;
    case "checkpoints":
      title = "Checkpoints";
      intro = "Verified traffic and safety checkpoints across the network.";
      facts = [
        ["ACTIVE", mobilityState.checkpoints.length.toString().padStart(2, '0')],
        ["CITY", activeCity.name],
        ["COVERAGE", "Network-wide"]
      ];
      break;
    case "weather":
      title = "Weather Context";
      intro = "Local atmospheric conditions and their effect on road mobility.";
      const weather = mobilityState.weather;
      facts = [
        ["CONDITION", weather ? weather.rainfall : "Clear"],
        ["VISIBILITY", weather ? weather.visibility : "Good"],
        ["ROAD EFFECT", weather ? weather.trafficImpact : "Low"]
      ];
      break;
    case "routes":
      title = "Route Alternatives";
      intro = "Route strategies balance arrival time, risk and consistency.";
      facts = [
        ["AVAILABLE", mobilityState.routes.length.toString().padStart(2, '0')],
        ["FASTEST", mobilityState.routes.length > 0 ? `${Math.round(mobilityState.routes[0].baseTimeSeconds / 60)} min` : "--"],
        ["SAFEST", mobilityState.routes.length > 1 ? `${Math.round(mobilityState.routes[1].baseTimeSeconds / 60)} min` : "--"]
      ];
      break;
    case "dataSources":
      title = "Data Sources";
      intro = "Transparent provenance for every layer in the current network view.";
      facts = [
        ["OSM GEOMETRY", "Loaded"],
        ["ROUTING", "Mapbox Directions"],
        ["TRAFFIC MODEL", "Simulated"]
      ];
      break;
    default:
      return null;
  }

  return (
    <section className="feature-panel">
      <div className="feature-title">
        <span className="eyebrow">{view === "dataSources" ? "SYSTEM PROVENANCE" : "SELECTED FEATURE"}</span>
        <div>{title}</div>
        <p>{intro}</p>
      </div>
      <div className="feature-facts">
        {facts.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="feature-actions">
        <DataClassBadge type={badgeType} />
        <Button>
          View details <Icon name="arrow" size={14} />
        </Button>
      </div>
    </section>
  );
}
