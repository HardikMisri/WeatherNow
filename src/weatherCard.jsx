import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye }
 from 'lucide-react';

const WeatherCard = ({ weatherData, loading, error }) => {
  // Weather icon mapping
  const getWeatherIcon = (condition) => {
    const iconProps = { size: 48, className: "text-white drop-shadow-lg" };
    
    if (!condition) return <Sun {...iconProps} />;
    
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain {...iconProps} />;
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow {...iconProps} />;
    } else if (conditionLower.includes('cloud')) {
      return <Cloud {...iconProps} />;
    } else {
      return <Sun {...iconProps} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-4"></div>
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
          </div>
          <div className="h-16 bg-white/20 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-2xl p-6 text-white">
        <div className="text-center">
          <Cloud size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Weather Not Found</h3>
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!weatherData) {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl shadow-2xl p-6 text-white">
        <div className="text-center">
          <Cloud size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Enter a City</h3>
          <p className="text-gray-200">Search for a city to see the current weather</p>
        </div>
      </div>
    );
  }

  // Main weather card
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 text-white
     transform hover:scale-105 transition-transform duration-200">
      {/* City and Date */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">{weatherData.city}</h2>
        <p className="text-blue-100 text-sm">{weatherData.country}</p>
        <p className="text-blue-100 text-xs mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Weather Icon and Temperature */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            {getWeatherIcon(weatherData.condition)}
          </div>
          <div className="text-5xl font-bold mb-1">
            {Math.round(weatherData.temperature)}°
          </div>
          <p className="text-blue-100 capitalize text-lg">
            {weatherData.condition}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center mb-1">
            <Thermometer size={16} className="mr-2" />
            <span className="text-sm font-medium">Feels Like</span>
          </div>
          <p className="text-lg font-bold">{Math.round(weatherData.feelsLike)}°</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center mb-1">
            <Droplets size={16} className="mr-2" />
            <span className="text-sm font-medium">Humidity</span>
          </div>
          <p className="text-lg font-bold">{weatherData.humidity}%</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center mb-1">
            <Wind size={16} className="mr-2" />
            <span className="text-sm font-medium">Wind Speed</span>
          </div>
          <p className="text-lg font-bold">{weatherData.windSpeed} km/h</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center mb-1">
            <Eye size={16} className="mr-2" />
            <span className="text-sm font-medium">Visibility</span>
          </div>
          <p className="text-lg font-bold">{weatherData.visibility} km</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;