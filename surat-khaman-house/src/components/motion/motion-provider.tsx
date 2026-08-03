"use client";

import { domAnimation, LazyMotion } from "motion/react";

/**
 * Loads only Framer Motion's DOM animation feature set, rather than the full
 * bundle, and does it once for the whole page.
 *
 * `strict` makes the `motion.*` shorthand throw, which is the point: it forces
 * every animated element in this project to use `m.*` and therefore stay
 * inside the lazily-loaded feature set.
 *
 * `children` is a plain slot, so everything passed through from the server
 * stays a Server Component — this provider does not pull the page client-side.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
