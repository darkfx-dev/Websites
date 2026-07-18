"use client";

import { useEffect, useRef } from "react";
import { useMotionTier } from "@/lib/motion";

/**
 * Signature animation #2: chocolate drip section divider.
 *
 * A static SVG drip line always renders (so the shape survives every tier);
 * on the full tier the drips "melt" a few pixels downward as the divider
 * scrolls into view — a scrubbed, transform-only nudge, nothing layout.
 *
 * `from` is the colour of the section above (the chocolate that drips down
 * onto the section below).
 */
export function DripDivider({ from }: { from: "noir" | "cream" }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    if (tier !== "full") return;
    const el = ref.current;
    if (!el) return;
    const drips = el.querySelector<SVGGElement>(".drips");
    if (!drips) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.fromTo(
          drips,
          { y: -7 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 45%",
              scrub: 0.8,
            },
          }
        );
      }, el);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [tier]);

  const color = from === "noir" ? "#1a120b" : "#fdf8f0";
  const bg = from === "noir" ? "bg-cream" : "bg-noir";

  return (
    <div ref={ref} aria-hidden className={`${bg} overflow-hidden leading-none`}>
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="block h-8 w-full sm:h-10"
      >
        {/* Solid band the drips hang from */}
        <rect x="0" y="-2" width="1200" height="8" fill={color} />
        <g className="drips" fill={color}>
          <path d="M0 6h1200v6c-30 0-45 14-75 14s-38-12-72-12-46 8-82 8-40-16-78-16-52 10-90 10-44-6-80-6-50 12-88 12-42-14-80-14-48 6-86 6-40-10-76-10-52 16-90 16-46-8-84-8-44 4-79 4-41-6-60-6z" />
          {/* A few long drips with round tips */}
          <circle cx="150" cy="30" r="5" />
          <path d="M145 12h10v18h-10z" />
          <circle cx="520" cy="34" r="5" />
          <path d="M515 12h10v22h-10z" />
          <circle cx="905" cy="28" r="5" />
          <path d="M900 12h10v16h-10z" />
        </g>
      </svg>
    </div>
  );
}
