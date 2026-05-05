import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: { 'color-user': {
          50: "var(--color-user-50)",
          100: "var(--color-user-100)",
          200: "var(--color-user-200)",
          300: "var(--color-user-300)",
          400: "var(--color-user-400)",
          500: "var(--color-user-500)",
          600: "var(--color-user-600)",
          700: "var(--color-user-700)",
          800: "var(--color-user-800)",
          900: "var(--color-user-900)",
        },
      },
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
