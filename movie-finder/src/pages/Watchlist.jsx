import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { tmdb } from "../api/tmdb";
import Loader from "../components/Loader";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(ids.map((id) => tmdb(`/movie/${id}`)))
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        My Watchlist
      </h1>

      {loading ? (
        <Loader />
      ) : movies.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          Your watchlist is empty.
        </p>
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
