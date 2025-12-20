import { motion } from "framer-motion";
import { Check } from "lucide-react";

const About = () => {
  return (
    // About section with padding and white background
    // scroll-mt-28 ensures the section doesn't hide behind the fixed navbar
    <section id="about" className="w-full py-20 bg-white scroll-mt-28">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        {/* Left side: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} // start slightly left and invisible
          whileInView={{ opacity: 1, x: 0 }} // animate to visible in place
          transition={{ duration: 0.5 }} // half-second smooth transition
          viewport={{ once: true }} // animate only the first time in view
        >
          {/* Section Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why FlowTrack?
          </h2>

          {/* Supporting Paragraph */}
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            FlowTrack is designed to help you stay focused, organized, and
            consistent. With a clean interface, intuitive tools, and a
            distraction-free dashboard, you can spend less time managing tasks
            and more time doing meaningful work.
          </p>

          {/* Key Points / Benefits */}
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Check size={20} className="text-blue-600" /> Organize your tasks
              efficiently
            </li>
            <li className="flex items-center gap-2">
              <Check size={20} className="text-blue-600" /> Stay focused with
              built-in timers
            </li>
            <li className="flex items-center gap-2">
              <Check size={20} className="text-blue-600" /> Minimal,
              distraction-free dashboard
            </li>
          </ul>
        </motion.div>

        {/* Right side: Placeholder for Image or Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} // start slightly right and invisible
          whileInView={{ opacity: 1, x: 0 }} // animate into place
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          {/* Image for the About page */}
          <div className="w-full h-64 md:h-80">
            <img
              src="/images/about.png"
              alt="about-image"
              className="rounded-xl shadow-sm"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
