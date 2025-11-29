import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { tmdb } from "../api/tmdb";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("watchlist")) || [];

    Promise.all(ids.map((id) => tmdb(`/movie/${id}`))).then(setMovies);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

      {movies.length === 0 ? (
        <p className="text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
