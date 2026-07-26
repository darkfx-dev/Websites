"use client";

import { useContext, useEffect, useState } from "react";
import { ReducedMotionContext } from "@/components/motion/reduced-motion-provider";

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Reads the shared value from `ReducedMotionProvider` when there is one, so
 * the page keeps a single `matchMedia` listener rather than one per animated
 * component. Falls back to its own listener otherwise — a component rendered
 * outside the provider still gets the right answer, it just pays for it.
 *
 * Every consumer treats `true` as "render the final state, skip the travel".
 */
export function useReducedMotionPreference(): boolean {
  const shared = useContext(ReducedMotionContext);
  const [local, setLocal] = useState(false);
  const standalone = shared === null;

  useEffect(() => {
    if (!standalone) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setLocal(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setLocal(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [standalone]);

  return shared ?? local;
}
