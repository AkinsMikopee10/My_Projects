// Import icons for the mobile menu toggle
import { Menu, X } from "lucide-react";
// useState to track if the mobile menu is open or closed
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full py-4 border-b bg-white/80 backdrop-blur-md fixed top-0 left-0 z-50">
      <nav className="container flex items-center justify-between">
        {/* Logo / Brand name */}
        <h1 className="text-2xl font-bold text-gray-900">FlowTrack</h1>

        {/* Desktop Menu - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#about" className="hover:text-blue-600 transition">
            About
          </a>
          <a href="#testimonials" className="hover:text-blue-600 transition">
            Testimonials
          </a>
        </div>

        {/* Desktop CTA button - hidden on mobile */}
        <button className="hidden md:block bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition">
          Get Started
        </button>

        {/* Mobile Menu Toggle Icon */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {/* Toggle between hamburger and X icon */}
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu - only visible when 'open' is true */}
      {open && (
        <div className="md:hidden bg-white border-t py-4 px-4 space-y-4 font-medium text-gray-700 animate-slideDown">
          {/* Close menu on click of a link */}
          <a href="#features" className="block" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="#about" className="block" onClick={() => setOpen(false)}>
            About
          </a>
          <a
            href="#testimonials"
            className="block"
            onClick={() => setOpen(false)}
          >
            Testimonials
          </a>
          {/* Mobile CTA button */}
          <button
            className="w-full bg-black text-white py-2 rounded-lg"
            onClick={() => setOpen(false)}
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
