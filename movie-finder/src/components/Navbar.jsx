import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 mb-6 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CineScope
        </Link>

        <div className="flex gap-6 text-gray-700">
          <Link to="/explore">Explore</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/search">Search</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
