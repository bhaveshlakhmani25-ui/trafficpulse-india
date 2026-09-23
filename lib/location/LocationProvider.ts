import { BrowserGeolocationProvider, GeolocationResult } from './BrowserGeolocationProvider';
import { BigDataCloudGeocoder, ReverseGeocodeResult } from './BigDataCloudGeocoder';
import { CityRegistry, CityConfig } from '../config/CityRegistry';

export interface LocationDetectionResult {
  coordinates?: GeolocationResult;
  locationDetails?: ReverseGeocodeResult;
  cityConfig?: CityConfig;
}

export class LocationProvider {
  private geolocationProvider: BrowserGeolocationProvider;
  private geocoder: BigDataCloudGeocoder;

  constructor(
    geolocationProvider = new BrowserGeolocationProvider(),
    geocoder = new BigDataCloudGeocoder()
  ) {
    this.geolocationProvider = geolocationProvider;
    this.geocoder = geocoder;
  }

  /**
   * Orchestrates the full location detection flow:
   * 1. Get browser coordinates
   * 2. Reverse geocode via BigDataCloud
   * 3. Match against CityRegistry
   */
  async detectCityContext(
    onProgress?: (status: 'Requesting permission' | 'Detecting location' | 'Identifying city') => void
  ): Promise<LocationDetectionResult> {
    
    // Step 1: Geolocation
    if (onProgress) onProgress('Requesting permission');
    // Once permission is granted or requested, the provider starts detecting
    if (onProgress) onProgress('Detecting location');
    
    const coordinates = await this.geolocationProvider.getCurrentPosition();

    // Step 2: Reverse Geocode
    if (onProgress) onProgress('Identifying city');
    const locationDetails = await this.geocoder.reverseGeocode(
      coordinates.latitude,
      coordinates.longitude
    );

    // Step 3: Match City
    const cityConfig = CityRegistry.getCityConfig(locationDetails.city);

    return {
      coordinates,
      locationDetails,
      cityConfig,
    };
  }
}
