"use client";

import * as React from "react";

/**
 * SSR-safe `prefers-reduced-motion` hook. Returns `false` on the server and on
 * first client render (so markup matches), then updates to the real value after
 * mount and whenever the OS preference changes. Callers use it to skip building
 * motion (GSAP timelines, pointer listeners) entirely rather than animating.
 */
export function useReducedMotionPreference(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
