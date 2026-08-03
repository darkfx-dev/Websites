import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    /*
     * No manual chunking here, deliberately.
     *
     * An earlier version pulled `three` and `@react-three` into a named
     * chunk, which reads like an optimisation and is the opposite of one: a
     * named chunk joins the entry graph, Vite emits a `modulepreload` for it,
     * and ~900 kB that was supposed to arrive only when the scene mounts is
     * downloaded on first paint instead. Left alone, the bundler keeps all of
     * it inside the dynamically imported scene chunk, which is the point.
     *
     * That chunk is over the default warning size and is expected to be —
     * three.js is most of it, it is deferred, and the page is fully readable
     * before it arrives. The limit is raised so the warning stays meaningful
     * rather than firing on every build.
     */
    chunkSizeWarningLimit: 1000,
  },
});
