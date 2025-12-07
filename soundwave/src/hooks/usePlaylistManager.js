import { useState, useEffect } from "react";

/**
 * Custom Hook: usePlaylistManager
 * Manages playlist state with localStorage persistence
 *
 * @param {Array} initialPlaylist - Default playlist to use if none saved
 * @returns {Object} - Playlist data and functions to manage it
 */
function usePlaylistManager(initialPlaylist) {
  // Key for localStorage
  const STORAGE_KEY = "soundwave-playlist";

  /**
   * Initialize state from localStorage or use default
   * This function runs once when the component mounts
   */
  const getInitialPlaylist = () => {
    try {
      // Try to get saved playlist from localStorage
      const savedPlaylist = localStorage.getItem(STORAGE_KEY);

      if (savedPlaylist) {
        // Parse the JSON string back into an array
        return JSON.parse(savedPlaylist);
      }
    } catch (error) {
      // If there's an error (corrupt data, etc.), log it
      console.error("Error loading playlist from localStorage:", error);
    }

    // If no saved data or error, return the initial playlist
    return initialPlaylist;
  };

  // State for our playlist
  const [playlist, setPlaylist] = useState(getInitialPlaylist);

  /**
   * Effect: Save playlist to localStorage whenever it changes
   */
  useEffect(() => {
    try {
      // Convert playlist array to JSON string and save
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
    } catch (error) {
      console.error("Error saving playlist to localStorage:", error);
    }
  }, [playlist]); // Run whenever playlist changes

  /**
   * Add a new track to the playlist
   * @param {Object} track - Track object to add
   */
  const addTrack = (track) => {
    // Create new track with unique ID
    const newTrack = {
      ...track,
      id: Date.now(), // Simple unique ID using timestamp
    };

    // Add to end of playlist
    setPlaylist((prevPlaylist) => [...prevPlaylist, newTrack]);
  };

  /**
   * Remove a track from the playlist
   * @param {number} trackId - ID of track to remove
   */
  const removeTrack = (trackId) => {
    setPlaylist((prevPlaylist) =>
      prevPlaylist.filter((track) => track.id !== trackId)
    );
  };

  /**
   * Update an existing track
   * @param {number} trackId - ID of track to update
   * @param {Object} updates - Object with fields to update
   */
  const updateTrack = (trackId, updates) => {
    setPlaylist((prevPlaylist) =>
      prevPlaylist.map((track) =>
        track.id === trackId ? { ...track, ...updates } : track
      )
    );
  };

  /**
   * Clear all tracks from playlist
   */
  const clearPlaylist = () => {
    setPlaylist([]);
  };

  /**
   * Reset playlist to initial/default
   */
  const resetPlaylist = () => {
    setPlaylist(initialPlaylist);
  };

  // Return everything our components need
  return {
    playlist,
    addTrack,
    removeTrack,
    updateTrack,
    clearPlaylist,
    resetPlaylist,
  };
}

export default usePlaylistManager;
