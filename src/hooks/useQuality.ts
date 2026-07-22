import { useSyncExternalStore } from "react";

export type QualityTier = "full" | "lite" | "static";

export interface Quality {
  tier: QualityTier;
  pointerFine: boolean;
  reducedMotion: boolean;
}

/* Decide how much visual work this device should be asked to do.
   - "static": no WebGL at all (reduced motion, Data Saver, no WebGL support)
   - "lite":   WebGL with fewer shards, dpr 1, no pointer tilt (touch/small screens)
   - "full":   the complete experience (fine pointer, capable hardware) */
function computeQuality(): Quality {
  if (typeof window === "undefined") {
    return { tier: "static", pointerFine: false, reducedMotion: false };
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerFine = window.matchMedia("(pointer: fine)").matches;
  const saveData =
    (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;

  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }

  if (reducedMotion || saveData || !webgl) {
    return { tier: "static", pointerFine, reducedMotion };
  }

  const smallScreen = window.innerWidth < 768;
  const weakCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
  if (!pointerFine || smallScreen || weakCpu) {
    return { tier: "lite", pointerFine, reducedMotion };
  }
  return { tier: "full", pointerFine, reducedMotion };
}

let cached = computeQuality();

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1 && typeof window !== "undefined") {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      cached = computeQuality();
      listeners.forEach((l) => l());
    };
    mq.addEventListener("change", onChange);
  }
  return () => listeners.delete(cb);
}

export function useQuality(): Quality {
  return useSyncExternalStore(subscribe, () => cached);
}
