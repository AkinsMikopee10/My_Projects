/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#4f46e5", // indigo-600
          dark: "#6366f1", // indigo-500
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
