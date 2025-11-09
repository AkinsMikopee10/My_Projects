import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    onSearch(query);
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex items-center justify-between mb-6 bg-white/30 backdrop-blur-lg p-2 rounded-xl shadow-lg"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="flex-1 bg-transparent outline-none px-3 text-gray-800 placeholder-gray-500"
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-all">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
