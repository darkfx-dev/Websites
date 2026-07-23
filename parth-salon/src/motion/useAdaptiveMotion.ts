import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

/* Capability signals that gate optional motion (pointer parallax, scroll-linked
   effects). Reduced motion always wins. */
function subscribe(cb: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useAdaptiveMotion() {
  const reduced = useReducedMotion() ?? false;
  const finePointer = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
  return {
    reduced,
    finePointer,
    /** enable pointer/scroll parallax only on capable, motion-OK devices */
    allowParallax: !reduced && finePointer,
  };
}
