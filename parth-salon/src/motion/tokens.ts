/* Canonical motion tokens — one source for every duration, distance, easing
   and spring on the site. variants.ts and components read from here so the
   whole experience moves with one rhythm. */
import type { Transition } from "framer-motion";

export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.2,
    standard: 0.46,
    reveal: 0.68,
    cinematic: 0.9,
  },
  distance: { xs: 6, sm: 12, md: 20, lg: 32, xl: 48 },
  easing: {
    entrance: [0.22, 1, 0.36, 1] as Transition["ease"],
    exit: [0.4, 0, 1, 1] as Transition["ease"],
    standard: [0.4, 0, 0.2, 1] as Transition["ease"],
  },
  spring: {
    gentle: { stiffness: 170, damping: 24, mass: 0.8 },
    tactile: { stiffness: 380, damping: 30, mass: 0.6 },
  },
} as const;
