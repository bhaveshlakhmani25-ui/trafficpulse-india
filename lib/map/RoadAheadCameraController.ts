import mapboxgl from 'mapbox-gl';

export class RoadAheadCameraController {
  private map: mapboxgl.Map;

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  public resetToCityView(centerCoordinates: [number, number], initialZoom: number) {
    this.map.easeTo({
      center: centerCoordinates,
      zoom: initialZoom,
      pitch: 0,
      bearing: 0,
      duration: 2000
    });
  }

  public followRoute(midPoint: [number, number]) {
    this.map.easeTo({
      center: midPoint,
      zoom: 13.5,
      pitch: 65,
      bearing: 25,
      duration: 3000
    });
  }

  public focusIncident(location: [number, number]) {
    this.map.easeTo({
      center: location,
      zoom: 14.5,
      pitch: 60,
      bearing: -20,
      duration: 3000
    });
  }
}
