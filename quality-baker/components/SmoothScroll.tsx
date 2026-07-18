"use client";

import { useEffect } from "react";
import { useMotionTier } from "@/lib/motion";

/**
 * Lenis smooth scroll — full tier only, dynamically imported so it never
 * touches the initial bundle. On lite/static tiers native scrolling is left
 * completely alone (that includes keyboard, screen readers, and find-in-page).
 */
export default function SmoothScroll() {
  const tier = useMotionTier();

  useEffect(() => {
    if (tier !== "full") return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.1,
        anchors: true,
      });

      // One rAF loop: GSAP's ticker drives Lenis, Lenis updates ScrollTrigger.
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [tier]);

  return null;
}
