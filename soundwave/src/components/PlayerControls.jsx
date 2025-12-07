import React from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

/**
 * PlayerControls Component
 * Enhanced with animations and hover effects
 *
 * Props:
 * @param {boolean} isPlaying - Whether audio is currently playing
 * @param {function} onPlayPause - Function to toggle play/pause
 * @param {function} onNext - Function to go to next track
 * @param {function} onPrevious - Function to go to previous track
 */
function PlayerControls({ isPlaying, onPlayPause, onNext, onPrevious }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="
          p-3 rounded-full 
          bg-gray-100 dark:bg-gray-700 
          hover:bg-gray-200 dark:hover:bg-gray-600 
          active:scale-95
          transition-all duration-200
          shadow-md hover:shadow-lg
        "
        aria-label="Previous track"
      >
        <SkipBack className="w-6 h-6 text-gray-700 dark:text-white" />
      </button>

      {/* Play/Pause Button - Main control with pulse effect */}
      <button
        onClick={onPlayPause}
        className={`
          relative p-5 rounded-full 
          bg-purple-600 hover:bg-purple-700 
          active:scale-95
          transition-all duration-200 
          shadow-lg hover:shadow-xl
          ${isPlaying ? "animate-pulse-slow" : ""}
        `}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {/* Ripple effect when playing */}
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75 animation-delay-1000" />
          </>
        )}

        {/* Icon */}
        <span className="relative z-10">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" fill="white" />
          ) : (
            <Play className="w-8 h-8 text-white" fill="white" />
          )}
        </span>
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="
          p-3 rounded-full 
          bg-gray-100 dark:bg-gray-700 
          hover:bg-gray-200 dark:hover:bg-gray-600 
          active:scale-95
          transition-all duration-200
          shadow-md hover:shadow-lg
        "
        aria-label="Next track"
      >
        <SkipForward className="w-6 h-6 text-gray-700 dark:text-white" />
      </button>
    </div>
  );
}

export default PlayerControls;
