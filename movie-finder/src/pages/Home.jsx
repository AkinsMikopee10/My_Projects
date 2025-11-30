import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { getBackdrop } from "../utils/imageUrl";
import Loader from "../components/Loader";

const Home = () => {
  const [trending, setTrending] = useState([]); // holds the list of trending movies
  const [featured, setFeatured] = useState(null); // holds one "hero" movie at the top
  const [topRated, setTopRated] = useState([]); // holds the list of top rated movies
  const [upcoming, setUpcoming] = useState([]); // holds the list of upcoming movies
  const [loading, setLoading] = useState(true); // stores loading state

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // show loader while fetching
      try {
        // Gets the trending movies
        const trendingData = await tmdb("/trending/movie/day");
        setTrending(trendingData.results || []);

        // Picks one movie with a backdrop image to feature at the top
        const withBackdrop =
          (trendingData.results || []).find((m) => m.backdrop_path) ||
          (trendingData.results || [])[0];
        setFeatured(withBackdrop || null);

        // Gets the top rated movies
        const topRatedData = await tmdb("/movie/top_rated");
        setTopRated(topRatedData.results || []);

        // Gets the upcoming movies
        const upcomingData = await tmdb("/movie/upcoming");
        setUpcoming(upcomingData.results || []);
      } finally {
        // Hide loader once all requests are done
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // If we’re still loading, show the Loader component instead of the page
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Loader />
      </div>
    );
  }

  // Once data is loaded, renders the page
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Hero section: big banner at the top with one featured movie */}
      {featured && (
        <section className="relative mb-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <img
            src={getBackdrop(featured.backdrop_path)}
            alt={featured.title}
            className="w-full h-[320px] md:h-[420px] object-cover"
          />
          {/* Dark gradient overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          {/* Places text content over the image */}
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
            <h1 className="text-2xl md:text-4xl font-bold text-white max-w-3xl">
              {featured.title}
            </h1>
            <p className="text-slate-200 mt-3 line-clamp-3 max-w-3xl">
              {featured.overview}
            </p>
            {/* Buttons: one scrolls to trending, one goes to details */}
            <div className="mt-4 flex gap-3">
              <a
                href="#trending"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Browse trending
              </a>
              <a
                href={`/movie/${featured.id}`}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                View details
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Trending movies grid */}
      <section id="trending" className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Trending now
        </h2>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trending.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      {/* Top Rated movies grid */}
      <section id="top-rated" className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Top Rated
        </h2>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topRated.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      {/* Upcoming movies grid */}
      <section id="upcoming" className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
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
