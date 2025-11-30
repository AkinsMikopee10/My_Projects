import { useState } from "react";
import { tmdb } from "../api/tmdb";
import { debounce } from "../utils/debounce";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

const Search = () => {
  const [query, setQuery] = useState(""); //stores what the user types in the search box
  const [suggestions, setSuggestions] = useState([]); // shows quick suggestions while typing
  const [results, setResults] = useState([]); //stores final search results after submit
  const [loading, setLoading] = useState(false); //stores whether results are been fetched

  // Debounced search handler: waits 400ms after typing before calling API
  const handleSearch = debounce(async (q) => {
    if (!q.trim()) {
      // If input is empty, clear suggestions
      setSuggestions([]);
      return;
    }
    // Fetch movie suggestions from TMDB
    const data = await tmdb(`/search/movie?query=${q}`);
    // Show only the first 5 suggestions
    setSuggestions(data.results.slice(0, 5));
  }, 400);

  // Runs every time the input changes
  function onChange(e) {
    const q = e.target.value;
    setQuery(q);
    handleSearch(q);
  }

  // Runs when the user submits the form (By pressing Enter)
  async function onSubmit(e) {
    e.preventDefault(); // prevents page reload
    if (!query.trim()) return; // ignores empty search

    setLoading(true);
    const data = await tmdb(`/search/movie?query=${query}`);
    setResults(data.results);
    setSuggestions([]);
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Search Movies
      </h1>

      {/* Search form */}
      <form onSubmit={onSubmit} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search for a movie..."
          className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200"
        />

        {/* Suggestions dropdown (shows while typing) */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-md mt-2 w-full z-10">
            {suggestions.map((movie) => (
              <li
                key={movie.id}
                onClick={() => {
                  setQuery(movie.title);
                  setSuggestions([]);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200"
              >
                {movie.title}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Loader or results */}
      {loading ? (
        // Show loader while fetching
        <Loader />
      ) : (
        // Show results once loaded
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
