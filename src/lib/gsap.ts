/**
 * Single, controlled GSAP + ScrollTrigger registration point. Every client
 * component that needs GSAP imports `gsap`/`ScrollTrigger` from here, so the
 * plugin is registered exactly once. Registration is guarded to the browser.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
