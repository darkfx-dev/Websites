"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { revealChild, revealChildren, revealViewport, sectionReveal } from "@/lib/motion";

/**
 * 011 — reveals its children once, the first time the block is 20% visible.
 *
 * Everything wrapped here is below the fold, so the hidden initial state is
 * never painted where a visitor could see it. Without JavaScript the
 * `[data-reveal]` rule in `app/globals.css`, inside `<noscript>`, forces the
 * final state so no content is gated behind motion (rule 120).
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduced = useAccessibleMotion();
  const Component = m[Tag];

  return (
    <Component
      data-reveal
      className={className}
      variants={sectionReveal(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </Component>
  );
}

/**
 * Staggered variant for short lists. Capped at eight functional items by the
 * caller; anything beyond that must render immediately.
 */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useAccessibleMotion();

  return (
    <m.div
      data-reveal
      className={className}
      variants={revealChildren(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useAccessibleMotion();

  return (
    <m.div data-reveal className={className} variants={revealChild(reduced)}>
      {children}
    </m.div>
  );
}
