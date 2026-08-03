"use client";

import * as React from "react";

export type PointerCapabilities = {
  /** Device has a hover-capable primary pointer (mouse/trackpad, not touch). */
  hoverHover: boolean;
  /** Primary pointer is fine/precise (not coarse touch). */
  pointerFine: boolean;
  /** Viewport is at least desktop width (≥1024px). */
  isDesktopWidth: boolean;
};

const QUERIES = {
  hoverHover: "(hover: hover)",
  pointerFine: "(pointer: fine)",
  isDesktopWidth: "(min-width: 1024px)",
} as const;

/**
 * Detects whether pointer-precise, hover-capable, desktop-width interaction is
 * available — the gate for tilt/parallax/magnetic effects. SSR-safe: everything
 * is `false` until mount, so touch devices never momentarily mount an effect.
 * A hybrid device only passes when ALL relevant conditions hold, erring toward
 * disabling an enhancement rather than running it where it doesn't belong.
 */
export function usePointerCapabilities(): PointerCapabilities {
  const [caps, setCaps] = React.useState<PointerCapabilities>({
    hoverHover: false,
    pointerFine: false,
    isDesktopWidth: false,
  });

  React.useEffect(() => {
    const entries = Object.entries(QUERIES) as [
      keyof PointerCapabilities,
      string,
    ][];
    const mqls = entries.map(([key, query]) => {
      const mql = window.matchMedia(query);
      return { key, mql };
    });

    const update = () => {
      setCaps((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const { key, mql } of mqls) {
          if (next[key] !== mql.matches) {
            next[key] = mql.matches;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    update();
    mqls.forEach(({ mql }) => mql.addEventListener("change", update));
    return () =>
      mqls.forEach(({ mql }) => mql.removeEventListener("change", update));
  }, []);

  return caps;
}

/** Convenience: all three capabilities present — the enhancement gate. */
export function useSupportsPointerEffects(): boolean {
  const { hoverHover, pointerFine, isDesktopWidth } = usePointerCapabilities();
  return hoverHover && pointerFine && isDesktopWidth;
}
