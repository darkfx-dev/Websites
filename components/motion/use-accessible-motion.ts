"use client";

import { useReducedMotion } from "motion/react";

/**
 * 111 — global reduced-motion adapter.
 *
 * Variant factories in `lib/motion.ts` take the boolean this returns and
 * collapse their transitions to an instant state change. It complements
 * `MotionConfig reducedMotion="user"` in the provider, which already strips
 * the transform half of every animation; this covers the parts Framer cannot
 * infer, such as the FAQ panel height and the star fill.
 */
export function useAccessibleMotion(): boolean {
  return useReducedMotion() ?? false;
}
