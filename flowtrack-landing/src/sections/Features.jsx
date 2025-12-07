import FeatureCard from "../components/FeatureCard";
import { CheckCircle, Timer, LayoutGrid } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="scroll-mt-28 w-full py-20 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Powerful Features.
          <span className="block text-gray-600 text-xl mt-2">
            Everything you need to stay productive.
          </span>
        </h2>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {/* Each FeatureCard takes an icon, title, and description */}
          <FeatureCard
            icon={CheckCircle}
            title="Task Management"
            description="Create, organize, and track tasks with a clean, intuitive interface designed to remove friction."
          />
          <FeatureCard
            icon={Timer}
            title="Focus Mode"
            description="Stay on track with built-in focus timers that boost your concentration and consistency."
          />
          <FeatureCard
            icon={LayoutGrid}
            title="Clean Dashboard"
            description="A modern minimal dashboard that puts clarity first — all your productivity essentials in one place."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
