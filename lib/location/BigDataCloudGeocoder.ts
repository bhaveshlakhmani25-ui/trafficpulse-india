export interface ReverseGeocodeResult {
  city: string;
  countryName: string;
  principalSubdivision: string; // State/Region
  locality: string;
}

export class BigDataCloudGeocoder {
  private readonly baseUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  /**
   * Calls the free client-side reverse geocoding API to extract locality information.
   * Does NOT require an API key.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult> {
    const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Fallback logic to find the best representation of a "city"
      const city = data.city || data.locality || data.principalSubdivision;

      if (!city) {
        throw new Error('Could not determine city from coordinates.');
      }

      return {
        city,
        countryName: data.countryName || '',
        principalSubdivision: data.principalSubdivision || '',
        locality: data.locality || '',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Geocoder error: ${error.message}`);
      }
      throw new Error('Unknown geocoder error');
    }
  }
}
