"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/**
 * Scroll-linked 3D transition for a whole section: the section tilts back in
 * depth (rotateX + translateZ on a `perspective` stage) and settles flat as it
 * reaches the middle of the viewport, then eases away again as it leaves.
 *
 * OWNERSHIP: GSAP owns this outer wrapper's transform only. The inner content
 * keeps its own CSS `.reveal` entrance (see motion-primitives.tsx) — two
 * different elements, so the two systems never fight over the same property.
 *
 * SAFETY: the wrapper renders untransformed by default and GSAP applies the
 * "away" state only once it actually runs, so with JS disabled (or before
 * hydration) every section is simply flat and fully visible. Reduced motion
 * skips the GSAP context entirely, and the effect is desktop-only — small
 * screens keep the plain vertical flow.
 */
export function Section3D({
  children,
  className,
  /** Peak tilt in degrees at the extremes of the scroll range. */
  tilt = 7,
  /** Peak depth push-back in px at the extremes. */
  depth = 140,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
  depth?: number;
}) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();

  React.useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    const inner = innerRef.current;
    if (!stage || !inner) return;

    const mm = gsap.matchMedia();

    // Desktop only: fine-pointer, roomy viewports where the depth reads well
    // and compositing cost is affordable.
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        // NOTE: deliberately no opacity in these tweens. Fading a dark section
        // over the cream page turns the brand charcoal into a washed-out grey;
        // pure geometry (rotation + depth) reads as depth while keeping every
        // brand colour true.

        // Entering: tilted back and pushed away -> flat at centre.
        gsap.fromTo(
          inner,
          { rotateX: tilt, z: -depth },
          {
            rotateX: 0,
            z: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: stage,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );

        // Leaving: flat -> tilted forward and receding, so consecutive sections
        // hand off to each other instead of just stacking.
        gsap.fromTo(
          inner,
          { rotateX: 0, z: 0 },
          {
            rotateX: -tilt * 0.6,
            z: -depth * 0.5,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: stage,
              start: "bottom 65%",
              end: "bottom 15%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      }, stageRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduced, tilt, depth]);

  return (
    <div
      ref={stageRef}
      className={className}
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
    >
      <div ref={innerRef} style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
