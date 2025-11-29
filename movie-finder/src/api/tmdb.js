const API_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;

export async function tmdb(endpoint) {
  // If endpoint already has a "?", append with "&"
  const url = endpoint.includes("?")
    ? `${API_BASE}${endpoint}&api_key=${TMDB_API_KEY}`
    : `${API_BASE}${endpoint}?api_key=${TMDB_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch TMDB");

  return res.json();
}
