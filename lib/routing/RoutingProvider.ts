import { Route } from '../mobility/types';

export interface RoutingProvider {
  /**
   * Fetches the optimal routes between origin and destination.
   * Returns a primary route and potentially an alternative.
   */
  getRoutes(origin: [number, number], destination: [number, number]): Promise<Route[]>;
}
