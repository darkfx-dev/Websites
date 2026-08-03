import type { Config } from "tailwindcss";

/**
 * Tokens mirror the brief's "Surti Mono Editorial" system exactly. The same
 * values are also emitted as CSS custom properties in globals.css so that
 * one-off rules (paper grain, focus ring) can reach them without a Tailwind
 * class.
 *
 * The balance the palette is built for is roughly 80% warm-white canvas,
 * 15% black type and editorial surfaces, 5% food accent — so yellow, red and
 * green are intentionally few and small here, not a full scale of tints.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#fdfdfb",
        surface: "#ffffff",
        "surface-muted": "#f4f3ee",
        ink: "#0a0a0a",
        "ink-soft": "#343434",
        muted: "#696965",
        line: "#d8d8d2",
        khaman: "#e9c934",
        chilli: "#a43227",
        chutney: "#2d6245",
        focus: "#155eef",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        "gujarati-display": ["var(--font-gujarati-display)", "serif"],
        "gujarati-sans": ["var(--font-gujarati-sans)", "sans-serif"],
      },
      // The brief's spacing scale: 8, 12, 16, 24, 32, 48, 64, 88, 112, 144.
      // Tailwind already covers the small end; these fill the editorial end.
      spacing: {
        "22": "5.5rem", // 88px
        "28": "7rem", // 112px
        "36": "9rem", // 144px
      },
      borderRadius: {
        card: "12px",
        feature: "18px",
      },
      borderColor: {
        DEFAULT: "rgba(10,10,10,0.12)",
      },
      boxShadow: {
        // The brief's maximum elevation. There is deliberately nothing heavier.
        elevated: "0 16px 40px rgba(0,0,0,0.08)",
      },
      maxWidth: {
        content: "1240px",
        measure: "68ch",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.22, 1, 0.36, 1)",
        enter: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
