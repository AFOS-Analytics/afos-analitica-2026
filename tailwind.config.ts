import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F52BA',
        'primary-dark': '#0a3d8f',
        danger: '#DC2626',
        dark: '#1a1a1a',
        'dark-secondary': '#333333',
        'light-bg': '#F8FAFC',
        'light-border': '#E2E8F0',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
