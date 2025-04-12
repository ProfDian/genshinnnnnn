/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pyro: "#EF7938",
        hydro: "#4CC2F1",
        anemo: "#74C2A8",
        electro: "#B08FC2",
        dendro: "#A5C83B",
        cryo: "#9FD6E3",
        geo: "#F3B481",
        "rarity-5": "#BD6932",
        "rarity-4": "#A256E1",
        "rarity-3": "#6A94BC",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
