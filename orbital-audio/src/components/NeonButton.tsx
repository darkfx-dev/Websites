import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The one button on the page.
 *
 * Ownership is split on purpose and along a clean line: CSS owns colour,
 * border and the layered glow; Framer Motion owns scale. Nothing is animated
 * from both sides.
 *
 * The glow is a lamp filament seen through a diffuser — four stacked shadows
 * of increasing radius and decreasing alpha, all the same hue. A single large
 * shadow reads as a blurred rectangle; the stack reads as light.
 *
 * Focus is deliberately *not* the hover glow. Keyboard users get the phosphor
 * ring, which is a different hue and a different shape, so "focused" is never
 * ambiguous with "hovered" — including for someone using both.
 */
export function NeonButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
}) {
  const reduced = useReducedMotion();

  const className = `neon neon--${variant} neon--${size}`;

  // Under reduced motion the states still change — they just arrive instead
  // of animating. The glow itself is static CSS, so nothing is lost visually.
  const motionProps = reduced
    ? {}
    : {
        whileHover: { scale: 1.025 },
        whileTap: { scale: 0.975 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (href) {
    return (
      <motion.a href={href} className={className} {...motionProps}>
        <span className="neon__label">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      {...motionProps}
    >
      <span className="neon__label">{children}</span>
    </motion.button>
  );
}
