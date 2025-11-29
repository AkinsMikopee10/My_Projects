import { useEffect, useState, useRef } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

const Explore = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  // Fetch genres on mount
  useEffect(() => {
    tmdb("/genre/movie/list").then((data) => setGenres(data.genres));
  }, []);

  // Fetch movies when genre or page changes
  useEffect(() => {
    if (!selectedGenre) return;

    tmdb(`/discover/movie?with_genres=${selectedGenre}&page=${page}`).then(
      (data) => {
        // Append new movies instead of replacing
        setMovies((prev) => [...prev, ...data.results]);
      }
    );
  }, [selectedGenre, page]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Explore Movies</h1>

      {/* Genre Dropdown */}
      <select
        onChange={(e) => {
          setSelectedGenre(e.target.value);
          setMovies([]); // reset movies when genre changes
          setPage(1); // reset page
        }}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
      >
        <option value="">Select Genre</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Movie Grid */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Loader for infinite scroll */}
      <div ref={loaderRef} className="h-10"></div>
    </div>
  );
};

export default Explore;
