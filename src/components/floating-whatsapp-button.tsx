"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { WhatsAppIcon } from "@/components/icons";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";

/**
 * Persistent WhatsApp entry point. Sits bottom-right, above the mobile action
 * bar, and respects the safe-area inset. A single gentle attention animation
 * runs once after the page settles, and never under reduced-motion.
 *
 * It opens the shared outlet selector rather than one branch's chat — the same
 * router every other WhatsApp control on the site uses.
 */
export function FloatingWhatsAppButton() {
  const reduce = useReducedMotion();
  const [play, setPlay] = React.useState(false);
  const trigger = useOutletTrigger(() => ({ type: "general-whatsapp" }));

  React.useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setPlay(true), 1200);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <div
      className="group fixed right-4 z-40 sm:right-6"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 76px)",
      }}
      data-floating-whatsapp
    >
      {/* Desktop tooltip — only where hover is genuinely supported. */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-1/2 right-full mr-3 hidden translate-y-1/2 whitespace-nowrap rounded-control bg-charcoal px-3 py-1.5 text-sm font-medium text-cream opacity-0 shadow-elevated transition-opacity duration-160 [@media(hover:hover)]:group-hover:opacity-100 sm:[@media(hover:hover)]:block"
      >
        Chat on WhatsApp
      </span>

      <motion.button
        {...trigger}
        aria-label="Choose an outlet to chat with on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-coriander text-white shadow-elevated transition-colors duration-160 hover:bg-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        animate={
          play && !reduce
            ? { scale: [1, 1.09, 0.98, 1.04, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.9, ease: "easeInOut" }}
        onAnimationComplete={() => setPlay(false)}
        whileTap={reduce ? undefined : { scale: 0.94 }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </motion.button>
    </div>
  );
}
