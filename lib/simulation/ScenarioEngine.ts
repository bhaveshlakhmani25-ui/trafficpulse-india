import { MobilityState, ScenarioState, Alert } from '../mobility/types';
import { SimulationSource } from '../dataSources/SimulationSource';
import { TrafficForecastEngine } from '../intelligence/TrafficForecastEngine';
import { IncidentRiskEngine } from '../intelligence/IncidentRiskEngine';
import { AlertEngine } from '../intelligence/AlertEngine';
import { calculateHotspot } from '../hotspots/calculateHotspot';

type StateListener = (state: MobilityState) => void;

export class ScenarioEngine {
  private state!: MobilityState;
  private listeners: Set<StateListener> = new Set();
  private timers: any[] = [];
  private simulationSource = new SimulationSource();

  constructor(cityId: string = 'bengaluru') {
    this.initializeState(cityId);
  }

  private async initializeState(cityId: string) {
    const segments = await this.simulationSource.getSegments(cityId);
    const checkpoints = await this.simulationSource.getNodes(cityId);
    const cameras = await this.simulationSource.getCameras(cityId);
    const roadConditions = await this.simulationSource.getConditions(cityId);
    const weather = await this.simulationSource.getCurrentWeather(cityId);
    const routes = this.simulationSource.getDemoRoutes(cityId);

    this.state = {
      scenarioState: 'NORMAL',
      cityId,
      segments,
      incidents: [],
      hotspots: [],
      routes,
      checkpoints,
      cameras,
      roadConditions,
      weather,
      forecasts: [],
      incidentRisks: [],
      alerts: [],
      evidence: [],
      recommendedRouteId: routes.length > 0 ? routes[0].id : undefined,
      explanation: 'Traffic conditions are normal. The primary route is optimal.',
    };
    
    // Run initial engines
    this.runEngines();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    if (this.state) {
      listener(this.state);
    }
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }
  
  private schedule(delay: number, action: () => void) {
    const t = setTimeout(() => {
      action();
      this.runEngines();
    }, delay);
    this.timers.push(t);
  }

  private runEngines() {
    if (!this.state) return;

    this.state.evidence = [];

    const { forecasts, evidence: fcEvidence } = TrafficForecastEngine.calculateForecast(this.state);
    this.state.forecasts = forecasts;
    this.state.evidence.push(...fcEvidence);

    const { risks, evidence: riskEvidence } = IncidentRiskEngine.calculateRisk(this.state);
    this.state.incidentRisks = risks;
    this.state.evidence.push(...riskEvidence);

    this.state.alerts = AlertEngine.generateAlerts(this.state);

    this.notify();
  }

  public getScenarioState(): MobilityState {
    return this.state;
  }

  public triggerIncident() {
    if (this.state.scenarioState !== 'NORMAL') return;
    
    const demoIncident = this.simulationSource.getDemoIncident(this.state.cityId);
    if (!demoIncident) return;

    this.state.scenarioState = 'INCIDENT_DETECTED';
    this.state.incidents = [demoIncident];
    this.state.explanation = 'Major incident detected on the primary corridor.';
    this.runEngines();

    this.schedule(1500, () => {
      // Find the first checkpoint and worsen it to simulate density rise
      if (this.state.checkpoints.length > 0) {
        this.state.checkpoints[0] = { 
          ...this.state.checkpoints[0], 
          trafficDensity: 'high', 
          queueLengthMeters: 400, 
          trend: 'worsening', 
          averageSpeedKmph: 12 
        };
      }
    });

    this.schedule(3000, () => {
      this.state.scenarioState = 'IMPACT';
      if (this.state.segments.length > 0) {
        const seg = this.state.segments[0];
        this.state.segments[0] = { 
          ...seg, 
          trafficState: 'severe', 
          currentSpeedKmh: 10, 
          estimatedDensityVehPerKmPerLane: 85, // massive queue buildup
          estimatedFlowVehPerHour: 85 * 10 * seg.laneCount, // reduced flow
          trend: 'worsening' 
        };
      }
    });

    this.schedule(4500, () => {
      this.state.scenarioState = 'HOTSPOT_FORMED';
      if (this.state.incidents.length > 0) {
        const hotspot = calculateHotspot(this.state.incidents[0], this.state.segments);
        this.state.hotspots = [hotspot];
      }
    });

    this.schedule(6000, () => {
      this.state.scenarioState = 'ETA_DELAY';
      const routes = this.simulationSource.getDemoRoutes(this.state.cityId);
      if (routes.length > 0) {
        const routeA = this.state.routes.find(r => r.id === routes[0].id);
        if (routeA) {
          routeA.incidentPenalty = 540; 
          routeA.congestionPenalty = 300; 
          const forecast = this.state.forecasts.find(f => f.segmentId === this.state.segments[0].id);
          routeA.forecastPenalty = forecast ? forecast.expectedDelay : 0;
          routeA.overallCost = routeA.baseTimeSeconds + routeA.incidentPenalty + routeA.congestionPenalty + routeA.forecastPenalty;
        }
      }
    });

    this.schedule(7500, () => {
      this.state.scenarioState = 'RECOMMENDATION';
      const routes = this.simulationSource.getDemoRoutes(this.state.cityId);
      if (routes.length > 1) {
        this.state.recommendedRouteId = routes[1].id;
        this.state.explanation = 'Alternative route avoids the affected corridor and currently has lower estimated delay.';
      }
    });
  }

  public async resetScenario(cityId?: string) {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    const targetCity = cityId || this.state.cityId;
    await this.initializeState(targetCity);
  }
}

export const demoScenarioEngine = new ScenarioEngine();
