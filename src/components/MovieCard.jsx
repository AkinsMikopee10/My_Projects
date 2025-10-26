import React from "react";

/**
 * MovieCard Component
 * -------------------
 * Displays movie details (poster, title, year).
 * Receives data as props from Home.jsx.
 */

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-3">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x400"
        }
        alt={movie.Title}
        className="w-full h-64 object-cover rounded-md mb-3"
      />
      <h2 className="text-lg font-semibold">{movie.Title}</h2>
      <p className="text-gray-500 text-sm">{movie.Year}</p>
    </div>
  );
};

export default MovieCard;
