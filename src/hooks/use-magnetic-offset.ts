"use client";

import * as React from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";

/**
 * Shared pointer-follow math for the magnetic-button effect. Returns spring-
 * damped x/y motion values that track the pointer toward the element's centre,
 * capped at `max` px so a control never travels far enough to evade the pointer.
 * The caller applies these to a transform and calls the handlers on the element.
 */
export function useMagneticOffset({
  strength = 0.35,
  max = 4,
}: { strength?: number; max?: number } = {}): {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
} {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 300, damping: 22, mass: 0.5 });

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      const clamp = (v: number) => Math.max(-max, Math.min(max, v));
      rawX.set(clamp(dx));
      rawY.set(clamp(dy));
    },
    [strength, max, rawX, rawY]
  );

  const onPointerLeave = React.useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { x, y, onPointerMove, onPointerLeave };
}
