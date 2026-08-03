"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useSupportsPointerEffects } from "@/hooks/use-pointer-capabilities";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { cn } from "@/lib/utils";

/**
 * Restrained pointer-tilt surface (Framer Motion owns these transforms). The
 * parent must supply `perspective`. Caps: rotateX ≤4°, rotateY ≤6°, translateZ
 * ~14px, scale ≤1.025, spring-damped, resets smoothly on leave.
 *
 * Gating: only mounts the interactive version on hover-capable, fine-pointer,
 * desktop-width devices with reduced-motion off. Otherwise renders a plain
 * static surface — touch devices pay zero motion cost.
 */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const supports = useSupportsPointerEffects();
  const reduced = useReducedMotionPreference();
  const enabled = supports && !reduced;

  // Normalized pointer position within the card (0..1), spring-damped.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 240, damping: 28, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 240, damping: 28, mass: 0.6 });

  const rotateX = useTransform(sy, [0, 1], [4, -4]);
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);
  const highlightX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const highlightY = useTransform(sy, [0, 1], ["0%", "100%"]);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.025, z: 14 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className={cn("group relative", className)}
    >
      {children}
      {/* Pointer-relative sheen — decorative, never intercepts pointer events. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 [background:radial-gradient(140px_circle_at_var(--hx)_var(--hy),rgba(255,248,235,0.30),transparent_65%)] group-hover:opacity-100"
        style={
          {
            "--hx": highlightX,
            "--hy": highlightY,
          } as React.CSSProperties
        }
      />
    </motion.div>
  );
}
