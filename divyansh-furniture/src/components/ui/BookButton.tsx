"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * The booking button. Every "book" action on the site is this component.
 *
 * Ownership is split cleanly: CSS owns colour, border and shadow; Framer
 * Motion owns scale. Nothing is animated from both sides.
 *
 * When the WhatsApp number is still a placeholder it renders as a disabled
 * control with a visible explanation rather than a link, so nobody — visitor
 * or owner — discovers the gap by clicking into a broken tab.
 */
export function BookButton({
  message,
  children,
  variant = "primary",
  className,
  fullWidth = false,
}: {
  /** Prefilled opening message. */
  message: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  fullWidth?: boolean;
}) {
  const reduced = useReducedMotion();
  const href = whatsappUrl(message);

  const classes = cn(
    "btn",
    variant === "primary" ? "btn-primary" : "btn-ghost",
    fullWidth && "w-full",
    className
  );

  const motionProps = reduced
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (!href) {
    return (
      <span
        className={classes}
        aria-disabled="true"
        title="Add the WhatsApp number in src/data/site.ts to enable booking"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {children}
        <span className="sr-only">
          {" "}
          — unavailable until the WhatsApp number is added to the site
          configuration
        </span>
      </span>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      {...motionProps}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {children}
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </motion.a>
  );
}
