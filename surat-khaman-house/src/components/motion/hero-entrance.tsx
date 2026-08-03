"use client";

import { m, useReducedMotion } from "motion/react";

import { motionTokens } from "@/lib/motion";

/**
 * One block of the hero entrance: ≤18px rise, 500–600ms, with the stagger
 * expressed as an explicit per-block delay rather than parent variants.
 *
 * Doing it this way keeps the hero copy itself a Server Component — the text
 * arrives in the initial HTML and this wrapper only animates it — whereas
 * variant inheritance would have required every child to be a client motion
 * element.
 */
export function HeroItem({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: motionTokens.duration.hero,
        ease: motionTokens.ease.standard,
        delay: index * 0.06,
      }}
    >
      {children}
    </m.div>
  );
}
