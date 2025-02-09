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
      colors: {
        green: {
          100: "var(--bg-green-100)", // Usar la variable CSS Un verde muy claro
          200: "var(--bg-green-200)", // Usar la variable CSS Un verde para hovers
          400: "var(--bg-green-400)", // Usar la variable CSS Un verde más
          500: "var(--bg-green-500)", // Usar la variable CSS Un verde medio
          600: "var(--bg-green-600)", // Usar la variable CSS Un verde más oscuro
          700: "var(--bg-green-700)", // Usar la variable CSS Un verde muy oscuro
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
