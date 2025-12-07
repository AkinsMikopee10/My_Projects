import { motion } from "framer-motion";

const CTA = () => {
  return (
    // Call-to-Action section with gradient background and padding
    <section className="w-full py-20 bg-gradient-to-br from-blue-50/60 to-white">
      <div className="container text-center">
        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }} // start slightly below and invisible
          whileInView={{ opacity: 1, y: 0 }} // animate into place
          transition={{ duration: 0.4 }} // smooth 0.4s transition
          viewport={{ once: true }} // animate only first time
          className="text-3xl md:text-4xl font-bold"
        >
          Ready to Organize Your Workflow?
        </motion.h2>

        {/* Supporting Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }} // delay slightly after heading
          className="text-gray-500 mt-3"
        >
          Start using FlowTrack today and take control of your productivity.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }} // slightly smaller and invisible
          whileInView={{ opacity: 1, scale: 1 }} // animate to full size and visible
          transition={{ delay: 0.3 }}
          className="mt-8 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

export default CTA;
