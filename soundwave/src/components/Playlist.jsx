import React from "react";
import { Trash2 } from "lucide-react";

/**
 * Playlist Component
 * Now with delete functionality
 */
function Playlist({
  tracks,
  currentIndex,
  isPlaying,
  onTrackSelect,
  onTrackRemove,
}) {
  return (
    <div
      className="
      mt-6 bg-white dark:bg-gray-800 
      rounded-2xl shadow-lg p-6 
      transition-all duration-300
      hover:shadow-xl
    "
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Playlist ({tracks.length} {tracks.length === 1 ? "track" : "tracks"})
      </h3>

      {tracks.length === 0 ? (
        // Empty state
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No tracks in playlist. Add some tracks to get started!
        </p>
      ) : (
        <div className="space-y-2">
          {tracks.map((track, index) => {
            const isCurrentTrack = index === currentIndex;

            return (
              <div
                key={track.id}
                className={`
                  flex items-center gap-4 p-3 rounded-lg 
                  transition-all duration-200
                  ${
                    isCurrentTrack
                      ? "bg-purple-100 dark:bg-purple-900/30 shadow-md"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                {/* Clickable track info */}
                <button
                  onClick={() => onTrackSelect(index)}
                  className="flex items-center gap-4 flex-1 text-left"
                >
                  {/* Track thumbnail */}
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={track.cover || "https://via.placeholder.com/48"}
                      alt={track.title}
                      className="
                        w-12 h-12 object-cover
                        transition-transform duration-300
                        hover:scale-110
                      "
                    />
                  </div>

                  {/* Track info */}
                  <div className="flex-1">
                    <p
                      className={`
                      font-medium transition-colors duration-200
                      ${
                        isCurrentTrack
                          ? "text-purple-700 dark:text-purple-300"
                          : "text-gray-800 dark:text-white"
                      }
                    `}
                    >
                      {track.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      {track.artist}
                    </p>
                  </div>

                  {/* Playing indicator */}
                  {isCurrentTrack && isPlaying && (
                    <div className="flex gap-1 items-end h-5">
                      <span className="w-1 bg-purple-600 rounded-full animate-music-bar-1" />
                      <span className="w-1 bg-purple-600 rounded-full animate-music-bar-2" />
                      <span className="w-1 bg-purple-600 rounded-full animate-music-bar-3" />
                    </div>
                  )}

                  {/* Paused indicator */}
                  {isCurrentTrack && !isPlaying && (
                    <div className="flex gap-1 items-center h-5">
                      <span className="w-1 h-3 bg-purple-600 rounded-full" />
                      <span className="w-1 h-3 bg-purple-600 rounded-full" />
                      <span className="w-1 h-3 bg-purple-600 rounded-full" />
                    </div>
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onTrackRemove(track.id)}
                  className="
                    p-2 rounded-lg
                    text-gray-400 hover:text-red-500 
                    hover:bg-red-50 dark:hover:bg-red-900/20
                    transition-all duration-200
                    active:scale-90
                  "
                  aria-label={`Remove ${track.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Playlist;
