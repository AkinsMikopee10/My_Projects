import React from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar Component
 * Filter tracks by search query
 *
 * Props:
 * @param {string} searchQuery - Current search text
 * @param {function} onSearchChange - Handle search input changes
 * @param {function} onSearchClear - Clear search
 */
function SearchBar({ searchQuery, onSearchChange, onSearchClear }) {
  return (
    <div className="relative mb-4">
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tracks, artists, albums..."
        className="
          w-full pl-10 pr-10 py-3
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-xl
          text-gray-900 dark:text-white
          placeholder-gray-400
          focus:ring-2 focus:ring-purple-600 focus:border-transparent
          transition-all duration-200
        "
      />

      {/* Clear Button (only show when there's text) */}
      {searchQuery && (
        <button
          onClick={onSearchClear}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            p-1 rounded-full
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
