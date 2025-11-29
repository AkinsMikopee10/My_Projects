/**
 * Image URL Helper
 * ----------------
 * Builds full TMDB image URLs or returns a placeholder.
 */
export const getPoster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : "/placeholder.jpg";
