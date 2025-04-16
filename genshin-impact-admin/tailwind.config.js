/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"HYWenHei"',
          '"Spectral"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        display: ['"HYWenHei"', '"Spectral"', "serif"],
      },
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
        // Warna Genshin Impact
        geo: "#F9A825",
        anemo: "#4FCFBE",
        cryo: "#9BE8FB",
        dendro: "#A5C83B",
        electro: "#AF8EC1",
        hydro: "#4A90E2",
        pyro: "#EF7A35",
      },
    },
  },
  plugins: [],
};
