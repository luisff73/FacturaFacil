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
          100: "var(--bg-color-user-100)", // Usar la variable CSS Un color muy claro
          200: "var(--bg-color-user-200)", // Usar la variable CSS Un color para hovers
          400: "var(--bg-color-user-400)", // Usar la variable CSS Un color más
          500: "var(--bg-color-user-500)", // Usar la variable CSS Un color medio
          600: "var(--bg-color-user-600)", // Usar la variable CSS Un color más oscuro
          700: "var(--bg-color-user-700)", // Usar la variable CSS Un color muy oscuro
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
