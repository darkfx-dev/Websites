import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // VITE_BASE is set by the GitHub Pages workflow (e.g. "/Websites/");
  // every other host (Netlify, Vercel, local preview) uses "/".
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    // The three.js scene chunk is intentionally large but lazy-loaded
    // behind a static poster — the page is interactive before it arrives.
    chunkSizeWarningLimit: 950,
  },
})
