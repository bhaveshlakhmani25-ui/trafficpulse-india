'use client';

import React from 'react';
import { useCityContext } from '../../lib/contexts/CityContext';
import { Button, Icon } from '../ui/FigmaShared';

export default function RouteBar() {
  const { isDemoDriveActive, setDemoDriveActive, activeCity, mobilityState } = useCityContext();

  if (!mobilityState || !activeCity) {
    return null;
  }

  // Get active route if any
  const recommendedRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId) || mobilityState.routes[0];
  const etaMinutes = recommendedRoute ? Math.round(recommendedRoute.baseTimeSeconds / 60) : 0;
  
  // Calculate average delay logic (mocked or derived)
  const delayMinutes = recommendedRoute ? Math.round((recommendedRoute.incidentPenalty + recommendedRoute.congestionPenalty + recommendedRoute.forecastPenalty) / 60) : 0;

  return (
    <footer className="route-bar">
      <div className="route-path">
        <div className="route-node start">
          <span />
          <div>
            <small>FROM</small>
            <strong>Central {activeCity.name}</strong>
          </div>
        </div>
        <div className="route-connector"><span /></div>
        <div className="route-node end">
          <span />
          <div>
            <small>TO</small>
            <strong>Destination</strong>
          </div>
        </div>
      </div>
      
      <div className="route-summary">
        <div>
          <strong>{etaMinutes}</strong>
          <small>MIN</small>
        </div>
        <span>+{delayMinutes} MIN DELAY</span>
        <span className="moderate-text">
          <i /> MODERATE
        </span>
      </div>
      
      {isDemoDriveActive && (
        <div className="current-road">
          <small>CURRENT ROAD</small>
          <strong>Main Road</strong>
          <span>Next · Connector Road</span>
        </div>
      )}
      
      <div className="route-actions">
        <Button className="route-options">
          <Icon name="route" size={16} />
          Route options
        </Button>
        <button 
          className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-wider hover:text-[var(--cyan)] transition-colors ml-4"
          onClick={() => setDemoDriveActive(!isDemoDriveActive)}
        >
          <Icon name={isDemoDriveActive ? "route" : "car"} size={15} />
          {isDemoDriveActive ? "Stop Drive" : "Drive Mode"}
        </button>
      </div>
    </footer>
  );
}
