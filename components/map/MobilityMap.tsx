'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MobilityState, TrafficSegment } from '../../lib/mobility/types';
import { CityConfig } from '../../lib/config/CityRegistry';
import { createRoot } from 'react-dom/client';
import CheckpointPanel from '../cockpit/CheckpointPanel';
import CameraPreviewPanel from '../cockpit/CameraPreviewPanel';
import { RoadAheadCameraController } from '../../lib/map/RoadAheadCameraController';

interface MobilityMapProps {
  mobilityState: MobilityState;
  activeCity: CityConfig;
}

export default function MobilityMap({ mobilityState, activeCity }: MobilityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hasToken] = useState(!!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const cameraControllerRef = useRef<RoadAheadCameraController | null>(null);

  useEffect(() => {
    if (!hasToken || !mapContainer.current) return;

    if (map.current) {
      // Not handling dynamic city change perfectly here to keep demo simple, 
      // but we could flyTo the new center.
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
      style: 'mapbox://styles/mapbox/standard', // Use 3D standard style
      center: activeCity.centerCoordinates,
      zoom: activeCity.initialZoom,
      pitch: 0, // Starts top-down
      bearing: 0,
    });

    map.current.on('style.load', () => {
      // Configuration for Standard style 3D
      map.current?.setConfigProperty('basemap', 'lightPreset', 'dusk'); // darker, premium look
      cameraControllerRef.current = new RoadAheadCameraController(map.current!);
      updateMapLayers();
    });

    return () => {
      map.current?.remove();
      map.current = null;
      cameraControllerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCity.id, hasToken]);

  // Update sources/layers whenever mobility state changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    updateMapLayers();
    updateMarkers();
    updateCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobilityState]);

  const updateCamera = () => {
    if (!cameraControllerRef.current) return;
    
    const recommendedRoute = mobilityState.routes.find(r => r.id === mobilityState.recommendedRouteId);

    // If an incident is active and we want to draw attention
    if (mobilityState.scenarioState === 'INCIDENT_DETECTED' || mobilityState.scenarioState === 'IMPACT') {
      const incident = mobilityState.incidents[0];
      if (incident) {
        cameraControllerRef.current.focusIncident(incident.location);
        return;
      }
    }

    // Road Ahead perspective for active route
    if (recommendedRoute) {
      // Center roughly around the middle of the route, with a pitch
      const midPoint = recommendedRoute.geometry[Math.floor(recommendedRoute.geometry.length / 2)] as [number, number];
      cameraControllerRef.current.followRoute(midPoint);
    } else {
      // Top down
      cameraControllerRef.current.resetToCityView(activeCity.centerCoordinates, activeCity.initialZoom);
    }
  };

  const updateMapLayers = () => {
    if (!map.current) return;

    // Traffic Segments Layer
    if (map.current.getSource('traffic')) {
      const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
        type: 'FeatureCollection',
        features: mobilityState.segments.map((seg: TrafficSegment) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: seg.coordinates,
          },
          properties: {
            color: getTrafficColor(seg.congestionLevel),
          },
        })),
      };
      (map.current.getSource('traffic') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.current.addSource('traffic', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: mobilityState.segments.map((seg: TrafficSegment) => ({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: seg.coordinates },
            properties: { color: getTrafficColor(seg.congestionLevel) },
          })),
        }
      });
      map.current.addLayer({
        id: 'traffic-lines',
        type: 'line',
        source: 'traffic',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 6,
        },
      });
    }

    // Routes Layer
    if (map.current.getSource('routes')) {
      const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
        type: 'FeatureCollection',
        features: mobilityState.routes.map(r => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: r.geometry },
          properties: { 
            color: r.id === mobilityState.recommendedRouteId ? '#3b82f6' : '#6b7280',
            width: r.id === mobilityState.recommendedRouteId ? 6 : 3,
            opacity: r.id === mobilityState.recommendedRouteId ? 0.8 : 0.4
          },
        })),
      };
      (map.current.getSource('routes') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.current.addSource('routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: mobilityState.routes.map(r => ({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: r.geometry },
            properties: { 
              color: r.id === mobilityState.recommendedRouteId ? '#3b82f6' : '#6b7280',
              width: r.id === mobilityState.recommendedRouteId ? 6 : 3,
              opacity: r.id === mobilityState.recommendedRouteId ? 0.8 : 0.4
            },
          })),
        }
      });
      // Add routes below traffic lines
      map.current.addLayer({
        id: 'route-lines',
        type: 'line',
        source: 'routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': ['get', 'opacity'],
        },
      }, 'traffic-lines'); // Before traffic-lines
    }

    // Hotspots Layer
    if (map.current.getSource('hotspots')) {
      const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features: mobilityState.hotspots.map(h => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: h.location },
          properties: { radius: h.radius },
        })),
      };
      (map.current.getSource('hotspots') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.current.addSource('hotspots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: mobilityState.hotspots.map(h => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: h.location },
            properties: { radius: h.radius },
          })),
        }
      });
      map.current.addLayer({
        id: 'hotspot-circles',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-radius': 40, // Base radius
          'circle-color': 'rgba(239, 68, 68, 0.2)', // Red-500 with low opacity
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(239, 68, 68, 0.8)',
        },
      });
    }
  };

  const updateMarkers = () => {
    if (!map.current) return;
    
    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Incidents
    mobilityState.incidents.forEach(inc => {
      const el = document.createElement('div');
      el.className = 'w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-2xl animate-bounce cursor-pointer';
      el.innerHTML = '<span class="text-white text-lg font-bold">!</span>';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(inc.location)
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });

    // Checkpoints
    mobilityState.checkpoints.forEach(chk => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-gray-900 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform';
      el.innerHTML = '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>';

      const popupNode = document.createElement('div');
      const popup = new mapboxgl.Popup({ offset: 15, closeButton: false, className: 'custom-popup' }).setDOMContent(popupNode);
      const root = createRoot(popupNode);
      root.render(<CheckpointPanel checkpoint={chk} />);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(chk.location)
        .setPopup(popup)
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });

    // Cameras
    mobilityState.cameras.forEach(cam => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-gray-900 border-2 border-emerald-500 rounded flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform';
      el.innerHTML = '<span class="text-[10px]">📹</span>';

      const popupNode = document.createElement('div');
      const popup = new mapboxgl.Popup({ offset: 15, closeButton: false, className: 'custom-popup' }).setDOMContent(popupNode);
      const root = createRoot(popupNode);
      root.render(<CameraPreviewPanel camera={cam} />);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(cam.location)
        .setPopup(popup)
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'free-flow': return '#10b981'; // Green
      case 'moderate': return '#f59e0b'; // Amber
      case 'congested': return '#ef4444'; // Red
      case 'severe': return '#991b1b'; // Dark Red
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
            <p className="text-gray-500 text-xs italic">
              Simulation and Intelligence Panels remain functional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
