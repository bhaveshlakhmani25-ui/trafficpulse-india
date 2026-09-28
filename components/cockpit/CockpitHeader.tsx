import React, { useState, useEffect } from 'react';
import { CityRegistry } from '../../lib/config/CityRegistry';
import { useCityContext } from '../../lib/contexts/CityContext';
import { Button, Icon, DataClassBadge, StatusIndicator } from '../ui/FigmaShared';
import Image from 'next/image';
import { BrandAssets } from '../../lib/brandAssets';

export default function CockpitHeader() {
  const { activeCity, setActiveCity, isDemoDriveActive, setDemoDriveActive, isTransitioning } = useCityContext();
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  if (!activeCity) return null;

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon-only">
          <Image src={BrandAssets.IconDark} alt="TrafficPulse AI Icon" width={32} height={32} />
        </div>
        <div className="brand-full">
          <Image src={BrandAssets.LogoDarkOnNavy} alt="TrafficPulse AI" width={140} height={32} priority />
        </div>
      </div>
      <div className="relative">
        <select 
          value={activeCity.id}
          disabled={isTransitioning}
          onChange={(e) => setActiveCity(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Select City"
        >
          {CityRegistry.getAllSupportedCities().map(name => {
            const cfg = CityRegistry.getCityConfig(name);
            return <option key={cfg.id} value={cfg.id}>{cfg.name}</option>;
          })}
        </select>
        <Button className="city-selector" label="Select city">
          <Icon name="location" size={16} /><span><small>CITY</small>{activeCity.name}</span><Icon name="chevron" size={15} />
        </Button>
      </div>
      
      <div className="header-provenance">
        <DataClassBadge type={activeCity.dataMode === 'simulation' ? "Simulated" : "Observed"} />
        <span className="header-rule" />
        <span className="network-label">NETWORK {activeCity.id.toUpperCase().substring(0, 3)}</span>
      </div>
      
      <div className="header-actions">
        {isTransitioning ? (
           <StatusIndicator label="Switching..." tone="cyan" />
        ) : (
           <StatusIndicator label="System active" tone="good" />
        )}
        <div className="clock"><small>LOCAL TIME</small>{time}</div>
        <Button className={isDemoDriveActive ? "drive-button active" : "drive-button"} onClick={() => setDemoDriveActive(!isDemoDriveActive)}>
          <Icon name={isDemoDriveActive ? "route" : "car"} size={17} />{isDemoDriveActive ? "Drive active" : "Start demo drive"}
        </Button>
      </div>
    </header>
  );
}
