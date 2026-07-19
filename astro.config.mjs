// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Set SITE_URL (e.g. in the host's environment settings) once the school has a
// real domain. Canonical URLs, sitemap and robots rules depend on it; until
// then the site builds without absolute URLs rather than inventing a domain.
const SITE_URL = process.env.SITE_URL;

export default defineConfig({
  ...(SITE_URL ? { site: SITE_URL } : {}),
  integrations: [react()],
  build: {
    inlineStylesheets: "auto",
  },
});
