import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";

/**
 * Home Page
 * ----------
 * Fetches movie data from OMDB API based on user input.
 * Displays loading/error states and results in a responsive grid.
 */

const Home = () => {
  const [searchQuery, setSearchQuery] = useState(""); // default on first load
  const [movies, setMovies] = useState([]); // array of movie objects from OMDB
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  // 🔹 Fetch movies from OMDB API
  async function fetchMovies() {
    if (!searchQuery.trim()) {
      setError("Please enter a movie title.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        🎬 Movie Finder
      </h1>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={fetchMovies}
      />

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Error or No Results */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* Movie Results Grid */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-10">
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>
  );
};
export default Home;
