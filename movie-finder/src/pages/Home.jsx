import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Home = () => {
  const [query, setQuery] = useState("Avengers"); // default on first load
  const [movies, setMovies] = useState([]);      // array of movie objects from OMDB
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

    const fetchMovies = useCallback(async(q = "" ) =>{
        if (!apiKey) {
            setError('Missing OMDB API key. Add VITE_OMDB_API_KEY to your .env');
            setMovies([])
            return
        }

        // Basic validation


export default Home;
