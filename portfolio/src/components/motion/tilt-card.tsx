"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { clamp } from "@/lib/utils";

const MAX_TILT = 4; // degrees — enough to read as depth, not enough to distort

/**
 * A restrained pointer-tracked tilt.
 *
 * Not rendered at all — rather than rendered and disabled — unless the device
 * has a precise, hover-capable pointer and the visitor has not asked for
 * reduced motion. Touch devices therefore pay none of its cost, and the tilt
 * can never intercept a tap.
 *
 * The rotation is deliberately small and spring-damped. The card is a frame
 * around real screenshots; if the tilt is noticeable enough to comment on, it
 * is competing with the thing it is meant to present.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { finePointer, ready } = usePerformanceMode();
  const reduced = useReducedMotionPreference();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 240, damping: 28, mass: 0.7 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [-1, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [-1, 1], [MAX_TILT, -MAX_TILT]);

  if (!ready || !finePointer || reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} style={{ perspective: 1100 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          // Ignore anything that is not a real mouse/trackpad pointer, so a
          // stylus or an emulated touch pointer never starts the effect.
          if (e.pointerType !== "mouse") return;
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          px.set(clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5) * 2);
          py.set(clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5) * 2);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
