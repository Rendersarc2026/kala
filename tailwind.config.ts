import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-gotham)", "system-ui", "sans-serif"],
        sans: ["var(--font-gotham)", "system-ui", "sans-serif"],
        mono: ["var(--font-gotham)", "system-ui", "sans-serif"],
      },
      colors: {
        ivory: {
          DEFAULT: "#F8F6F2",
          dark: "#EFECE6",
        },
        charcoal: {
          DEFAULT: "#000000",
          light: "#6B6B68",
        },
        terracotta: "#B8845A",
        "studio-border": "rgba(0,0,0,0.10)",
      },
      letterSpacing: {
        editorial: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
