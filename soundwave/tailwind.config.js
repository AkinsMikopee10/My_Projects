/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Custom animations
      animation: {
        "spin-slow": "spin 20s linear infinite", // Rotates once every 20 seconds
      },
      // Optional: Add custom keyframes if you want more control
      keyframes: {
        // You can define custom animations here
      },
    },
  },
  plugins: [],
};
