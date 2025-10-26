import React from "react";

const MovieCard = ({ movie }) => {
  // movie shape from OMDB 'Search' is { Title, Year, imdbID, Type, Poster }
  <div className="bg-white p-3 rounded shadow hover:shadow-lg transition">
    <img
      src={movie.Poster !== "N/A" ? movie.Poster : "../../public/vite.svg"}
      alt={movie.Title}
      className="w-full 4-64 object-cover rounded"
    />
    <h3 className="mt-2 font-semibold">{movie.Title}</h3>
    <p className="text-sm text-gray-500">{movie.Year}</p>
  </div>;
};

export default MovieCard;
