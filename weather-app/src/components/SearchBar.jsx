const SearchBar = () => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for a city..."
        className="w-full p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
};

export default SearchBar;
