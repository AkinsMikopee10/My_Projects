import React from "react";

/**
 * MovieCard Component
 * -------------------
 * Displays movie details (poster, title, year).
 * Receives data as props from Home.jsx.
 */

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-3">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x400"
        }
        alt={movie.Title}
        className="w-full h-72 object-cover rounded-lg mb-3"
      />
      <div className="px-1">
        <h2 className="text-lg font-semibold truncate">{movie.Title}</h2>
        <p className="text-gray-500 text-sm">{movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
