"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  /** Travel distance in pixels. `0` gives a pure fade. */
  y?: number;
  /** Masked clip reveal instead of a fade — used for editorial lines. */
  mask?: boolean;
};

/**
 * Scroll reveal.
 *
 * The animation lives in CSS and is gated on `html.js`, so with JavaScript
 * disabled — or if this component never hydrates — the content is simply
 * visible. Nothing can be permanently hidden by a failed animation.
 *
 * Each element is observed once and then unobserved, so there is no
 * long-lived observer work for content the visitor has already passed.
 *
 * The masked variant wraps its children in an inner element and clips *that*,
 * never the element being observed. This is not stylistic: an
 * IntersectionObserver computes the target's visible rect after clipping, so
 * an element clipped to zero height by its own `clip-path` reports an
 * intersection ratio of 0 and never crosses the threshold that would remove
 * the clip. Observing an unclipped host breaks that circle.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 18,
  mask = false,
}: RevealProps) {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // `as` is deliberately open so callers can pick the right semantic element.
  // TypeScript cannot reduce the union of every element type to a single prop
  // shape, so the tag is narrowed once, here, to the props it is actually
  // given — rather than every call site having to work around it.
  const Element = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }>;

  return (
    <Element
      ref={ref}
      className={cn(mask ? "reveal-mask" : "reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {mask ? <span className="reveal-mask-inner">{children}</span> : children}
    </Element>
  );
}
