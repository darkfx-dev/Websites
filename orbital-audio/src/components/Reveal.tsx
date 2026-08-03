import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The page's entire entrance motion language, defined once.
 *
 * One gesture — fade plus a short rise — at one duration, staggered by one
 * interval. A different effect per section is what makes a page feel assembled
 * from parts rather than designed; the numbers below are the whole
 * specification, and no section is allowed its own.
 *
 * Framer Motion owns this and nothing else. Scroll *position* drives only the
 * 3D scene, through a separate mechanism, so no property is animated twice.
 */
const DURATION = 0.5; // 500ms — the middle of the specified 400–600ms
const STAGGER = 0.08; // 80ms — the middle of the specified 60–100ms
const EASE = [0.22, 1, 0.36, 1] as const;

const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  // Transform and opacity only, so an entrance can never shift the layout.
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

const VIEWPORT = { once: true, margin: "-10% 0px -10% 0px" } as const;

/**
 * The tags these wrappers can render as.
 *
 * A fixed list rather than an open `ElementType`, because the motion
 * component has to be looked up from a stable reference — building one during
 * render would hand React a new component type on every pass and remount the
 * whole subtree.
 */
type Tag = "div" | "section" | "ul" | "li" | "ol" | "p" | "h2" | "h3" | "span";

const MOTION = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  ol: motion.ol,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
} as const;

type WrapperProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
};

/**
 * A group whose children arrive in sequence. Children must be `<Item>` for
 * the stagger to reach them.
 */
export function Stagger({ children, as = "div", ...rest }: WrapperProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  const Component = MOTION[as];
  return (
    <Component
      {...rest}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

/** One step of a `Stagger`. */
export function Item({ children, as = "div", ...rest }: WrapperProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  const Component = MOTION[as];
  return (
    <Component {...rest} variants={itemVariants}>
      {children}
    </Component>
  );
}
