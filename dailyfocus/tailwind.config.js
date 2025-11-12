/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purpleGlow: "#8B5CF6",
        tealMist: "#14B8A6",
        sunsetStart: "#F472B6",
        sunsetEnd: "#FBBF24",
        softZinc: "#F3F4F6",
        slateInk: "#1F2937",
        coolGray: "#6B7280",
        emeraldPop: "#10B981",
        amberPulse: "#F59E0B",
        roseFlash: "#F43F5E",
        charcoal: "#111827",
      },
      backgroundImage: {
        "sunset-gradient": "linear-gradient(to bottom right, #F472B6, #FBBF24)",
      },
    },
  },
  plugins: [],
};
