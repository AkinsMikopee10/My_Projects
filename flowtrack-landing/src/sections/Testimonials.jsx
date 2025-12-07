import TestimonialCard from "../components/TestimonialCard";

const Testimonials = () => {
  return (
    // Testimonials section with scroll offset for navbar, padding, and light gray background
    <section id="testimonials" className="scroll-mt-28 w-full py-20 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          What Our Users Say
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Hear from people who love FlowTrack
        </p>

        {/* Testimonial Cards Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {/* Each TestimonialCard receives a name, role, and message */}
          <TestimonialCard
            name="Alex Johnson"
            role="Productivity Enthusiast"
            message="FlowTrack helped me stay organized and actually finish my tasks on time. It's a game-changer!"
          />
          <TestimonialCard
            name="Samantha Lee"
            role="Freelancer"
            message="I love the minimal dashboard and focus mode. It keeps me on track without distractions."
          />
          <TestimonialCard
            name="Michael Carter"
            role="Startup Founder"
            message="Clean, intuitive, and effective. FlowTrack is the productivity tool I've been looking for."
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
