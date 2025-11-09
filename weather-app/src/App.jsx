import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

const App = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
      const city = "Lagos";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Weather data:", data);
        setWeather({
          city: data.name,
          temp: data.main.temp,
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          wind: data.wind.speed,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-cyan-200 p-4">
      <SearchBar />
      <WeatherCard weather={weather} />
    </div>
  );
};

export default App;
