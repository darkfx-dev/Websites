"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "li" | "article" | "p" | "span";

/**
 * Scroll reveal.
 *
 * The animation lives in CSS and is gated on `html.js`, so with JavaScript
 * off — or if this never hydrates — the content is simply visible. Nothing
 * can be permanently hidden by an animation that did not run.
 *
 * Each element is observed once and then unobserved, so there is no
 * long-lived observer work for content the visitor has already passed.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 20,
  id,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  /** Travel distance in pixels; 0 gives a pure fade. */
  y?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // `as` is deliberately open so callers can pick the right semantic
  // element. TypeScript cannot reduce a union of element tags to a single
  // prop shape, so the tag is narrowed once here rather than at every call
  // site. Routed through `unknown` because a tag name and a component type
  // do not overlap structurally.
  const Element = Tag as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    id?: string;
  }>;

  return (
    <Element
      ref={ref}
      id={id}
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Element>
  );
}
