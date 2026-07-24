"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { useSupportsPointerEffects } from "@/hooks/use-pointer-capabilities";

/**
 * GSAP-owned hero entrance + restrained pointer parallax, wrapping the static
 * `HeroArtwork` SVG (passed as children). The SVG is server-rendered by the
 * parent, so it is visible from first paint regardless of this wrapper — this
 * only layers motion on top.
 *
 * Ownership: GSAP owns every transform here (scene scale/translate, steam
 * draw-on). It never touches the headline/copy, which keep their independent
 * CSS reveals — so GSAP and the CSS reveal system never fight over an element.
 *
 * Reduced motion: no GSAP context is created at all; children render in their
 * final static pose. Parallax: desktop + fine-pointer + hover only.
 */
export default function HeroChoreography({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  const supportsPointer = useSupportsPointerEffects();

  // Entrance timeline (transforms + opacity only).
  React.useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const scene = root.querySelector<SVGGElement>('[data-gsap="scene"]');
      const steamPaths = gsap.utils.toArray<SVGPathElement>(
        '[data-gsap="steam"] path'
      );

      // Prepare steam paths for a draw-on reveal.
      steamPaths.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (scene) {
        tl.from(scene, {
          scale: 0.92,
          opacity: 0,
          transformOrigin: "50% 55%",
          duration: 0.7,
          ease: "back.out(1.2)",
        });
      }
      if (steamPaths.length) {
        tl.to(
          steamPaths,
          { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 },
          "-=0.25"
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  // Restrained pointer parallax — desktop pointer devices only.
  React.useEffect(() => {
    if (reduced || !supportsPointer) return;
    const root = rootRef.current;
    if (!root) return;
    const scene = root.querySelector<SVGGElement>('[data-gsap="scene"]');
    const steam = root.querySelector<SVGGElement>('[data-gsap="steam"]');
    if (!scene) return;

    const xTo = gsap.quickTo(scene, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(scene, "y", { duration: 0.6, ease: "power3" });
    const xToSteam = steam
      ? gsap.quickTo(steam, "x", { duration: 0.8, ease: "power3" })
      : null;

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5..0.5
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      xTo(nx * 16);
      yTo(ny * 16);
      xToSteam?.(nx * 22);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      xToSteam?.(0);
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, supportsPointer]);

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[440px]">
      {children}
    </div>
  );
}
