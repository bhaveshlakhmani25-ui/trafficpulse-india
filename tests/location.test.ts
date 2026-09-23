import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationProvider } from '../lib/location/LocationProvider';
import { BrowserGeolocationProvider } from '../lib/location/BrowserGeolocationProvider';
import { BigDataCloudGeocoder } from '../lib/location/BigDataCloudGeocoder';
import { CityRegistry } from '../lib/config/CityRegistry';

describe('CityRegistry', () => {
  it('identifies supported cities', () => {
    expect(CityRegistry.isSupported('Bengaluru')).toBe(true);
    expect(CityRegistry.isSupported('bengaluru')).toBe(true); // case-insensitive
    expect(CityRegistry.isSupported('Pune')).toBe(true);
  });

  it('identifies unsupported cities', () => {
    expect(CityRegistry.isSupported('New York')).toBe(false);
    expect(CityRegistry.isSupported('')).toBe(false);
  });

  it('returns correct config for supported city', () => {
    const config = CityRegistry.getCityConfig('bengaluru');
    expect(config.supported).toBe(true);
    expect(config.name).toBe('Bengaluru'); // Keeps exact name
    expect(config.id).toBe('bengaluru');
  });

  it('returns fallback config for unsupported city', () => {
    const config = CityRegistry.getCityConfig('Paris');
    expect(config.supported).toBe(false);
    expect(config.name).toBe('Paris');
    expect(config.id).toBe('paris');
  });
});

describe('LocationProvider', () => {
  let locationProvider: LocationProvider;
  let mockGeolocationProvider: any;
  let mockGeocoder: any;

  beforeEach(() => {
    mockGeolocationProvider = {
      getCurrentPosition: vi.fn(),
    };

    mockGeocoder = {
      reverseGeocode: vi.fn(),
    };

    locationProvider = new LocationProvider(
      mockGeolocationProvider as unknown as BrowserGeolocationProvider,
      mockGeocoder as unknown as BigDataCloudGeocoder
    );
  });

  it('successfully detects a supported city', async () => {
    mockGeolocationProvider.getCurrentPosition.mockResolvedValue({ latitude: 12.9716, longitude: 77.5946 });
    mockGeocoder.reverseGeocode.mockResolvedValue({
      city: 'Bengaluru',
      countryName: 'India',
      principalSubdivision: 'Karnataka',
      locality: 'Bengaluru',
    });

    const progressCallback = vi.fn();
    const result = await locationProvider.detectCityContext(progressCallback);

    expect(result.coordinates?.latitude).toBe(12.9716);
    expect(result.locationDetails?.city).toBe('Bengaluru');
    expect(result.cityConfig?.supported).toBe(true);
    expect(result.cityConfig?.name).toBe('Bengaluru');

    expect(progressCallback).toHaveBeenCalledWith('Requesting permission');
    expect(progressCallback).toHaveBeenCalledWith('Identifying city');
  });

  it('successfully detects an unsupported city', async () => {
    mockGeolocationProvider.getCurrentPosition.mockResolvedValue({ latitude: 48.8566, longitude: 2.3522 });
    mockGeocoder.reverseGeocode.mockResolvedValue({
      city: 'Paris',
      countryName: 'France',
      principalSubdivision: 'Ile-de-France',
      locality: 'Paris',
    });

    const result = await locationProvider.detectCityContext();

    expect(result.cityConfig?.supported).toBe(false);
    expect(result.cityConfig?.name).toBe('Paris');
  });

  it('handles geolocation permission denied', async () => {
    mockGeolocationProvider.getCurrentPosition.mockRejectedValue(new Error('Location permission denied.'));

    await expect(locationProvider.detectCityContext()).rejects.toThrow('Location permission denied.');
  });

  it('handles geolocation timeout', async () => {
    mockGeolocationProvider.getCurrentPosition.mockRejectedValue(new Error('The request to get user location timed out.'));

    await expect(locationProvider.detectCityContext()).rejects.toThrow('timed out');
  });

  it('handles geocoder failure', async () => {
    mockGeolocationProvider.getCurrentPosition.mockResolvedValue({ latitude: 12.9716, longitude: 77.5946 });
    mockGeocoder.reverseGeocode.mockRejectedValue(new Error('Geocoder error: Network error'));

    await expect(locationProvider.detectCityContext()).rejects.toThrow('Geocoder error');
  });
});
