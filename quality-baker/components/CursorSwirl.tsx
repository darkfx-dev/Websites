"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { useMotionTier } from "@/lib/motion";

const noopSubscribe = () => () => {};
const finePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Signature animation #4: a small caramel swirl that trails the cursor over
 * the ordering section. Desktop + full tier only; springs give it the soft
 * lag of a whisk through cream. Fixed-position, pointer-events none, never
 * covers content meaningfully.
 */
export function CursorSwirl({
  areaRef,
}: {
  areaRef: RefObject<HTMLElement | null>;
}) {
  const tier = useMotionTier();
  const [active, setActive] = useState(false);
  const canHover = useSyncExternalStore(noopSubscribe, finePointer, () => false);
  const enabled = tier === "full" && canHover;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 120, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 16, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const area = areaRef.current;
    if (!area) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX + 18);
      y.set(e.clientY + 18);
    };
    const enter = () => setActive(true);
    const leave = () => setActive(false);

    area.addEventListener("pointermove", move, { passive: true });
    area.addEventListener("pointerenter", enter);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerenter", enter);
      area.removeEventListener("pointerleave", leave);
    };
  }, [enabled, areaRef, x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30"
      style={{ x: sx, y: sy, opacity: active ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path
          d="M13 4c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 3.5-7 7-7 6 2.5 6 6-2.5 5-5 5-4-1.7-4-4 1.5-3 3-3"
          stroke="#a66a3f"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </m.div>
  );
}
