"use client";

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { motionTokens } from "@/lib/motion";

/**
 * Abstract brand composition: stainless-tray contour rings, layered menu
 * tickets, a yellow annotation mark and steam lines, arranged on a CSS
 * `perspective` stage.
 *
 * It is deliberately not a depiction of the outlet, its food or its location —
 * no photograph is approved for this site, and an abstract mark is honest
 * where a generated storefront would not be. It is `aria-hidden` because it
 * carries no information that is not already in the copy.
 *
 * Motion budget: ≤3° tilt and ≤5px travel, fine-pointer desktop only, frozen
 * when offscreen, and fully static under reduced motion.
 */
export function HeroObject() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(true);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, motionTokens.spring.gentle);
  const springY = useSpring(pointerY, motionTokens.spring.gentle);

  // -0.5..0.5 of the stage maps to the brief's ceilings, and no further.
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-5, 5]);

  // Only track a genuinely fine pointer with hover, on a desktop-width screen.
  useEffect(() => {
    if (reduced) return;
    const query = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const sync = () => setInteractive(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduced]);

  // Freeze the effect while the hero is scrolled out of view.
  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { rootMargin: "80px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!interactive || !visible) return;

    function onPointerMove(event: PointerEvent) {
      const node = stageRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    }

    function reset() {
      pointerX.set(0);
      pointerY.set(0);
    }

    const node = stageRef.current;
    node?.addEventListener("pointermove", onPointerMove);
    node?.addEventListener("pointerleave", reset);
    return () => {
      node?.removeEventListener("pointermove", onPointerMove);
      node?.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [interactive, visible, pointerX, pointerY]);

  const animated = interactive && visible && !reduced;

  return (
    <div
      ref={stageRef}
      aria-hidden
      className="relative mx-auto w-full max-w-[420px] select-none lg:max-w-none"
      style={{ perspective: 1000 }}
    >
      <m.div
        className="relative aspect-square w-full"
        style={
          animated
            ? {
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
              }
            : undefined
        }
      >
        <svg
          viewBox="0 0 400 400"
          className="h-full w-full overflow-visible"
          role="presentation"
          focusable="false"
        >
          {/* Tray contour rings */}
          <circle cx="200" cy="206" r="132" fill="none" stroke="#0a0a0a" strokeWidth="1.25" opacity="0.85" />
          <circle cx="200" cy="206" r="112" fill="none" stroke="#0a0a0a" strokeWidth="0.75" opacity="0.45" />
          <circle cx="200" cy="206" r="88" fill="none" stroke="#0a0a0a" strokeWidth="0.75" opacity="0.3" />

          {/* Yellow annotation mark, the single warm accent */}
          <path
            d="M118 262c48 20 116 20 164 0"
            fill="none"
            stroke="#e9c934"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Cropped black editorial panel */}
          <rect x="238" y="120" width="104" height="66" fill="#0a0a0a" />
          <rect x="250" y="138" width="58" height="3" fill="#fdfdfb" />
          <rect x="250" y="150" width="42" height="3" fill="#fdfdfb" opacity="0.7" />
          <rect x="250" y="162" width="66" height="3" fill="#fdfdfb" opacity="0.45" />

          {/* Layered menu tickets */}
          <g transform="rotate(-7 150 232)">
            <rect x="86" y="196" width="128" height="76" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.1" />
            <rect x="100" y="214" width="76" height="2.5" fill="#0a0a0a" opacity="0.7" />
            <rect x="100" y="226" width="54" height="2.5" fill="#0a0a0a" opacity="0.4" />
            <rect x="100" y="238" width="88" height="2.5" fill="#0a0a0a" opacity="0.25" />
            <rect x="100" y="252" width="30" height="6" fill="#e9c934" />
          </g>
          <g transform="rotate(5 214 250)">
            <rect x="160" y="222" width="118" height="70" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.1" />
            <rect x="174" y="240" width="64" height="2.5" fill="#0a0a0a" opacity="0.7" />
            <rect x="174" y="252" width="46" height="2.5" fill="#0a0a0a" opacity="0.4" />
            <rect x="174" y="266" width="24" height="6" fill="#a43227" opacity="0.85" />
          </g>

          {/* Steam lines */}
          <g fill="none" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
            <path d="M168 92c-10-14 10-22 0-36" />
            <path d="M200 80c-11-16 11-25 0-41" />
            <path d="M232 92c-10-14 10-22 0-36" />
          </g>
        </svg>
      </m.div>
    </div>
  );
}
