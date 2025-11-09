const WeatherCard = ({ weather }) => {
  if (!weather) {
    return (
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-2xl text-center">
        <p className="text-lg text-gray-700">Loading weather...</p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-2xl text-center">
      <h2 className="text-2xl font-bold mb-2">{weather.city}</h2>
      <p className="text-5xl font-extrabold mb-2">
        {Math.round(weather.temp)}°C
      </p>
      <p className="text-lg font-medium mb-4">{weather.condition}</p>
      <div className="flex justify-around text-sm text-gray-700">
        <span>Humidity: {weather.humidity}%</span>
        <span>Wind: {weather.wind} km/h</span>
      </div>
    </div>
  );
};

export default WeatherCard;
