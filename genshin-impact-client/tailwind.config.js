// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#60A5FA", // Blue
          dark: "#3B82F6",
        },
        secondary: {
          DEFAULT: "#F59E0B", // Yellow/Amber
          dark: "#D97706",
        },
        success: {
          DEFAULT: "#10B981", // Green
          dark: "#059669",
        },
        danger: {
          DEFAULT: "#EF4444", // Red
          dark: "#DC2626",
        },
        // Warna untuk elemen Genshin Impact
        anemo: "#74C2A8",
        geo: "#FAB632",
        electro: "#AF8EC1",
        dendro: "#A5C83B",
        hydro: "#4CC2F1",
        pyro: "#EF7A35",
        cryo: "#A0D7E4",
      },
    },
  },
  plugins: [],
};
