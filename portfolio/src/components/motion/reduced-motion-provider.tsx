"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";

/**
 * `null` means "no provider above me" — consumers then fall back to their own
 * media query listener, so a component still behaves correctly if it is ever
 * rendered outside the tree.
 */
export const ReducedMotionContext = createContext<boolean | null>(null);

/**
 * Reads `prefers-reduced-motion` once for the whole page.
 *
 * Every animated component needs this answer. Without a provider each one
 * registers its own `matchMedia` listener, which is a dozen listeners all
 * computing the same boolean and all re-rendering separately when it changes.
 *
 * It starts `false` so the server HTML and the first client render agree, then
 * corrects itself immediately after mount. That direction is deliberate: the
 * CSS `prefers-reduced-motion` block in `globals.css` already neutralises
 * transitions for the frames before this resolves, so the brief window cannot
 * produce motion for someone who asked not to see it.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
