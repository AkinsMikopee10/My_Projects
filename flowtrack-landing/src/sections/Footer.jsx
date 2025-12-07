// Footer component for the website
const Footer = () => {
  return (
    // Footer container with padding, light gray background, and top border
    <footer className="w-full py-8 bg-gray-100 border-t">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        {/* Copyright Text */}
        <p className="text-gray-600">
          © {new Date().getFullYear()} FlowTrack. All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex gap-6 text-gray-600 text-sm">
          <a href="#" className="hover:text-gray-900 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-900 transition">
            Terms
          </a>
          <a href="#" className="hover:text-gray-900 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
