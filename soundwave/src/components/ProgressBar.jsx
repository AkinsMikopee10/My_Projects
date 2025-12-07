import React from "react";
import { formatTime } from "../utils/timeFormat";

/**
 * ProgressBar Component
 * Shows current playback position with seekable bar
 *
 * Props:
 * @param {number} currentTime - Current playback time in seconds
 * @param {number} duration - Total track duration in seconds
 * @param {function} onSeek - Function called when user seeks to new position
 */
function ProgressBar({ currentTime, duration, onSeek }) {
  /**
   * Calculate progress as a percentage (0-100)
   * This determines how much of the bar is filled
   */
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /**
   * Handle clicking on the progress bar
   * This allows users to jump to a specific time
   */
  const handleProgressClick = (e) => {
    // Get the progress bar element
    const progressBar = e.currentTarget;

    // getBoundingClientRect() gives us the size and position of the element
    const rect = progressBar.getBoundingClientRect();

    // Calculate where the user clicked as a percentage
    // e.clientX is the X position of the mouse click
    // rect.left is the left edge of the progress bar
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;

    // Calculate the new time based on the click position
    const newTime = clickPercentage * duration;

    // Call the onSeek function passed from parent
    onSeek(newTime);
  };

  return (
    <div className="mb-4">
      {/* Time displays */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress bar container */}
      <div
        onClick={handleProgressClick}
        className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-label="Playback progress"
      >
        {/* Filled portion of the progress bar */}
        <div
          className="absolute top-0 left-0 h-full bg-purple-600 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />

        {/* Draggable handle - appears on hover */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
