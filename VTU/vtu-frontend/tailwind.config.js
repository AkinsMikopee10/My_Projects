/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6c63ff",
          primaryDark: "#5a54e0",
          accent: "#00d4aa",
          dark: "#0a0f1e",
          card: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.1)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      backdropBlur: {
        xl: "20px",
      },
      animation: {
        slideUp: "slideUp 0.5s ease",
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
