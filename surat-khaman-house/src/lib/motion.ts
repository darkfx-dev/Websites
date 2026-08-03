/**
 * Shared motion vocabulary. Every animation on the site draws its duration,
 * easing and spring from here, which is what keeps the total number of
 * visible motion patterns down to the seven the brief allows.
 *
 * Ceilings that go with these tokens, applied at each call site: hero
 * entrance ≤18px travel, section reveal ≤20px, menu-row interaction ≤2px and
 * ≤1°, hero tilt ≤3° with ≤5px pointer travel, CTA icon ≤3px.
 */
export const motionTokens = {
  duration: {
    press: 0.08,
    fast: 0.16,
    base: 0.22,
    panel: 0.28,
    reveal: 0.52,
    hero: 0.62,
  },
  ease: {
    standard: [0.22, 1, 0.36, 1],
    enter: [0.16, 1, 0.3, 1],
    exit: [0.4, 0, 1, 1],
  },
  spring: {
    ui: { stiffness: 360, damping: 30, mass: 0.7 },
    gentle: { stiffness: 220, damping: 26, mass: 0.9 },
  },
} as const;

/** Entrance used by the hero: 60ms stagger, ≤18px rise. */
export const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.hero,
      ease: motionTokens.ease.standard,
    },
  },
};

/** Section reveal: fires once, ≤20px, no per-child stagger. */
export const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.reveal,
      ease: motionTokens.ease.standard,
    },
  },
};
