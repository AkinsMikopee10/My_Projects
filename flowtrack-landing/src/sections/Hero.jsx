// Import motion from framer-motion for smooth entrance animations
import { motion } from "framer-motion";

const Hero = () => {
  return (
    // Hero section with vertical padding and a subtle gradient background
    <section className="w-full pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        {/* Left side: Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // start slightly below and invisible
          animate={{ opacity: 1, y: 0 }} // animate to visible and original position
          transition={{ duration: 0.5 }} // half-second smooth transition
        >
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Stay Organized. <br />
            Stay Consistent.
            <span className="block text-gray-600">
              With a tool designed for clarity.
            </span>
          </h1>

          {/* Supporting paragraph */}
          <p className="text-gray-600 mt-4 text-lg md:text-xl max-w-lg mx-auto">
            FlowTrack helps you simplify your workflow, boost productivity, and
            stay focused throughout the day — all in a clean, distraction-free
            layout.
          </p>

          {/* Primary CTA Button */}
          <button className="mt-8 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
            Get Started
          </button>
        </motion.div>

        {/* Right side: Placeholder for Image or Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // same entrance animation for consistency
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} // slightly slower for a staggered effect
          className="flex justify-center"
        >
          {/* This is a placeholder div for now; replace with real image later */}
          <div className="w-full h-64 md:h-80 bg-gray-200 rounded-xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
