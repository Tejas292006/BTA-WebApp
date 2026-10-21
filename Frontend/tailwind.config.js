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
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#000000",
            foreground: "#f4f4f5",
            content1: "#121214",
            content2: "#18181b",
            content3: "#222226",
            content4: "#2a2a30",
            divider: "rgba(255, 255, 255, 0.08)",
            focus: "#d8f275",
            default: {
              50: "#18181b",
              100: "#222226",
              200: "#27272a",
              300: "#3f3f46",
              400: "#52525b",
              500: "#71717a",
              600: "#a1a1aa",
              700: "#d4d4d8",
              800: "#e4e4e7",
              900: "#f4f4f5",
            },
          },
        },
      },
    }),
  ],
};