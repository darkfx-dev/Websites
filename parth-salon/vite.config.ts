import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { buildStructuredData } from "./src/lib/structuredData.ts";

/* Injects HairSalon JSON-LD (generated from the single config source) into
   index.html at build time, so crawlers see it without executing JS. */
function structuredDataPlugin(): Plugin {
  return {
    name: "inject-structured-data",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: JSON.stringify(buildStructuredData()),
          injectTo: "head",
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Set VITE_BASE (e.g. "/parth-salon/") only if hosting under a sub-path.
  // Netlify/Vercel/Cloudflare Pages serve from "/", the default.
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss(), structuredDataPlugin()],
});
