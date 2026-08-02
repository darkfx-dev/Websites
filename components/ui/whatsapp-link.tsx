"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { actionClasses, type ActionSize, type ActionVariant } from "@/components/ui/action-link";
import { MessageIcon } from "@/components/ui/icons";

/**
 * 081 — WhatsApp CTA acknowledgement.
 *
 * The label flips to "Opening WhatsApp…" for 700ms on activation. The click
 * is never intercepted: no `preventDefault`, no programmatic navigation, so
 * the link still works with JavaScript disabled and the acknowledgement is
 * purely additive feedback.
 */
export function WhatsAppLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  size?: ActionSize;
  className?: string;
}) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={actionClasses(variant, size, className)}
      onClick={() => {
        setOpening(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpening(false), 700);
      }}
    >
      <MessageIcon />
      <span>{opening ? "Opening WhatsApp…" : children}</span>
      <span className="sr-only"> (opens WhatsApp)</span>
    </a>
  );
}
