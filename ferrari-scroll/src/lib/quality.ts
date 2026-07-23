/* Decides how much the device should render. Drives the WebGL/static split and
   DPR. Required by the perf + a11y spec (WebGL detection, reduced motion,
   Save-Data, adaptive quality, static fallback). */
export type Tier = "full" | "lite" | "static";

export interface Quality {
  tier: Tier;
  reducedMotion: boolean;
  pointerFine: boolean;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function detectQuality(): Quality {
  if (typeof window === "undefined") {
    return { tier: "static", reducedMotion: true, pointerFine: false };
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerFine = window.matchMedia("(pointer: fine)").matches;
  const saveData =
    (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;

  // Reduced motion, Save-Data, or no WebGL → the static, fully-readable path.
  if (reducedMotion || saveData || !hasWebGL()) {
    return { tier: "static", reducedMotion, pointerFine };
  }
  const weak =
    (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 768;
  return { tier: weak ? "lite" : "full", reducedMotion, pointerFine };
}
