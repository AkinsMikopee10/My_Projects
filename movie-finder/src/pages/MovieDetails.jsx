import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { getPoster, getBackdrop } from "../utils/imageUrl";
import Loader from "../components/Loader";

const MovieDetails = () => {
  // Grab the "id" from the URL (e.g. /movie/123 → id = 123)
  const { id } = useParams();
  const [movie, setMovie] = useState(null); //stores details of the current movie
  const [rec, setRec] = useState([]); //stores recommended movies
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch movie details
        const movieData = await tmdb(`/movie/${id}`);
        setMovie(movieData);

        // Fetch recommendations for this movie
        const recData = await tmdb(`/movie/${id}/recommendations`);
        setRec(recData.results || []);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Scroll to top whenever a new movie is loaded
    window.scrollTo({ top: 0 });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Loader />
      </div>
    );
  }

  // If no movie found, show fallback message
  if (!movie) return <p className="text-center py-10">Movie not found.</p>;

  // Function to add a movie to localStorage watchlist
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
    <div className="max-w-6xl mx-auto p-4">
      {/* Backdrop banner (big image at the top) */}
      {movie.backdrop_path && (
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <img
            src={getBackdrop(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-[280px] md:h-[400px] lg:h-[500px] object-cover"
          />
          {/* Gradient overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <h1 className="absolute bottom-4 left-6 text-2xl md:text-4xl font-bold text-white">
            {movie.title}
          </h1>
        </div>
      )}

      {/* Poster + details section */}
      <section className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Poster image */}
        {movie.poster_path && (
          <img
            src={getPoster(movie.poster_path)}
            alt={movie.title}
            className="w-full md:w-64 lg:w-72 rounded-xl border border-slate-200 dark:border-slate-700"
          />
        )}

        {/* Movie info */}
        <div className="flex-1">
          {/* Overview text */}
          <p className="text-slate-700 dark:text-slate-200 mb-4">
            {movie.overview}
          </p>
          {/* Rating */}
          <p className="text-yellow-600 dark:text-yellow-400 mb-2">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>

          {/* Genres list */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Add to Watchlist button */}
          <button
            onClick={() => addToWatchlist(movie.id)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add to Watchlist
          </button>

          {/* Link to official homepage/trailer */}
          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              🎥 Watch Trailer / Visit Homepage
            </a>
          )}
        </div>
      </section>

      {/* Recommendations grid */}
      <h2 className="text-xl md:text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-white">
        Recommended Movies
      </h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {rec.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
