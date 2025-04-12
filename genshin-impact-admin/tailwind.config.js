/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#83c5be",
          DEFAULT: "#006d77",
          dark: "#004e59",
        },
        secondary: {
          light: "#ffddd2",
          DEFAULT: "#e29578",
          dark: "#c86a50",
        },
        background: "#f8f9fa",
        surface: "#ffffff",
        error: "#ef476f",
        success: "#06d6a0",
        warning: "#ffd166",
      },
    },
  },
  plugins: [],
};
