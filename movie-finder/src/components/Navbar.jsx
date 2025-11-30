import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/70 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white font-bold">
            CineScope
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/search" className="text-slate-300 hover:text-white">
              Search
            </Link>
            <Link to="/explore" className="text-slate-300 hover:text-white">
              Explore
            </Link>
            <Link to="/watchlist" className="text-slate-300 hover:text-white">
              Watchlist
            </Link>
          </div>
        </div>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
