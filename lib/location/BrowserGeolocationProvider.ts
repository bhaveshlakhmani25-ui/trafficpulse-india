export interface GeolocationResult {
  latitude: number;
  longitude: number;
}

export class BrowserGeolocationProvider {
  /**
   * Requests the user's current location via the HTML5 Geolocation API.
   * Prompts for permission if not already granted.
   */
  async getCurrentPosition(timeoutMs = 10000): Promise<GeolocationResult> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission denied.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable.'));
              break;
            case error.TIMEOUT:
              reject(new Error('The request to get user location timed out.'));
              break;
            default:
              reject(new Error('An unknown error occurred getting location.'));
              break;
          }
        },
        {
          enableHighAccuracy: false,
          timeout: timeoutMs,
          maximumAge: 0,
        }
      );
    });
  }
}
