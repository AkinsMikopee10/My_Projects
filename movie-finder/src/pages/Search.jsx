import { useState } from "react";
import { tmdb } from "../api/tmdb";
import { debounce } from "../utils/debounce";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);

  // Debounced search function
  const handleSearch = debounce(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }

    const data = await tmdb(`/search/movie?query=${q}`);
    setSuggestions(data.results.slice(0, 5)); // show top 5 suggestions
  }, 400);

  function onChange(e) {
    const q = e.target.value;
    setQuery(q);
    handleSearch(q);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const data = await tmdb(`/search/movie?query=${query}`);
    setResults(data.results);
    setSuggestions([]); // clear dropdown
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Search Movies</h1>

      <form onSubmit={onSubmit} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search for a movie..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-lg shadow-md mt-2 w-full z-10">
            {suggestions.map((movie) => (
              <li
                key={movie.id}
                onClick={() => {
                  setQuery(movie.title);
                  setSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {movie.title}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Results Grid */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
