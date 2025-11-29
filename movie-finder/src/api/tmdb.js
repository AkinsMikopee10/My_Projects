const API_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;

/**
 * TMDB API Utility
 * ----------------
 * Handles requests to TMDB with error handling.
 */
export async function tmdb(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}?api_key=${TMDB_API_KEY}`);

  if (!res.ok) throw new Error("Failed to fetch TMDB");

  return res.json();
}
