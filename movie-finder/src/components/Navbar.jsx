import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-slate-900 dark:text-white">
          CineScope
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to="/search"
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Search
          </Link>
          <Link
            to="/explore"
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Explore
          </Link>
          <Link
            to="/watchlist"
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Watchlist
          </Link>
        </div>

        {/* Right side: Theme toggle + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="sm:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar (off-canvas from right with animation) */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`relative w-64 bg-white dark:bg-slate-900 h-full shadow-lg p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="self-end mb-6 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <X size={20} />
          </button>

          <Link
            to="/search"
            className="mb-4 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Search
          </Link>
          <Link
            to="/explore"
            className="mb-4 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            to="/watchlist"
            className="mb-4 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Watchlist
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
