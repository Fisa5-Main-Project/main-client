import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        toss: {
          blue: "var(--color-toss-blue)",
          "blue-light": "var(--color-toss-blue-light)",
          bg: "var(--color-toss-bg)",
          white: "var(--color-toss-white)",
          "text-high": "var(--color-toss-text-high)",
          "text-medium": "var(--color-toss-text-medium)",
          "text-low": "var(--color-toss-text-low)",
          "text-disabled": "var(--color-toss-text-disabled)",
          border: "var(--color-toss-border)",
          "border-light": "var(--color-toss-border-light)",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        heading: ["var(--font-wooridaum)", "sans-serif"],
      },
      borderRadius: {
        "toss-card": "var(--radius-toss-card)",
        "toss-btn": "var(--radius-toss-btn)",
        "toss-inner": "var(--radius-toss-inner)",
      },
    },
  },
  plugins: [],
};
export default config;
