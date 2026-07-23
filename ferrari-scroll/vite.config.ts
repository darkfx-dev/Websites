import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Set VITE_BASE (e.g. "/ferrari-scroll/") only for sub-path hosting.
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  // The three.js/R3F scene is intentionally large but lazy-loaded behind the
  // static poster — the page is interactive before it arrives.
  build: { chunkSizeWarningLimit: 950 },
});
