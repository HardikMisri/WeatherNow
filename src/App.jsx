import React from 'react';
import  { useState } from 'react';
import WeatherCard from './weatherCard';
import { Search, MapPin } from 'lucide-react';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Open Meteo API endpoints
  const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

  // Function to get coordinates from city name
  const getCoordinates = async (cityName) => {
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('City not found');
    }

    return data.results[0];
  };

  // Function to get weather condition description from WMO code
  const getWeatherDescription = (weatherCode) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };

    return weatherCodes[weatherCode] || 'Unknown';
  };

  // Function to fetch weather data
  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, get coordinates for the city
      const location = await getCoordinates(cityName);
      
      // Then fetch weather data using coordinates
      const weatherResponse = await fetch(
        `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,visibility&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current_weather;
      const hourly = weatherData.hourly;

      // Get current hour index for additional data
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      // Transform the API response to match our WeatherCard component
      const transformedData = {
        city: location.name,
        country: location.country,
        temperature: Math.round(current.temperature),
        condition: getWeatherDescription(current.weathercode),
        feelsLike: Math.round(current.temperature), 
        humidity: hourly.relativehumidity_2m[currentHour] || 0,
        windSpeed: Math.round(current.windspeed),
        visibility: Math.round((hourly.visibility[currentHour] || 10000) / 1000), // Convert m to km
      };

      setWeatherData(transformedData);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setCity(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Get current location weather
  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError('');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get location name from coordinates using reverse geocoding
            const locationResponse = await fetch(
              `${GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
            );

            let locationName = 'Current Location';
            let countryName = '';

            if (locationResponse.ok) {
              const locationData = await locationResponse.json();
              if (locationData.results && locationData.results.length > 0) {
                locationName = locationData.results[0].name;
                countryName = locationData.results[0].country;
              }
            }

            // Fetch weather data using coordinates
            const weatherResponse = await fetch(
              `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,visibility&timezone=auto`
            );

            if (!weatherResponse.ok) {
              throw new Error('Unable to fetch weather for your location');
            }

            const weatherData = await weatherResponse.json();
            const current = weatherData.current_weather;
            const hourly = weatherData.hourly;

            // Get current hour index for additional data
            const currentTime = new Date();
            const currentHour = currentTime.getHours();

            const transformedData = {
              city: locationName,
              country: countryName,
              temperature: Math.round(current.temperature),
              condition: getWeatherDescription(current.weathercode),
              feelsLike: Math.round(current.temperature),
              humidity: hourly.relativehumidity_2m[currentHour] || 0,
              windSpeed: Math.round(current.windspeed),
              visibility: Math.round((hourly.visibility[currentHour] || 10000) / 1000),
            };

            setWeatherData(transformedData);
            setCity(locationName); // Update input with current location city
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('Unable to access your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            WeatherNow
          </h1>
          <p className="text-blue-100 text-lg md:text-xl">
            Get real-time weather information for any city
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex justify-center items-center">
              <input
                type="text"
                value={city}
                onChange={handleInputChange}
                placeholder="Enter city name..."
                className=" px-4 py-3 pr-12 text-gray-800
                 bg-white rounded-full shadow-lg focus:outline-none 
                 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="ml-2 p-2  text-gray-600 hover:text-blue-600
                 transition-colors duration-200 disabled:opacity-50"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Current Location Button */}
          <div className="text-center mt-4">
            <button
              onClick={getCurrentLocationWeather}
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-200 disabled:opacity-50 backdrop-blur-sm"
            >
              <MapPin size={16} className="mr-2" />
              Use Current Location
            </button>
          </div>
        </div>

        {/* Weather Card */}
        <WeatherCard 
          weatherData={weatherData}
          loading={loading}
          error={error}
        />

        {/* Footer */}
        <div className="text-center mt-8 text-white/70">
          <p className="text-sm">
            Powered by Open Meteo API
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;