import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    // Fetch trending movies
    tmdb("/trending/movie/week").then((data) => setTrending(data.results));

    // Fetch top rated movies
    tmdb("/movie/top_rated").then((data) => setTopRated(data.results));

    // Fetch upcoming movies
    tmdb("/movie/upcoming").then((data) => setUpcoming(data.results));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Trending Section */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Trending Movies</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-12">
        {trending.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Top Rated Section */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Top Rated Movies
      </h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-12">
        {topRated.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Upcoming Section */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Upcoming Movies</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {upcoming.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;
