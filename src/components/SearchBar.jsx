import React from "react";

/**
 * SearchBar Component
 * -------------------
 * Handles user input for movie searches.
 * Will later trigger the fetch function in Home.jsx.
 */

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <div className="flex justify-center items-center mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="border border-gray-300 rounded-l-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
