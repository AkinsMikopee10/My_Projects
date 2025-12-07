import React from "react";

/**
 * TrackInfo Component
 * Displays the current track's title, artist, and album
 *
 * Props:
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {string} album - Album name
 */
function TrackInfo({ title, artist, album }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">{artist}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{album}</p>
    </div>
  );
}

export default TrackInfo;
