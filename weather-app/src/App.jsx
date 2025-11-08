import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-cyan-200 p-4">
      <SearchBar />
      <WeatherCard />
    </div>
  );
};

export default App;
