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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-cyan-200 p-4">
      <SearchBar onSearch={handleSearch} />

      {loading && <Loader />}

      {error && (
        <div className="text-red-600 bg-white/60 px-4 py-2 rounded-xl mt-4">
          {error}
        </div>
      )}

      {!loading && !error && <WeatherCard weather={weather} />}
    </div>
  );
};

export default App;
