"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * `domAnimation` keeps the animation bundle small — no layout projection or
 * drag is needed anywhere on this site. `strict` makes any accidental use of
 * the full `motion.*` components throw during development, which is what
 * keeps the bundle that size.
 *
 * `reducedMotion="user"` is the site-wide safeguard: for visitors who ask for
 * reduced motion, Framer Motion drops transform and layout animations and
 * keeps only opacity.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
