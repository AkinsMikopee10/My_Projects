import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import About from "./sections/About";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

const App = () => {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden pt-20">
      {/* Navbar at the top so users can navigate quickly */}
      <Navbar />

      {/* Hero section: this is the first thing users see, big headline + CTA */}
      <Hero />

      {/* Features section: highlight the main tools and functionalities */}
      <Features />

      {/* About section: a little story about FlowTrack and why it exists */}
      <About />

      {/* Testimonials section: show what real users think, builds trust */}
      <Testimonials />

      {/* CTA section: encourage users to take action (like signing up or downloading) */}
      <CTA />

      {/* Footer: basic site info, links, copyright */}
      <Footer />
    </main>
  );
};

// Export the App component so index.jsx can render it
export default App;
