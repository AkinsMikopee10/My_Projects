// src/services/tmdb.js
const BASE_URL = "https://api.themoviedb.org/3";

const searchMoviesTMDB = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${
        import.meta.env.VITE_TMDB_KEY
      }&query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("TMDB API error");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
};

export default searchMoviesTMDB;
