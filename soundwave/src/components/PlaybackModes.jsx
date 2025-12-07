import React from "react";
import { Shuffle, Repeat, Repeat1 } from "lucide-react";

/**
 * PlaybackModes Component
 * Controls for shuffle and repeat modes
 *
 * Props:
 * @param {boolean} shuffleMode - Whether shuffle is enabled
 * @param {string} repeatMode - 'off', 'all', or 'one'
 * @param {function} onShuffleToggle - Toggle shuffle
 * @param {function} onRepeatToggle - Cycle through repeat modes
 */
function PlaybackModes({
  shuffleMode,
  repeatMode,
  onShuffleToggle,
  onRepeatToggle,
}) {
  /**
   * Get the appropriate repeat icon based on mode
   */
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {/* Shuffle Button */}
      <button
        onClick={onShuffleToggle}
        className={`
          p-2 rounded-full transition-all duration-200
          ${
            shuffleMode
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }
          hover:scale-110 active:scale-95
        `}
        aria-label={shuffleMode ? "Disable shuffle" : "Enable shuffle"}
        title={shuffleMode ? "Shuffle: On" : "Shuffle: Off"}
      >
        <Shuffle className="w-5 h-5" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={onRepeatToggle}
        className={`
          p-2 rounded-full transition-all duration-200
          ${
            repeatMode !== "off"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }
          hover:scale-110 active:scale-95
        `}
        aria-label={`Repeat: ${repeatMode}`}
        title={`Repeat: ${
          repeatMode === "off" ? "Off" : repeatMode === "one" ? "One" : "All"
        }`}
      >
        <RepeatIcon className="w-5 h-5" />
      </button>

      {/* Mode labels */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {shuffleMode && <span className="mr-2">🔀 Shuffle</span>}
        {repeatMode !== "off" && (
          <span>🔁 Repeat {repeatMode === "one" ? "One" : "All"}</span>
        )}
      </div>
    </div>
  );
}

export default PlaybackModes;
