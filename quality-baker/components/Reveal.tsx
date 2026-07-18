"use client";

import { m } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE_OUT_STRONG, useMotionTier } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Use for small stagger offsets between siblings. */
  delay?: number;
};

/**
 * Scroll-into-view reveal that *enhances* already-visible content.
 *
 * The server (and any client before tier detection) renders a plain, fully
 * visible element — content is never gated behind JS. Once the tier is known:
 *  - static tier, or element already on screen → stays a plain element
 *  - lite tier → opacity-only fade
 *  - full tier → fade + rise with the house ease-out
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const tier = useMotionTier();
  const probeRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"plain" | "lite" | "full">("plain");

  useEffect(() => {
    if (tier === null || tier === "static") return;
    const el = probeRef.current;
    if (!el) return;
    // Already in (or near) the viewport: animating it now would flash-hide
    // visible content. Leave it alone.
    const inView = el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (!inView) setMode(tier === "lite" ? "lite" : "full");
  }, [tier]);

  if (mode === "plain") {
    return (
      <div ref={probeRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      className={className}
      initial={
        mode === "lite" ? { opacity: 0 } : { opacity: 0, transform: "translateY(28px)" }
      }
      whileInView={
        mode === "lite"
          ? { opacity: 1 }
          : { opacity: 1, transform: "translateY(0px)" }
      }
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: mode === "lite" ? 0.35 : 0.7,
        delay,
        ease: EASE_OUT_STRONG,
      }}
    >
      {children}
    </m.div>
  );
}
