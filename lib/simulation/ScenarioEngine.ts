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
    const routes = this.simulationSource.getDemoRoutes(); // Initial routes

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
      recommendedRouteId: routes[0].id,
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
      this.runEngines(); // Always run engines after state mutation
    }, delay);
    this.timers.push(t);
  }

  private runEngines() {
    if (!this.state) return;

    // Reset evidence array
    this.state.evidence = [];

    // 1. Forecast Engine
    const { forecasts, evidence: fcEvidence } = TrafficForecastEngine.calculateForecast(this.state);
    this.state.forecasts = forecasts;
    this.state.evidence.push(...fcEvidence);

    // 2. Risk Engine
    const { risks, evidence: riskEvidence } = IncidentRiskEngine.calculateRisk(this.state);
    this.state.incidentRisks = risks;
    this.state.evidence.push(...riskEvidence);

    // 3. Alert Engine
    this.state.alerts = AlertEngine.generateAlerts(this.state);

    this.notify();
  }

  public getScenarioState(): MobilityState {
    return this.state;
  }

  public triggerIncident() {
    if (this.state.scenarioState !== 'NORMAL') return;
    
    // Step 1: INCIDENT DETECTED
    this.state.scenarioState = 'INCIDENT_DETECTED';
    this.state.incidents = [this.simulationSource.getDemoIncident()];
    this.state.explanation = 'Major incident detected on the primary corridor.';
    this.runEngines();

    // Step 2: CHECKPOINT DENSITY RISES
    this.schedule(1500, () => {
      this.state.checkpoints = this.state.checkpoints.map(chk => 
        chk.id === 'chk-silkboard' 
          ? { ...chk, trafficDensity: 'high', queueLengthMeters: 400, trend: 'worsening', averageSpeedKmph: 12 }
          : chk
      );
    });

    // Step 3: TRAFFIC WORSENS & IMPACT
    this.schedule(3000, () => {
      this.state.scenarioState = 'IMPACT';
      this.state.segments = this.state.segments.map(seg => 
        seg.id === 'seg-orr-01' 
          ? { ...seg, congestionLevel: 'severe', speed: 10, trend: 'worsening' } 
          : seg
      );
    });

    // Step 4: HOTSPOT FORMS
    this.schedule(4500, () => {
      this.state.scenarioState = 'HOTSPOT_FORMED';
      if (this.state.incidents.length > 0) {
        const hotspot = calculateHotspot(this.state.incidents[0], this.state.segments);
        this.state.hotspots = [hotspot];
      }
    });

    // Step 5: ETA DELAY INCREASES & ROUTES RE-EVALUATED
    this.schedule(6000, () => {
      this.state.scenarioState = 'ETA_DELAY';
      const routeA = this.state.routes.find(r => r.id === this.simulationSource.getDemoRoutes()[0].id);
      if (routeA) {
        routeA.incidentPenalty = 540; // 9 mins extra
        routeA.congestionPenalty = 300; // 5 mins extra
        const forecast = this.state.forecasts.find(f => f.segmentId === 'seg-orr-01');
        routeA.forecastPenalty = forecast ? forecast.expectedDelay : 0;
        routeA.overallCost = routeA.baseTimeSeconds + routeA.incidentPenalty + routeA.congestionPenalty + routeA.forecastPenalty;
      }
    });

    // Step 6: ALTERNATIVE RECOMMENDED
    this.schedule(7500, () => {
      this.state.scenarioState = 'RECOMMENDATION';
      this.state.recommendedRouteId = this.simulationSource.getDemoRoutes()[1].id;
      this.state.explanation = 'Alternative route avoids the affected corridor and currently has lower estimated delay.';
    });
  }

  public resetScenario() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    this.initializeState(this.state.cityId); // Re-initialize completely
  }
}

// Global singleton for the demo
export const demoScenarioEngine = new ScenarioEngine();
