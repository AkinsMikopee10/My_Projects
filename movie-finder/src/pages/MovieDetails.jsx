import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { getPoster } from "../utils/imageUrl";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rec, setRec] = useState([]);

  useEffect(() => {
    // Fetch movie details
    tmdb(`/movie/${id}`).then(setMovie);

    // Fetch recommendations
    tmdb(`/movie/${id}/recommendations`).then((data) => setRec(data.results));
  }, [id]);

  if (!movie) return <p className="text-center">Loading...</p>;

  const addToWatchlist = (id) => {
    const current = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!current.includes(id)) {
      localStorage.setItem("watchlist", JSON.stringify([...current, id]));
      alert("Added to Watchlist!");
    } else {
      alert("Already in Watchlist!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <img
        src={getPoster(movie.poster_path)}
        alt={movie.title}
        className="w-72 rounded-xl mb-4 mx-auto"
      />
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="text-gray-600 my-4">{movie.overview}</p>
      <p className="text-yellow-500">⭐ {movie.vote_average.toFixed(1)}</p>

      {/* Genres */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {movie.genres?.map((g) => (
          <span
            key={g.id}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
          >
            {g.name}
          </span>
        ))}
      </div>

      <button
        onClick={() => addToWatchlist(movie.id)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ➕ Add to Watchlist
      </button>

      {/* Trailer link (optional) */}
      {movie.homepage && (
        <a
          href={movie.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-600 hover:underline"
        >
          🎥 Watch Trailer / Visit Homepage
        </a>
      )}

      {/* Recommendations */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Recommended Movies</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {rec.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
