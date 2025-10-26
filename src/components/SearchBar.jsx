import React from "react";

const SearchBar = ({ query, setQuery, onSearch }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="w-full"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies by title....."
        className="w-full p-3 rounded-lg border focus:ring"
      />
    </form>
  );
};

export default SearchBar;
