import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { getPoster, getBackdrop } from "../utils/imageUrl";
import Loader from "../components/Loader";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    // Fetch trending movies
    tmdb("/trending/movie/day").then((data) => {
      setTrending(data.results || []);
      const withBackdrop =
        (data.results || []).find((m) => m.backdrop_path) ||
        (data.results || [])[0];
      setFeatured(withBackdrop || null);
    });

    // Fetch top rated movies
    tmdb("/movie/top_rated").then((data) => setTopRated(data.results || []));

    // Fetch upcoming movies
    tmdb("/movie/upcoming").then((data) => setUpcoming(data.results || []));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Hero */}
      {featured && (
        <section className="relative mb-10 rounded-2xl overflow-hidden border border-slate-700">
          <img
            src={getBackdrop(featured.backdrop_path)}
            alt={featured.title}
            className="w-full h-[320px] md:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
            <h1 className="text-2xl md:text-4xl font-bold text-white max-w-3xl">
              {featured.title}
            </h1>
            <p className="text-slate-200 mt-3 line-clamp-3 max-w-3xl">
              {featured.overview}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#trending"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Browse trending
              </a>
              <a
                href={`/movie/${featured.id}`}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
              >
                View details
              </a>
            </div>
          </div>
        </section>
      )}
      {/* Trending */}
      <section id="trending" className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
          Trending now
        </h2>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trending.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section id="top-rated" className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
          Top Rated
        </h2>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topRated.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section id="upcoming" className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
          Upcoming
        </h2>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {upcoming.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
