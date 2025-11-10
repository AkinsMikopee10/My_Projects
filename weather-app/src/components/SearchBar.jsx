import { useState } from "react";
import { Search } from "lucide-react";

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
      className="w-full max-w-md flex items-center gap-3 bg-white/30 backdrop-blur-md p-2 rounded-2xl shadow-lg"
    >
      <Search className="text-white w-6 h-6" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="flex-1 bg-transparent outline-none px-3 text-gray-800 placeholder-gray-500"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
