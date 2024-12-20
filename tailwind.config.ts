import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        card: "inset 0px -20px 24px -3px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
