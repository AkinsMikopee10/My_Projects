// React hooks: useState for data, useEffect for side effects, useRef for DOM references
import { useEffect, useState, useRef } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

const Explore = () => {
  const [genres, setGenres] = useState([]); //stores the list of available genres
  const [selectedGenre, setSelectedGenre] = useState(null); //stores which genre the user picked
  const [movies, setMovies] = useState([]); //stores movies for the selected genre
  const [page, setPage] = useState(1); //stores the current page for infinite scroll
  const [loading, setLoading] = useState(false); // whether we’re fetching data
  const loaderRef = useRef(null); // reference to the "load more" trigger div

  useEffect(() => {
    tmdb("/genre/movie/list").then((data) => setGenres(data.genres));
  }, []);

  // Fetch movies whenever selectedGenre or page changes
  useEffect(() => {
    if (!selectedGenre) return; // don’t fetch until a genre is chosen
    setLoading(true);
    tmdb(`/discover/movie?with_genres=${selectedGenre}&page=${page}`).then(
      (data) => {
        // Append new movies to the existing list (for infinite scroll)
        setMovies((prev) => [...prev, ...data.results]);
        setLoading(false);
      }
    );
  }, [selectedGenre, page]);

  // Infinite scroll: observe the loaderRef div at the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the loader div is visible, load the next page
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 } // trigger only when fully visible
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  // stop observing when component unmounts
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Explore Movies
      </h1>

      {/* Genre dropdown */}
      <select
        onChange={(e) => {
          setSelectedGenre(e.target.value);
          setMovies([]);
          setPage(1);
        }}
        className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 mb-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200"
      >
        <option value="">Select Genre</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Loader or movies grid */}
      {loading && movies.length === 0 ? (
        <Loader />
      ) : (
        // Show movies once loaded
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Invisible div at the bottom: triggers infinite scroll when visible */}
      <div ref={loaderRef} className="h-10"></div>
    </div>
  );
};

export default Explore;
