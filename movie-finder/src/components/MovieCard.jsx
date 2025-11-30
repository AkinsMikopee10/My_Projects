import { getPoster } from "../utils/imageUrl";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * MovieCard Component
 * -------------------
 * Displays movie poster, title, year, and rating.
 * Links to MovieDetails page when clicked.
 */

const MovieCard = ({ movie }) => {
  const rating = Number(movie.vote_average || 0).toFixed(1);

  return (
    <Link to={`/movie/${movie.id}`} aria-label={`Open ${movie.title} details`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl overflow-hidden bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl"
      >
        <img
          src={getPoster(movie.poster_path)}
          alt={movie.title}
          className="w-full h-80 object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h2 className="text-white font-semibold truncate">{movie.title}</h2>
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <span>{movie.release_date?.slice(0, 4) || "—"}</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-600/80 text-white">
              ⭐ {rating}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
