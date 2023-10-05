import { Config } from "tailwindcss";

export default {
  content: [
    "../../packages/ui/**/*.{ts,tsx}",
    "./**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#379bda4d",
          DEFAULT: "#379BDA",//"#318BD0",
          dark: "#2B7ABF",
        },
				gray: {
					DEFAULT: "#f1f1f1"
				},
				// white: {
				// 	DEFAULT: '#f9fafb'
				// },
				black: '#04060D'
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
