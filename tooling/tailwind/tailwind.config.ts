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
          light: "#66b1eb33",
          DEFAULT: "#379BDA",//"#318BD0",
          dark: "#2B7ABF",
        },
				gray: {
					DEFAULT: "#f2f3f5cc"
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
