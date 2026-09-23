export interface CityConfig {
  id: string;
  name: string;
  country: string;
  centerCoordinates: [number, number]; // [longitude, latitude]
  initialZoom: number;
  supported: boolean;
  dataMode: 'simulation' | 'live';
  liveDataAvailable: boolean;
}

const CITY_REGISTRY: Record<string, CityConfig> = {
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    centerCoordinates: [77.5946, 12.9716],
    initialZoom: 12,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    centerCoordinates: [72.8777, 19.0760],
    initialZoom: 11,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  delhi: {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    centerCoordinates: [77.2090, 28.6139],
    initialZoom: 11,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    centerCoordinates: [78.4867, 17.3850],
    initialZoom: 12,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    centerCoordinates: [80.2707, 13.0827],
    initialZoom: 12,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  kolkata: {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    centerCoordinates: [88.3639, 22.5726],
    initialZoom: 12,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  pune: {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    centerCoordinates: [73.8567, 18.5204],
    initialZoom: 12,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  },
  ahmedabad: {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    centerCoordinates: [72.5714, 23.0225],
    initialZoom: 12,
    supported: true,
    dataMode: 'simulation',
    liveDataAvailable: false,
  }
};

export class CityRegistry {
  /**
   * Checks if a city name (case-insensitive) is supported by the platform.
   */
  static isSupported(cityName: string): boolean {
    if (!cityName) return false;
    const normalized = cityName.trim().toLowerCase();
    return !!CITY_REGISTRY[normalized]?.supported;
  }

  /**
   * Returns a city configuration object if supported, otherwise returns a fallback config.
   */
  static getCityConfig(cityName: string): CityConfig {
    const normalized = cityName.trim().toLowerCase();
    const config = CITY_REGISTRY[normalized];

    if (config) {
      return { ...config };
    }

    // Return a safe fallback for unsupported cities
    return {
      id: normalized,
      name: cityName.trim(),
      country: 'Unknown',
      centerCoordinates: [77.5946, 12.9716], // Default to Bengaluru coords to avoid crash
      initialZoom: 10,
      supported: false,
      dataMode: 'simulation',
      liveDataAvailable: false
    };
  }

  static getAllSupportedCities(): string[] {
    return Object.values(CITY_REGISTRY)
      .filter(c => c.supported)
      .map(c => c.name);
  }
}
