import React, { useState, useRef, useEffect } from "react";
import { Moon, Sun, Minimize2 } from "lucide-react";

// Import components
import AlbumArt from "./components/AlbumArt";
import TrackInfo from "./components/TrackInfo";
import PlayerControls from "./components/PlayerControls";
import VolumeControl from "./components/VolumeControl";
import ProgressBar from "./components/ProgressBar";
import Playlist from "./components/Playlist";
import AddTrack from "./components/AddTrack";
import AudioVisualizer from "./components/AudioVisualizer";
import PlaybackModes from "./components/PlaybackModes";
import SearchBar from "./components/SearchBar";
import MiniPlayer from "./components/MiniPlayer";

// Import hooks
import usePlaylistManager from "./hooks/usePlaylistManager";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

// Import utilities
import { createShuffledIndices } from "./utils/shuffle";

// Import initial playlist data
import { PLAYLIST } from "./data/playlist";

function App() {
  // ===== PLAYLIST MANAGEMENT =====
  const { playlist, addTrack, removeTrack, resetPlaylist } =
    usePlaylistManager(PLAYLIST);

  // ===== STATE MANAGEMENT =====
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // NEW: Advanced features state
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // 'off', 'all', 'one'
  const [searchQuery, setSearchQuery] = useState("");
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([]);

  // ===== REF =====
  const audioRef = useRef(null);

  // ===== COMPUTED VALUES =====

  // Get current track
  const currentTrack = playlist[currentTrackIndex] || null;

  // Filter playlist based on search
  const filteredPlaylist = playlist.filter((track) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      (track.album && track.album.toLowerCase().includes(query))
    );
  });

  // ===== SHUFFLE LOGIC =====

  /**
   * Get next track index based on shuffle mode
   */
  const getNextIndex = () => {
    if (playlist.length === 0) return 0;

    if (shuffleMode && shuffledIndices.length > 0) {
      // Find current position in shuffled array
      const currentPos = shuffledIndices.indexOf(currentTrackIndex);
      const nextPos = (currentPos + 1) % shuffledIndices.length;
      return shuffledIndices[nextPos];
    } else {
      // Normal sequential play
      return (currentTrackIndex + 1) % playlist.length;
    }
  };

  /**
   * Get previous track index based on shuffle mode
   */
  const getPreviousIndex = () => {
    if (playlist.length === 0) return 0;

    if (shuffleMode && shuffledIndices.length > 0) {
      const currentPos = shuffledIndices.indexOf(currentTrackIndex);
      const prevPos =
        (currentPos - 1 + shuffledIndices.length) % shuffledIndices.length;
      return shuffledIndices[prevPos];
    } else {
      return (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }
  };

  // ===== EVENT HANDLERS =====

  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex(getNextIndex());
    setIsPlaying(true);
  };

  const previousTrack = () => {
    if (playlist.length === 0) return;

    // If we're more than 3 seconds in, restart current track
    if (currentTime > 3) {
      handleSeek(0);
    } else {
      setCurrentTrackIndex(getPreviousIndex());
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAddTrack = (trackData) => {
    addTrack(trackData);
  };

  const handleRemoveTrack = (trackId) => {
    if (currentTrack && currentTrack.id === trackId) {
      setIsPlaying(false);
      if (playlist.length > 1) {
        nextTrack();
      } else {
        setCurrentTrackIndex(0);
      }
    }
    removeTrack(trackId);
  };

  const handleVolumeUp = () => {
    const newVolume = Math.min(volume + 0.1, 1);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleVolumeDown = () => {
    const newVolume = Math.max(volume - 0.1, 0);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // NEW: Shuffle toggle
  const handleShuffleToggle = () => {
    const newShuffleMode = !shuffleMode;
    setShuffleMode(newShuffleMode);

    if (newShuffleMode) {
      // Create shuffled order starting with current track
      const shuffled = createShuffledIndices(
        playlist.length,
        currentTrackIndex
      );
      setShuffledIndices(shuffled);
    }
  };

  // NEW: Repeat toggle
  const handleRepeatToggle = () => {
    // Cycle through: off → all → one → off
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  // NEW: Handle track end
  const handleTrackEnd = () => {
    if (repeatMode === "one") {
      // Repeat current track
      handleSeek(0);
      audioRef.current.play();
    } else if (
      repeatMode === "all" ||
      currentTrackIndex < playlist.length - 1 ||
      shuffleMode
    ) {
      // Go to next track
      nextTrack();
    } else {
      // Stop at end of playlist
      setIsPlaying(false);
    }
  };

  // NEW: Search handlers
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  // NEW: Mini-player toggle
  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
  };

  // ===== KEYBOARD SHORTCUTS =====
  useKeyboardShortcuts({
    onPlayPause: togglePlay,
    onNext: nextTrack,
    onPrevious: previousTrack,
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
  });

  // ===== EFFECTS =====

  // Update audio when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load();
      if (isPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch((err) => {
            console.error("Error playing audio:", err);
            setIsPlaying(false);
          });
        }, 100);
      }
    }
    setCurrentTime(0);
  }, [currentTrackIndex, playlist]);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  // Handle empty playlist
  useEffect(() => {
    if (playlist.length === 0) {
      setIsPlaying(false);
      setCurrentTrackIndex(0);
      setShuffledIndices([]);
    } else if (currentTrackIndex >= playlist.length) {
      setCurrentTrackIndex(playlist.length - 1);
    }
  }, [playlist.length, currentTrackIndex]);

  // Update shuffled indices when playlist changes
  useEffect(() => {
    if (shuffleMode && playlist.length > 0) {
      const shuffled = createShuffledIndices(
        playlist.length,
        currentTrackIndex
      );
      setShuffledIndices(shuffled);
    }
  }, [playlist.length]);

  // ===== RENDER =====

  // Show mini-player
  if (isMiniPlayer && currentTrack) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                🎵 SoundWave
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Player minimized. Check the bottom of your screen!
              </p>
              <button
                onClick={toggleMiniPlayer}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
              >
                Show Full Player
              </button>
            </div>
          </div>

          <MiniPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onExpand={toggleMiniPlayer}
          />

          <audio
            ref={audioRef}
            src={currentTrack.audio}
            onEnded={handleTrackEnd}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>
      </div>
    );
  }

  // Show full player
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                🎵 SoundWave
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                  Space
                </kbd>{" "}
                to play/pause •
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs mx-1">
                  ←→
                </kbd>{" "}
                to navigate
              </p>
            </div>
            <div className="flex gap-2">
              {currentTrack && (
                <button
                  onClick={toggleMiniPlayer}
                  className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                  aria-label="Mini player"
                  title="Mini player"
                >
                  <Minimize2 className="w-6 h-6 text-gray-700 dark:text-white" />
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            {/* Player Card */}
            {currentTrack ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transition-colors duration-300">
                <AlbumArt
                  src={
                    currentTrack.cover ||
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
                  }
                  alt={`${currentTrack.album} cover`}
                  isPlaying={isPlaying}
                />

                <TrackInfo
                  title={currentTrack.title}
                  artist={currentTrack.artist}
                  album={currentTrack.album || "Unknown Album"}
                />

                {/* Audio Visualizer */}
                <AudioVisualizer
                  audioElement={audioRef.current}
                  isPlaying={isPlaying}
                />

                <ProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
                />

                {/* Playback Modes */}
                <PlaybackModes
                  shuffleMode={shuffleMode}
                  repeatMode={repeatMode}
                  onShuffleToggle={handleShuffleToggle}
                  onRepeatToggle={handleRepeatToggle}
                />

                <PlayerControls
                  isPlaying={isPlaying}
                  onPlayPause={togglePlay}
                  onNext={nextTrack}
                  onPrevious={previousTrack}
                />

                <VolumeControl
                  volume={volume}
                  onVolumeChange={handleVolumeChange}
                />

                <audio
                  ref={audioRef}
                  src={currentTrack.audio}
                  onEnded={handleTrackEnd}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />
              </div>
            ) : (
              // Empty player state
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No tracks in your playlist
                </p>
                <button
                  onClick={resetPlaylist}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Load Default Playlist
                </button>
              </div>
            )}

            {/* Add Track Form */}
            <AddTrack onAddTrack={handleAddTrack} />

            {/* Search Bar */}
            <div className="mt-6">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchClear={handleSearchClear}
              />
            </div>

            {/* Playlist */}
            <Playlist
              tracks={searchQuery ? filteredPlaylist : playlist}
              currentIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onTrackSelect={handleTrackSelect}
              onTrackRemove={handleRemoveTrack}
            />

            {/* Search results info */}
            {searchQuery && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Showing {filteredPlaylist.length} of {playlist.length} tracks
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
