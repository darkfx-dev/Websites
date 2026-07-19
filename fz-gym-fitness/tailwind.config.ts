import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#07090B",
        surface: "#11151A",
        lime: "#B7FF00",
        cyan: "#00E5FF",
        redx: "#FF3045",
        ink: "#F7F9FC",
        muted: "#AAB2BD",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-lime":
          "0 0 20px rgba(183,255,0,0.35), 0 0 40px rgba(183,255,0,0.15)",
        "neon-cyan":
          "0 0 20px rgba(0,229,255,0.35), 0 0 40px rgba(0,229,255,0.15)",
        "neon-red":
          "0 0 20px rgba(255,48,69,0.35), 0 0 40px rgba(255,48,69,0.15)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(183,255,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(183,255,0,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
