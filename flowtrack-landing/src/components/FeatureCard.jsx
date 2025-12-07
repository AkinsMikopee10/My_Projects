import { motion } from "framer-motion";

// FeatureCard component is reusable for all features
// Props:
// - icon: React component (passed as Icon)
// - title: string
// - description: string
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    // Card container with entrance animation when it comes into view
    <motion.div
      initial={{ opacity: 0, y: 15 }} // start slightly below and invisible
      whileInView={{ opacity: 1, y: 0 }} // animate to visible and original position
      transition={{ duration: 0.4 }} // 0.4s smooth transition
      viewport={{ once: true }} // animate only the first time it enters viewport
      className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
    >
      {/* Icon container */}
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 mb-4">
        <Icon size={26} className="text-gray-800" />
      </div>

      {/* Feature title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Feature description */}
      <p className="text-gray-600 mt-2 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
