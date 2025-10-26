import React from "react";

/**
 * SearchBar Component
 * -------------------
 * Handles user input for movie searches.
 * Will later trigger the fetch function in Home.jsx.
 */

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8 w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-72 sm:w-80 md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
