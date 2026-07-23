import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#15120F", // Spiced Charcoal
          deep: "#0D0C0A", // Deep Charcoal
        },
        cream: "#FFF8EB", // Warm Cream
        ivory: "#F7EEDC", // Soft Ivory
        saffron: "#F2A93B", // Saffron Gold
        tomato: "#B9382D", // Tomato Red
        coriander: "#2F6849", // Coriander Green
        brown: "#765743", // Muted Brown
        "warm-border": "#E6D6BE", // Warm Border
      },
      fontFamily: {
        // Wired to next/font CSS variables in layout.tsx, with system fallbacks.
        display: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        control: "10px",
        button: "12px",
        card: "20px",
        feature: "24px",
        media: "28px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(45, 31, 20, 0.08)",
        elevated: "0 20px 60px rgba(45, 31, 20, 0.14)",
        glow: "0 20px 70px rgba(242, 169, 59, 0.12)",
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        gutter: "20px",
        "gutter-md": "32px",
        "gutter-lg": "48px",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.22, 1, 0.36, 1)",
        enter: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.7, 0, 0.84, 0)",
        micro: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
