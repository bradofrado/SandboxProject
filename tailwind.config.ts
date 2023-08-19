import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          'light': '#2dd4bf33',
          DEFAULT: '#14b8a6',
          'dark': '#0f766e'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
} satisfies Config;
