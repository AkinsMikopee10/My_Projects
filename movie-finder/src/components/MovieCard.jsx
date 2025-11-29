import { getPoster } from "../utils/imageUrl";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-3">
      <img
        src={getPoster(movie.poster_path)}
        alt={movie.title}
        className="w-full h-72 object-cover rounded-lg mb-3"
      />
      <div className="px-1">
        <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
        <p className="text-gray-500 text-sm">
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
