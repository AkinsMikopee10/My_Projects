import React, { useState } from "react";

/**
 * AlbumArt Component
 * Displays album cover with rotation animation when playing
 * Includes loading state with skeleton
 *
 * Props:
 * @param {string} src - URL of the album cover image
 * @param {string} alt - Alt text for accessibility
 * @param {boolean} isPlaying - Whether audio is currently playing
 */
function AlbumArt({ src, alt, isPlaying }) {
  // Track whether the image has loaded
  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * Called when image finishes loading
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="mb-8 relative">
      {/* Skeleton loader - shows while image is loading */}
      {!imageLoaded && (
        <div className="w-full aspect-square bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse" />
      )}

      {/* Album cover image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={`
          w-full aspect-square object-cover rounded-2xl shadow-lg
          transition-all duration-500
          ${imageLoaded ? "opacity-100" : "opacity-0"}
          ${isPlaying ? "animate-spin-slow" : ""}
        `}
        style={{
          // Ensure image is hidden until loaded
          display: imageLoaded ? "block" : "none",
        }}
      />

      {/* Vinyl record effect - optional decorative element */}
      {isPlaying && imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-gray-900/20 dark:bg-white/10 rounded-full backdrop-blur-sm" />
        </div>
      )}
    </div>
  );
}

export default AlbumArt;
