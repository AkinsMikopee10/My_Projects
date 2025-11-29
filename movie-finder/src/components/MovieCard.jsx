import { getPoster } from "../utils/imageUrl";
import { Link } from "react-router-dom";

/**
 * MovieCard Component
 * -------------------
 * Displays movie poster, title, year, and rating.
 * Links to MovieDetails page when clicked.
 */

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className=" bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-3">
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
      </div>
    </Link>
  );
};

export default MovieCard;
