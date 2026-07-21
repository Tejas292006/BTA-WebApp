// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        font1: ['var(--font1)'],
        font2: ['var(--font2)'],
        font3: ['var(--font3)'],
        font4: ['var(--font4)'],
        font5: ['var(--font5)'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};