"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionTier } from "@/lib/motion";

/**
 * Signature animation #5: price count-up reveal.
 *
 * The full number is server-rendered (SEO + no-JS + LCP safe). On capable
 * tiers, the first time the price scrolls into view it counts up over ~0.7s.
 * Tabular numerals keep the width stable so nothing reflows.
 */
export function Price({
  value,
  qualifier,
  className = "",
}: {
  value: number;
  qualifier?: "from" | "each";
  className?: string;
}) {
  const tier = useMotionTier();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const animated = useRef(false);

  useEffect(() => {
    if (tier !== "full" || animated.current) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        io.disconnect();
        const start = performance.now();
        const dur = 700;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        setShown(0);
        requestAnimationFrame(tick);
      },
      { rootMargin: "-10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tier, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {qualifier === "from" && <span className="text-[0.8em]">from </span>}
      ₹{shown.toLocaleString("en-IN")}
      {qualifier === "each" && <span className="text-[0.8em]"> each</span>}
    </span>
  );
}
