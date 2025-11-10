import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Lagos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message);

      setWeather({
        city: data.name,
        temp: data.main.temp,
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    } catch (err) {
      console.error("Error fetching weather:", err.message);
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = (newCity) => {
    setCity(newCity);
  };

  // 🌈 Function to pick gradient color based on weather type
  const getBackground = (condition) => {
    switch (condition) {
      case "Clear":
        return "from-yellow-400 via-orange-400 to-pink-400";
      case "Clouds":
        return "from-gray-400 via-gray-500 to-gray-600";
      case "Rain":
        return "from-blue-500 via-blue-600 to-gray-700";
      case "Thunderstorm":
        return "from-indigo-700 via-purple-700 to-gray-800";
      case "Snow":
        return "from-blue-200 via-white to-blue-300";
      case "Mist":
      case "Fog":
        return "from-gray-300 via-gray-400 to-gray-500";
      default:
        return "from-blue-400 via-cyan-400 to-sky-500";
    }
  };

  const bgGradient = weather
    ? getBackground(weather.condition)
    : "from-blue-400 to-cyan-400";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start sm:justify-center bg-gradient-to-b ${bgGradient} px-4 sm:px-6 md:px-10 py-8 sm:py-12 transition-all duration-700`}
    >
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <SearchBar onSearch={handleSearch} />

        {loading && <Loader />}

        {error && (
          <div className="text-red-700 bg-white/70 text-center px-4 py-2 rounded-xl mt-4 w-full sm:w-auto">
            {error}
          </div>
        )}

        {!loading && !error && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
};

export default App;
