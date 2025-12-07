import React from "react";
import { Minimize2, Maximize2 } from "lucide-react";

/**
 * MiniPlayer Component
 * Compact version of the player
 *
 * Props:
 * @param {Object} currentTrack - Current playing track
 * @param {boolean} isPlaying - Is audio playing
 * @param {function} onTogglePlay - Toggle play/pause
 * @param {function} onExpand - Expand to full player
 */
function MiniPlayer({ currentTrack, isPlaying, onTogglePlay, onExpand }) {
  if (!currentTrack) return null;

  return (
    <div
      className="
      fixed bottom-0 left-0 right-0
      bg-white dark:bg-gray-800
      border-t border-gray-200 dark:border-gray-700
      shadow-2xl
      z-50
      animate-slide-up
    "
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Album Art */}
          <img
            src={currentTrack.cover || "https://via.placeholder.com/48"}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-lg shadow-md"
          />

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {currentTrack.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {currentTrack.artist}
            </p>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="
              p-3 rounded-full
              bg-purple-600 hover:bg-purple-700
              text-white
              transition-all duration-200
              active:scale-95
            "
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>

          {/* Expand Button */}
          <button
            onClick={onExpand}
            className="
              p-2 rounded-full
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors duration-200
            "
            aria-label="Expand player"
          >
            <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniPlayer;
