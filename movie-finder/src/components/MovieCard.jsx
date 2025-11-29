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
  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3"
      >
        <img
          src={getPoster(movie.poster_path)}
          alt={movie.title}
          className="w-full h-72 object-cover rounded-lg"
        />

        <h2 className="font-semibold mt-2 truncate">{movie.title}</h2>
        <p className="text-gray-500 text-sm">
          {movie.release_date?.slice(0, 4)}
        </p>
        <p className="text-yellow-500 text-sm">
          ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
