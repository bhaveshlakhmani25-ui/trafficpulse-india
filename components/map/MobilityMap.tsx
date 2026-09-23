'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MobilityState, TrafficSegment, FocusedFeature } from '../../lib/mobility/types';
import { CityConfig } from '../../lib/config/CityRegistry';
import { RoadAheadCameraController } from '../../lib/map/RoadAheadCameraController';
import { createRoot } from 'react-dom/client';
import CheckpointPanel from '../cockpit/CheckpointPanel';
import CameraPreviewPanel from '../cockpit/CameraPreviewPanel';
import { VehicleFlowSimulator } from '../../lib/traffic/VehicleFlowSimulator';

interface MobilityMapProps {
  mobilityState: MobilityState;
  activeCity: CityConfig;
  focusedFeature?: FocusedFeature | null;
  onFeatureSelect?: (feature: FocusedFeature | null) => void;
  isDemoDriveActive?: boolean;
  activeSection?: string;
}

export default function MobilityMap({ mobilityState, activeCity, focusedFeature, onFeatureSelect, isDemoDriveActive, activeSection }: MobilityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hasToken] = useState(!!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
  const cameraControllerRef = useRef<RoadAheadCameraController | null>(null);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const vehicleSimulatorRef = useRef<VehicleFlowSimulator | null>(null);

  useEffect(() => {
    if (!hasToken || !mapContainer.current) return;

    if (map.current) {
      map.current.easeTo({
        center: activeCity.centerCoordinates,
        zoom: activeCity.initialZoom,
        pitch: 0,
        bearing: 0
      });
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: activeCity.centerCoordinates,
      zoom: activeCity.initialZoom,
      pitch: 0,
      bearing: 0,
    });

    vehicleSimulatorRef.current = new VehicleFlowSimulator();
    vehicleSimulatorRef.current.onTick((geoJson) => {
      if (map.current && map.current.isStyleLoaded() && map.current.getSource('vehicles')) {
        (map.current.getSource('vehicles') as mapboxgl.GeoJSONSource).setData(geoJson);
      }
    });

    // Handle Resize via ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      map.current?.resize();
    });
    resizeObserver.observe(mapContainer.current);

    map.current.on('style.load', () => {
      map.current?.setConfigProperty('basemap', 'lightPreset', 'dusk');
      cameraControllerRef.current = new RoadAheadCameraController(map.current!);
      
      const carSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L4 20L12 17L20 20L12 2Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1"/></svg>';
      const img = new Image();
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(carSvg);
      img.onload = () => {
        if (map.current && !map.current.hasImage('car-icon')) {
          map.current.addImage('car-icon', img);
        }
      };

      initMapLayers();
      updateMapLayers();
      if (vehicleSimulatorRef.current) vehicleSimulatorRef.current.start();
    });

    // Click handler for Checkpoints
    map.current.on('click', 'checkpoints-unclustered', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const coords = (feature.geometry as GeoJSON.Point).coordinates;
      if (onFeatureSelect && feature.properties?.id) {
        onFeatureSelect({ type: 'checkpoint', id: feature.properties.id, coordinates: [coords[0], coords[1]] });
      }
    });
    map.current.on('mouseenter', 'checkpoints-unclustered', () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
    map.current.on('mouseleave', 'checkpoints-unclustered', () => { if (map.current) map.current.getCanvas().style.cursor = ''; });

    // Click handler for Cameras
    map.current.on('click', 'cameras-layer', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const coords = (feature.geometry as GeoJSON.Point).coordinates;
      if (onFeatureSelect && feature.properties?.id) {
        onFeatureSelect({ type: 'camera', id: feature.properties.id, coordinates: [coords[0], coords[1]] });
      }
    });
    map.current.on('mouseenter', 'cameras-layer', () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
    map.current.on('mouseleave', 'cameras-layer', () => { if (map.current) map.current.getCanvas().style.cursor = ''; });

    // Click handler for Traffic Segments
    map.current.on('click', 'traffic-lines', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const props = feature.properties;
      
      const popupNode = document.createElement('div');
      const popup = new mapboxgl.Popup({ offset: 15, closeButton: true, className: 'custom-popup bg-gray-900 border border-gray-800 rounded-lg p-0 text-white' }).setDOMContent(popupNode);
      
      const root = createRoot(popupNode);
      root.render(
        <div className="p-3 w-64 text-sm bg-gray-900 text-white rounded">
          <div className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">ROAD TRAFFIC</div>
          <div className="font-semibold mb-2">{props?.roadName}</div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Traffic:</span>
            <span className="font-bold text-orange-400">{props?.trafficState?.toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Current speed:</span>
            <span>{props?.currentSpeedKmh} km/h</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Free-flow:</span>
            <span>{props?.freeFlowSpeedKmh} km/h</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Density:</span>
            <span>{props?.density} veh/km/lane</span>
          </div>
          <div className="flex justify-between text-xs mb-1 mt-2 pt-2 border-t border-gray-800">
            <span className="text-gray-400">Estimated flow:</span>
            <span>{props?.flow} veh/hour</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Modelled capacity:</span>
            <span>{props?.capacity} veh/hour</span>
          </div>
          <div className="flex justify-between text-xs mb-1 mt-2 pt-2 border-t border-gray-800">
            <span className="text-blue-400 font-bold uppercase text-[10px]">VISUAL REPRESENTATION</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Vehicles shown:</span>
            <span>{props?.population}</span>
          </div>
          {props?.forecastState && (
            <div className="flex justify-between text-xs mb-1 mt-2 pt-2 border-t border-gray-800">
              <span className="text-gray-400">Forecast:</span>
              <span className="text-red-400 font-medium">{props.forecastState.toUpperCase()} in {props.forecastHorizon}m</span>
            </div>
          )}
          <div className="flex justify-between text-[10px] mt-2 pt-2 text-gray-500">
            <span>Data: SIMULATION</span>
          </div>
        </div>
      );
      
      popup.setLngLat(e.lngLat).addTo(map.current!);
      popupsRef.current.push(popup);
    });
    map.current.on('mouseenter', 'traffic-lines', () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
    map.current.on('mouseleave', 'traffic-lines', () => { if (map.current) map.current.getCanvas().style.cursor = ''; });

    return () => {
      resizeObserver.disconnect();
      popupsRef.current.forEach(p => p.remove());
      if (vehicleSimulatorRef.current) vehicleSimulatorRef.current.stop();
      map.current?.remove();
      map.current = null;
      cameraControllerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCity.id, hasToken]);

  // Update sources/layers whenever mobility state or activeSection changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    updateMapLayers();
    if (vehicleSimulatorRef.current) {
      vehicleSimulatorRef.current.setMobilityState(mobilityState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobilityState, activeSection]);

  // Handle Focused Feature changes
  useEffect(() => {
    if (!cameraControllerRef.current || !map.current || !map.current.isStyleLoaded()) return;

    // Clear old popups
    popupsRef.current.forEach(p => p.remove());
    popupsRef.current = [];

    if (!focusedFeature) {
      const recommendedRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId);
      if (isDemoDriveActive && recommendedRoute) {
        cameraControllerRef.current.startDemoDrive(recommendedRoute.geometry);
      } else if (recommendedRoute) {
        cameraControllerRef.current.stopDemoDrive();
        cameraControllerRef.current.followRoute(recommendedRoute.geometry);
      } else {
        cameraControllerRef.current.stopDemoDrive();
        cameraControllerRef.current.resetToCityView(activeCity.centerCoordinates, activeCity.initialZoom);
      }
      return;
    }

    // Move camera
    switch (focusedFeature.type) {
      case 'route':
        const route = mobilityState.routes.find(r => r.id === focusedFeature.id);
        if (route) cameraControllerRef.current.followRoute(route.geometry);
        break;
      case 'incident':
        cameraControllerRef.current.focusIncident(focusedFeature.coordinates);
        break;
      case 'checkpoint':
        cameraControllerRef.current.focusCheckpoint(focusedFeature.coordinates);
        
        // Show React Panel in popup
        const chk = mobilityState.checkpoints.find(c => c.id === focusedFeature.id);
        if (chk) {
          const popupNode = document.createElement('div');
          const popup = new mapboxgl.Popup({ offset: 15, closeButton: false, className: 'custom-popup' }).setDOMContent(popupNode);
          const root = createRoot(popupNode);
          root.render(<CheckpointPanel checkpoint={chk} />);
          popup.setLngLat(focusedFeature.coordinates).addTo(map.current!);
          popupsRef.current.push(popup);
        }
        break;
      case 'camera':
        cameraControllerRef.current.focusCamera(focusedFeature.coordinates);
        
        // Show React Panel in popup
        const cam = mobilityState.cameras.find(c => c.id === focusedFeature.id);
        if (cam) {
          const popupNode = document.createElement('div');
          const popup = new mapboxgl.Popup({ offset: 15, closeButton: false, className: 'custom-popup' }).setDOMContent(popupNode);
          const root = createRoot(popupNode);
          root.render(<CameraPreviewPanel camera={cam} />);
          popup.setLngLat(focusedFeature.coordinates).addTo(map.current!);
          popupsRef.current.push(popup);
        }
        break;
      case 'hotspot':
        cameraControllerRef.current.focusHotspot(focusedFeature.coordinates);
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedFeature, isDemoDriveActive]);

  const initMapLayers = () => {
    if (!map.current) return;
    
    // Empty sources
    map.current.addSource('traffic', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.current.addLayer({
      id: 'traffic-lines',
      type: 'line',
      source: 'traffic',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': ['get', 'color'], 'line-width': 6 },
    });

    map.current.addSource('routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.current.addLayer({
      id: 'route-lines',
      type: 'line',
      source: 'routes',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], 'line-opacity': ['get', 'opacity'] },
    }, 'traffic-lines');

    map.current.addSource('hotspots', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.current.addLayer({
      id: 'hotspot-circles',
      type: 'circle',
      source: 'hotspots',
      paint: {
        'circle-radius': 40,
        'circle-color': 'rgba(239, 68, 68, 0.2)',
        'circle-stroke-width': 1,
        'circle-stroke-color': 'rgba(239, 68, 68, 0.8)',
      },
    });

    // Clustered Checkpoints
    map.current.addSource('checkpoints', { 
      type: 'geojson', 
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    map.current.addLayer({
      id: 'checkpoints-clusters',
      type: 'circle',
      source: 'checkpoints',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#1f2937',
        'circle-radius': 15,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#3b82f6'
      }
    });

    map.current.addLayer({
      id: 'checkpoints-cluster-count',
      type: 'symbol',
      source: 'checkpoints',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    map.current.addLayer({
      id: 'checkpoints-unclustered',
      type: 'circle',
      source: 'checkpoints',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#3b82f6',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#1f2937'
      }
    });

    // Cameras (Unclustered)
    map.current.addSource('cameras', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.current.addLayer({
      id: 'cameras-layer',
      type: 'circle',
      source: 'cameras',
      paint: {
        'circle-color': '#10b981',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#1f2937'
      }
    });

    // Incidents (Symbol)
    map.current.addSource('incidents', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.current.addLayer({
      id: 'incidents-layer',
      type: 'circle',
      source: 'incidents',
      paint: {
        'circle-color': '#ef4444',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Vehicles (Symbol)
    map.current.addSource('vehicles', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.current.addLayer({
      id: 'vehicles-layer',
      type: 'symbol',
      source: 'vehicles',
      layout: {
        'icon-image': 'car-icon',
        'icon-size': 0.75,
        'icon-rotate': ['get', 'heading'],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      },
      paint: {
        'icon-opacity': 0.9
      }
    });
  };

  const updateMapLayers = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Determine visibility based on activeSection
    const showTraffic = activeSection === 'overview' || activeSection === 'traffic' || activeSection === 'roadAhead';
    const showIncidents = activeSection === 'overview' || activeSection === 'incidents' || activeSection === 'roadAhead' || activeSection === 'traffic';
    const showCheckpoints = activeSection === 'checkpoints' || activeSection === 'roadAhead';
    const showCameras = activeSection === 'cameras' || activeSection === 'roadAhead';
    const showHotspots = activeSection === 'risk' || activeSection === 'overview';
    const showRoutes = activeSection === 'routes' || activeSection === 'roadAhead' || activeSection === 'overview';

    // Traffic Segments
    (map.current.getSource('traffic') as mapboxgl.GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: showTraffic ? mobilityState.segments.map((seg: TrafficSegment) => {
        const forecast = mobilityState.forecasts?.find(f => f.segmentId === seg.id);
        const population = Math.floor(seg.estimatedDensityVehPerKmPerLane * seg.lengthKm * seg.laneCount);
        const visualSample = Math.min(population, 100); 
        
        return {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: seg.coordinates },
          properties: { 
            color: getTrafficColor(seg.trafficState),
            roadName: seg.roadName,
            trafficState: seg.trafficState,
            currentSpeedKmh: seg.currentSpeedKmh,
            freeFlowSpeedKmh: seg.freeFlowSpeedKmh,
            density: seg.estimatedDensityVehPerKmPerLane,
            flow: seg.estimatedFlowVehPerHour,
            capacity: seg.laneCount * 1200, 
            population: visualSample,
            forecastState: forecast?.predictedState || null,
            forecastHorizon: forecast?.forecastHorizon || null
          },
        };
      }) : [],
    });

    // Routes
    (map.current.getSource('routes') as mapboxgl.GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: showRoutes ? mobilityState.routes.map(r => ({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: r.geometry },
        properties: { 
          color: r.id === mobilityState.recommendedRouteId ? '#3b82f6' : '#6b7280',
          width: r.id === mobilityState.recommendedRouteId ? 6 : 3,
          opacity: r.id === mobilityState.recommendedRouteId ? 0.8 : 0.4
        },
      })) : [],
    });

    // Hotspots
    (map.current.getSource('hotspots') as mapboxgl.GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: showHotspots ? mobilityState.hotspots.map(h => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: h.location },
        properties: { radius: h.radius },
      })) : [],
    });

    // Checkpoints
    (map.current.getSource('checkpoints') as mapboxgl.GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: showCheckpoints ? mobilityState.checkpoints.map(chk => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: chk.location },
        properties: { id: chk.id, density: chk.trafficDensity },
      })) : [],
    });

    // Cameras
    (map.current.getSource('cameras') as mapboxgl.GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: showCameras ? mobilityState.cameras.map(cam => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: cam.location },
        properties: { id: cam.id },
      })) : [],
    });

    // Incidents
    (map.current.getSource('incidents') as mapboxgl.GeoJSONSource)?.setData({
      type: 'FeatureCollection',
      features: showIncidents ? mobilityState.incidents.map(inc => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: inc.location },
        properties: { id: inc.id, severity: inc.severity },
      })) : [],
    });
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'free-flow': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'congested': return '#ef4444';
      case 'severe': return '#991b1b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="w-full h-full bg-gray-950">
      {hasToken ? (
        <div ref={mapContainer} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-950 relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="z-10 bg-gray-900/80 backdrop-blur-md p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">Mapbox Configuration Required</h3>
            <p className="text-gray-400 max-w-sm mb-4">
              Add <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-300 text-sm">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the interactive 3D map.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
