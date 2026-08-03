import type { Config } from "tailwindcss";

/**
 * Tailwind reads every token from the CSS custom properties in globals.css,
 * so that file stays the single source of truth for the palette and scale.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        walnut: {
          DEFAULT: "var(--walnut)",
          deep: "var(--walnut-deep)",
          raised: "var(--walnut-raised)",
        },
        brass: {
          DEFAULT: "var(--brass)",
          bright: "var(--brass-bright)",
          line: "var(--brass-line)",
          wash: "var(--brass-wash)",
        },
        patina: "var(--patina)",
        silk: {
          DEFAULT: "var(--silk)",
          dim: "var(--silk-dim)",
          faint: "var(--silk-faint)",
        },
        hairline: {
          DEFAULT: "var(--hairline)",
          strong: "var(--hairline-strong)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        label: "var(--t-label)",
        sm: "var(--t-sm)",
        base: "var(--t-base)",
        lead: "var(--t-lead)",
        h3: "var(--t-h3)",
        h2: "var(--t-h2)",
        h1: "var(--t-h1)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        DEFAULT: "var(--r)",
        lg: "var(--r-lg)",
      },
      maxWidth: {
        page: "1240px",
        prose: "64ch",
      },
      transitionTimingFunction: {
        soft: "var(--ease)",
      },
    },
  },
  plugins: [],
};

export default config;
