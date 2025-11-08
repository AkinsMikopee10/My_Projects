const WeatherCard = () => {
  return (
    <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-2xl text-center">
      <h2 className="text-2xl font-bold mb-2">City Name</h2>
      <p className="text-5xl font-extrabold mb-2">28°C</p>
      <p className="text-lg font-medium mb-4">Sunny</p>
      <div className="flex justify-around text-sm text-gray-700">
        <span>Humidity: 60%</span>
        <span>Wind: 10km/h</span>
      </div>
    </div>
  );
};

export default WeatherCard;
