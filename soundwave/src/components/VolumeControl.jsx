import React from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * VolumeControl Component
 * Enhanced with smooth transitions and mute button
 *
 * Props:
 * @param {number} volume - Current volume (0 to 1)
 * @param {function} onVolumeChange - Function to handle volume changes
 */
function VolumeControl({ volume, onVolumeChange }) {
  // Determine if volume is muted
  const isMuted = volume === 0;

  return (
    <div className="flex items-center gap-3">
      {/* Volume icon - changes based on volume level */}
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      )}

      {/* Volume slider with custom styling */}
      <div className="relative flex-1 group">
        {/* Track background */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="
            w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg 
            appearance-none cursor-pointer 
            accent-purple-600
            transition-all duration-200
            hover:h-3
          "
          aria-label="Volume control"
        />

        {/* Visual fill indicator */}
        <div
          className="
            absolute top-0 left-0 h-2 
            bg-purple-600 rounded-lg 
            pointer-events-none
            transition-all duration-100
            group-hover:h-3
          "
          style={{ width: `${volume * 100}%` }}
        />
      </div>

      {/* Volume percentage with smooth fade */}
      <span
        className="
        text-sm text-gray-600 dark:text-gray-300 
        w-12 text-right
        transition-colors duration-200
      "
      >
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}

export default VolumeControl;
