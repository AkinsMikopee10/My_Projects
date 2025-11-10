import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplet,
  CloudFog,
} from "lucide-react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const { city, temp, condition, humidity, wind } = weather;

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: <Sun className="text-yellow-300 w-16 h-16" />,
      Clouds: <Cloud className="text-gray-200 w-16 h-16" />,
      Rain: <CloudRain className="text-blue-300 w-16 h-16" />,
      Thunderstorm: <CloudLightning className="text-yellow-500 w-16 h-16" />,
      Snow: <Snowflake className="text-white w-16 h-16" />,
      Mist: <CloudFog className="text-gray-300 w-16 h-16" />,
      Fog: <CloudFog className="text-gray-300 w-16 h-16" />,
    };
    return icons[condition] || <Cloud className="text-gray-200 w-16 h-16" />;
  };

  return (
    <div className="mt-10 bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg text-center text-white w-full max-w-xs sm:max-w-sm md:max-w-md transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-2 tracking-wide">{city}</h2>

      <div className="flex justify-center mb-4">
        {getWeatherIcon(condition)}
      </div>

      <p className="text-5xl font-bold mb-1">{Math.round(weather.temp)}°C</p>
      <p className="text-lg mb-6 opacity-90">{condition}</p>

      <div className="flex justify-around items-center text-sm">
        <div className="flex flex-col items-center">
          <Droplet className="w-6 4-6 mb-1" />
          <p>{humidity}%</p>
          <span>Humidity</span>
        </div>

        <div className="flex flex-col items-center">
          <Wind className="w-6 h-6 mb-1" />
          <p>{wind} m/s</p>
          <span>Wind</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
