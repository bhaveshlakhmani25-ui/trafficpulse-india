import { RoutingProvider } from './RoutingProvider';
import { Route } from '../mobility/types';
import { demoScenarioEngine } from '../simulation/ScenarioEngine';

export class SimulationRoutingProvider implements RoutingProvider {
  async getRoutes(origin: [number, number], destination: [number, number]): Promise<Route[]> {
    // In simulation mode, we just return the current deterministic routes from the scenario engine.
    const state = demoScenarioEngine.getScenarioState();
    return state.routes;
  }
}
