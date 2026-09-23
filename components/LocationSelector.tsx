'use client';

import { useState } from 'react';
import { LocationProvider } from '../lib/location/LocationProvider';
import { CityRegistry } from '../lib/config/CityRegistry';

interface LocationSelectorProps {
  onCitySelected?: (cityName: string) => void;
}

export default function LocationSelector({ onCitySelected }: LocationSelectorProps = {}) {
  const [status, setStatus] = useState<string>('Idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const supportedCities = CityRegistry.getAllSupportedCities();
  
  const handleUseMyLocation = async () => {
    setError(null);
    setSelectedCity(null);
    
    try {
      const provider = new LocationProvider();
      
      const result = await provider.detectCityContext((progress) => {
        setStatus(progress);
      });
      
      setStatus('Loading city');
      
      if (result.cityConfig?.supported) {
        setSelectedCity(result.cityConfig.name);
        setStatus('Success');
      } else {
        setError(`City "${result.cityConfig?.name}" is not currently supported.`);
        setStatus('Unsupported');
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while detecting location.');
      }
      setStatus('Error');
    }
  };

  const handleManualSelection = (city: string) => {
    setSelectedCity(city);
    setError(null);
    setStatus('Success');
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Select City</h2>
      
      <div className="mb-6">
        <button 
          onClick={handleUseMyLocation}
          disabled={status !== 'Idle' && status !== 'Error' && status !== 'Success' && status !== 'Unsupported'}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:bg-blue-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Use My Location
        </button>
        
        {/* Status Messages */}
        <div className="mt-3 text-sm text-center min-h-5">
          {status === 'Requesting permission' && <span className="text-blue-600">Requesting permission...</span>}
          {status === 'Detecting location' && <span className="text-blue-600 animate-pulse">Detecting location...</span>}
          {status === 'Identifying city' && <span className="text-blue-600 animate-pulse">Identifying city...</span>}
          {status === 'Loading city' && <span className="text-blue-600">Loading city config...</span>}
          {status === 'Success' && selectedCity && <span className="text-green-600 font-medium flex justify-center items-center">📍 {selectedCity} detected successfully</span>}
          {error && <span className="text-red-500">{error}</span>}
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or select manually</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="mt-4">
        <select 
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={selectedCity || ''}
          onChange={(e) => handleManualSelection(e.target.value)}
        >
          <option value="" disabled>Select a city...</option>
          {supportedCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      
      {selectedCity && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-800 font-medium">TrafficPulse active for: <strong>{selectedCity}</strong></p>
          <button 
            onClick={() => onCitySelected && onCitySelected(selectedCity)}
            className="mt-2 text-sm text-green-700 underline hover:text-green-900"
          >
            Proceed to Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}
