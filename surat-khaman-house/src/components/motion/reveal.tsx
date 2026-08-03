"use client";

import { m, useReducedMotion } from "motion/react";

import { revealVariants } from "@/lib/motion";

/**
 * One-shot section reveal: ≤20px rise, fires once, and deliberately does not
 * stagger its children — the brief allows a stagger only in the hero.
 *
 * Under reduced motion the wrapper renders a plain element with no variants
 * and no initial hidden state, so content is simply present. Note that the
 * content is in the server-rendered HTML either way; only the transition is
 * conditional, so nothing here can hide text if JavaScript fails.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const reduced = useReducedMotion();

  const MotionTag = Tag === "section" ? m.section : Tag === "li" ? m.li : m.div;

  if (reduced) {
    const PlainTag = Tag;
    return <PlainTag className={className}>{children}</PlainTag>;
  }

  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
