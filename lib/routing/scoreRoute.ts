import { Route } from '../mobility/types';

/**
 * Deterministically computes the overall cost of a route.
 * 
 * Formula:
 * Route Cost = Base Time + Congestion Penalty + Incident Penalty + Forecast Penalty
 * 
 * Returns the route with the updated overallCost field.
 */
export function scoreRoute(route: Route): Route {
  const overallCost = 
    route.baseTimeSeconds + 
    route.congestionPenalty + 
    route.incidentPenalty + 
    route.forecastPenalty;

  return {
    ...route,
    overallCost
  };
}
