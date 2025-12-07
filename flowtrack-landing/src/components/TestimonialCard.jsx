import { motion } from "framer-motion";

// TestimonialCard component displays a user's feedback
// Props:
// - name: string (user's name)
// - role: string (user's role or title)
// - message: string (testimonial text)
const TestimonialCard = ({ name, role, message }) => {
  return (
    // Card container with entrance animation when scrolled into view
    <motion.div
      initial={{ opacity: 0, y: 20 }} // start slightly lower and invisible
      whileInView={{ opacity: 1, y: 0 }} // animate to visible and original position
      transition={{ duration: 0.4 }} // smooth transition
      viewport={{ once: true }} // animate only once
      className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
    >
      {/* Testimonial Message */}
      <p className="text-gray-700 italic mb-4">"{message}"</p>

      {/* Author Info */}
      <div className="mt-2">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
