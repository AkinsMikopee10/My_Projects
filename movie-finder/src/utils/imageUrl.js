/**
 * Image URL Helper
 * ----------------
 * Builds full TMDB image URLs or returns a placeholder.
 */
const TMDB_IMG = "https://image.tmdb.org/t/p";
export const getPoster = (path, size = "w500") =>
  path ? `${TMDB_IMG}/${size}${path}` : "/placeholder-poster.png";
export const getBackdrop = (path, size = "w1280") =>
  path ? `${TMDB_IMG}/${size}${path}` : "/placeholder-backdrop.png";
