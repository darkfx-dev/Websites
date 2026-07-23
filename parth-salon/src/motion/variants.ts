/* Reusable Framer Motion variants, all built from the canonical motionTokens
   so the whole site shares one rhythm. */
import type { Variants } from "framer-motion";
import { motionTokens } from "./tokens";

// Heritage easing from the brief: cubic-bezier(0.22, 1, 0.36, 1)
export const easeHeritage = motionTokens.easing.entrance;

export const duration = {
  micro: motionTokens.duration.instant, // 0.12
  nav: motionTokens.duration.fast, // 0.2
  reveal: motionTokens.duration.reveal, // 0.68
  heroStep: motionTokens.duration.standard, // 0.46
  step: 0.22, // enquiry step transition
};

/** Gentle upward reveal for in-view sections. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.reveal, ease: easeHeritage },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.reveal } },
};

/** Stagger container for grouped children (hero lines, hours rows). */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.heroStep, ease: easeHeritage },
  },
};

/** Reveal for the confirmed interior photograph. Transform + opacity only
   (fully supported by the domAnimation bundle) inside an overflow-hidden
   frame, so the image settles from a slight zoom — the brief's
   scale(1.035) → scale(1). No clipPath (that bundle leaves it unanimated). */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: easeHeritage },
  },
};

/** Mobile menu panel slide. */
export const menuPanel: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.nav, ease: easeHeritage } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeHeritage } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
