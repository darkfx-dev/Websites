"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal primitives that DEGRADE SAFELY.
 *
 * The hidden pre-animation state lives entirely in CSS behind an `html.js`
 * guard (see globals.css) that is only added once JavaScript runs. So with JS
 * disabled — or if hydration fails — every element renders fully visible, and
 * no essential content is ever hidden waiting on animation. Reduced-motion is
 * also handled in CSS. This is lighter on low-end devices than animating each
 * element with a JS animation library.
 */

/** Observe an element and flip to `true` the first time it enters the viewport. */
function useInView<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    // Fallback: if IntersectionObserver is unavailable, reveal immediately.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return [ref, inView];
}

type Tag = "div" | "section" | "li" | "span" | "ul";

/** Single fade-and-rise reveal. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: Tag;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  const Component = as as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={
        {
          transitionDelay: `${delay}s`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Component>
  );
}

/** Container that staggers its <RevealItem> children into view once. */
export function RevealStagger({
  children,
  className,
  interval = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  interval?: number;
  as?: "div" | "ul";
}) {
  const [ref, inView] = useInView<HTMLElement>();
  const Component = as as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cn("reveal-group", inView && "is-visible", className)}
    >
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;
        const el = child as React.ReactElement<{ style?: React.CSSProperties }>;
        return React.cloneElement(el, {
          style: {
            transitionDelay: `${i * interval}s`,
            ...(el.props.style ?? {}),
          },
        });
      })}
    </Component>
  );
}

/** Child of <RevealStagger>. The container drives its reveal timing. */
export function RevealItem({
  children,
  className,
  as = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
  style?: React.CSSProperties;
}) {
  const Component = as as React.ElementType;
  return (
    <Component className={cn("reveal-child", className)} style={style}>
      {children}
    </Component>
  );
}
