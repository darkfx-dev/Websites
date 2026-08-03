"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useMagneticOffset } from "@/hooks/use-magnetic-offset";
import { useSupportsPointerEffects } from "@/hooks/use-pointer-capabilities";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/**
 * Wraps a single CTA (an <a> or <button> passed as the only child) with a
 * restrained magnetic pull + lift. Used on at most two high-intent CTAs.
 * Framer Motion owns the transform; the child keeps its own CSS hover/focus.
 * Disabled (renders the child untouched) on touch/coarse pointers and reduced
 * motion, and never travels far enough to evade the pointer (≤4px).
 */
export function MagneticButton({
  children,
  className,
}: {
  children: React.ReactElement;
  className?: string;
}) {
  const supports = useSupportsPointerEffects();
  const reduced = useReducedMotionPreference();
  const { x, y, onPointerMove, onPointerLeave } = useMagneticOffset({ max: 4 });

  if (!supports || reduced) {
    return children;
  }

  return (
    <motion.span
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ x, y, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
