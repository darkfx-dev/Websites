/* Shared motion tokens + Framer Motion variants.
   All animation timing lives here — components never hard-code values. */
import type { Variants, Transition } from "framer-motion";

export const dur = {
  micro: 0.18, // hover/press feedback
  ui: 0.36, // standard UI transitions (menu, accordion)
  reveal: 0.6, // section reveals
  hero: 0.9, // hero entrance sequencing
};

export const easeOut: Transition["ease"] = [0.32, 0.72, 0, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.reveal, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.reveal, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const navReveal: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.ui, ease: easeOut },
  },
};

/* Viewport config for whileInView reveals — trigger once, slightly early */
export const viewportOnce = { once: true, amount: 0.25 } as const;
