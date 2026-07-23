import { m } from "framer-motion";
import type { ReactNode } from "react";
import { sectionReveal, viewportOnce } from "../motion/variants";

/* Reveals its children once as they scroll into view. Under reduced motion,
   MotionConfig neutralises the transform so content simply appears. */
export function SectionReveal({
  children,
  className,
  as = "div",
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  ariaLabel?: string;
}) {
  const Comp = as === "section" ? m.section : m.div;
  return (
    <Comp
      id={id}
      aria-label={ariaLabel}
      className={className}
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Comp>
  );
}
