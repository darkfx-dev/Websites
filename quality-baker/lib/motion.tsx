"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Animation capability tiers — decided once, on the client, and consumed by
 * every animated component:
 *
 *   "full"   — capable device: Lenis smooth scroll, GSAP pinned/scrubbed
 *              sequences, parallax, staggered reveals.
 *   "lite"   — low-end device or constrained connection: gentle fades only,
 *              no smooth-scroll hijacking, no pinning, no scrub.
 *   "static" — prefers-reduced-motion: no scroll-driven movement at all.
 *
 * The server renders everything fully visible; tiers only ever *add* motion.
 * A calmer site is the correct degradation — a janky one never is.
 */
export type MotionTier = "full" | "lite" | "static";

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

function detectTier(): MotionTier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }
  const nav = navigator as Navigator & { connection?: NetworkInformation };
  const conn = nav.connection;
  const slowNetwork =
    conn?.saveData === true ||
    (conn?.effectiveType !== undefined &&
      ["slow-2g", "2g", "3g"].includes(conn.effectiveType));
  const weakCpu =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  const weakMemory =
    "deviceMemory" in navigator &&
    (navigator as { deviceMemory?: number }).deviceMemory !== undefined &&
    (navigator as { deviceMemory?: number }).deviceMemory! <= 4;

  if (slowNetwork || weakCpu || weakMemory) return "lite";
  return "full";
}

const MotionTierContext = createContext<MotionTier | null>(null);

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function MotionTierProvider({ children }: { children: ReactNode }) {
  // Server snapshot is null → components render their static, fully-visible
  // form during SSR and hydration, then enhance once the tier is known.
  const tier = useSyncExternalStore(subscribe, detectTier, () => null);

  return (
    <MotionTierContext.Provider value={tier}>
      {children}
    </MotionTierContext.Provider>
  );
}

/** null means "not yet known" — treat as no animation. */
export function useMotionTier(): MotionTier | null {
  return useContext(MotionTierContext);
}

/** Shared easing, matching the CSS custom properties in globals.css. */
export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;
