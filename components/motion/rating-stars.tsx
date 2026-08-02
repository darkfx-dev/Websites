"use client";

import { m } from "motion/react";

import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { outlet } from "@/data/outlet";
import { duration, ease, revealViewport } from "@/lib/motion";

const STAR_PATH =
  "M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.44l-5.8 3.06 1.1-6.47-4.7-4.58 6.5-.95z";

function StarRow({ variant }: { variant: "outline" | "filled" }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <svg key={index} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d={STAR_PATH}
            fill={variant === "filled" ? "var(--color-copper)" : "none"}
            stroke="var(--color-copper)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

/**
 * 105 — rating star fill.
 *
 * The numeric value is always present as text, and the whole group carries a
 * single accessible label, so the animation never carries meaning on its own.
 *
 * Documented exception to the transform-only budget (rule 112): this animates
 * `clip-path`. It runs once, for 450ms, over five inline SVGs. A `scaleX`
 * alternative would need an inverse scale on the contents to avoid distorting
 * the star shapes, which cannot start from zero.
 */
export function RatingStars() {
  const reduced = useAccessibleMotion();
  const fraction = outlet.rating.value / outlet.rating.best;
  const remainder = `${(100 - fraction * 100).toFixed(2)}%`;

  return (
    <div
      role="img"
      aria-label={`${outlet.rating.value} out of ${outlet.rating.best} ${outlet.rating.source} rating, last checked ${outlet.rating.lastChecked}`}
      className="relative inline-flex"
    >
      <StarRow variant="outline" />
      <m.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: `inset(0 ${remainder} 0 0)` }}
        viewport={revealViewport}
        transition={
          reduced
            ? { duration: duration.instant }
            : { duration: 0.45, ease: ease.standard }
        }
      >
        <StarRow variant="filled" />
      </m.div>
    </div>
  );
}
