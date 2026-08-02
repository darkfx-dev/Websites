import type { Transition, Variants } from "motion/react";

/**
 * Motion tokens. Values are seconds, to match Framer Motion.
 *
 * Rules encoded here: no ordinary UI response exceeds 300ms, no entrance
 * sequence delays the primary CTA past 500ms, and no reveal sequence runs
 * longer than 900ms in total.
 *
 * Ownership (rule 119): Framer Motion owns scroll reveals, the navbar
 * entrance, the sticky bar, menu card presence, the FAQ panel and the star
 * fill. CSS owns the hero entrance, the hero underline and the menu card
 * hover lift. No element is written by both.
 */
export const duration = {
  instant: 0.001,
  press: 0.08,
  fast: 0.16,
  base: 0.22,
  panel: 0.28,
  reveal: 0.52,
  hero: 0.6,
} as const;

export const ease = {
  /** Standard entrance. */
  standard: [0.22, 1, 0.36, 1],
  /** Gentle entrance for larger surfaces. */
  gentle: [0.16, 1, 0.3, 1],
  /** Standard exit. */
  exit: [0.4, 0, 1, 1],
} as const;

export const stagger = {
  base: 0.055,
  dense: 0.035,
  headline: 0.07,
  maxInitialDelay: 0.16,
} as const;

export const springs = {
  press: { type: "spring", stiffness: 500, damping: 35, mass: 0.4 },
  ui: { type: "spring", stiffness: 360, damping: 30, mass: 0.7 },
  gentle: { type: "spring", stiffness: 220, damping: 26, mass: 0.9 },
} as const satisfies Record<string, Transition>;

/** Travel distances, capped by the physics limits in the brief. */
export const distance = {
  /** Section reveal travel: 16–24px. */
  reveal: 24,
  /** Sticky bar travel. */
  sticky: 12,
  /** Navbar entrance travel. */
  nav: 8,
} as const;

/**
 * Hidden states are intentionally identical whether or not the user prefers
 * reduced motion, so server and client render the same markup. The provider
 * sets `MotionConfig reducedMotion="user"`, which drops the transform half of
 * these animations for users who opted out; the `reduced` branches below then
 * collapse the remaining opacity change to an imperceptible instant.
 */
type VariantFactory = (reduced: boolean) => Variants;

const timed = (reduced: boolean, seconds: number): Transition =>
  reduced ? { duration: duration.instant } : { duration: seconds, ease: ease.standard };

/** 011 — one-time section reveal. */
export const sectionReveal: VariantFactory = (reduced) => ({
  hidden: { opacity: 0, y: distance.reveal },
  visible: { opacity: 1, y: 0, transition: timed(reduced, 0.56) },
});

/** 011 (child) — staggered items inside an already-revealed section. */
export const revealChildren: VariantFactory = (reduced) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: reduced ? 0 : stagger.base, delayChildren: 0.04 },
  },
});

export const revealChild: VariantFactory = (reduced) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: timed(reduced, duration.reveal) },
});

/** 064 — navbar entrance, once, after first paint. */
export const navbarEntrance: VariantFactory = (reduced) => ({
  hidden: { opacity: 0, y: -distance.nav },
  visible: { opacity: 1, y: 0, transition: timed(reduced, 0.36) },
});

/** 096 — sticky mobile inquiry bar. */
export const stickyBar: VariantFactory = (reduced) => ({
  hidden: { opacity: 0, y: distance.sticky },
  visible: { opacity: 1, y: 0, transition: timed(reduced, duration.base) },
  exit: {
    opacity: 0,
    y: distance.sticky,
    transition: reduced
      ? { duration: duration.instant }
      : { duration: duration.fast, ease: ease.exit },
  },
});

/** 105 — rating star fill, once. `custom` carries the 0–1 fill fraction. */
export const starFill: VariantFactory = (reduced) => ({
  hidden: { scaleX: 0 },
  visible: (target: number) => ({
    scaleX: target,
    transition: timed(reduced, 0.45),
  }),
});

/**
 * 101 — menu category change. Opacity only: CSS owns each card's transform
 * for the hover lift (031), so Framer Motion must never write one here.
 */
export const menuCardPresence: VariantFactory = (reduced) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: reduced ? duration.instant : 0.18 } },
  exit: { opacity: 0, transition: { duration: reduced ? duration.instant : 0.12 } },
});

/** 091 — FAQ disclosure panel. Height is animated once per toggle, never looped. */
export const disclosurePanel = (reduced: boolean) => ({
  variants: {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 },
  } satisfies Variants,
  transition: timed(reduced, duration.base),
});

/** Shared viewport config: reveal once, never re-trigger on scroll back. */
export const revealViewport = { once: true, amount: 0.2 } as const;
