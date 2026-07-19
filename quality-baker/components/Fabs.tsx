"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { EASE_OUT_STRONG } from "@/lib/motion";
import { defaultWhatsappHref, site } from "@/lib/site";

/**
 * Fixed action stack, lower-right, safe-area aware. Map button uses the
 * familiar map-blue + red-pin language with a restrained porcelain halo;
 * WhatsApp keeps its recognisable green with a single delayed attention
 * pulse (CSS, two cycles, killed under reduced motion). When the order
 * basket has items, the batch pill docks above both.
 */
export function Fabs() {
  const { items, whatsappOrderHref } = useCart();
  // On small screens the map FAB steps aside while the cake studio is in
  // view, so it never sits on top of the form's inputs. WhatsApp stays —
  // it's the studio's own destination.
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const studio = document.getElementById("studio");
    if (!studio) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const io = new IntersectionObserver(
      ([entry]) => setDocked(entry.isIntersecting && mq.matches),
      { rootMargin: "-15% 0px" }
    );
    io.observe(studio);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {items.length > 0 && (
          <m.a
            key="order-pill"
            href={whatsappOrderHref}
            target="_blank"
            rel="noopener"
            initial={{ opacity: 0, transform: "translateY(10px) scale(0.95)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(10px) scale(0.95)" }}
            transition={{ duration: 0.22, ease: EASE_OUT_STRONG }}
            className="glow-btn flex min-h-12 items-center gap-2.5 rounded-full bg-caramel px-5 py-3 text-sm font-semibold text-noir"
          >
            <span aria-hidden className="icing-swipe" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-noir text-xs font-bold text-porcelain">
              {items.length}
            </span>
            Send order on WhatsApp
          </m.a>
        )}
      </AnimatePresence>

      <a
        href={site.mapsDirectionsHref}
        target="_blank"
        rel="noopener"
        aria-label="Open Modi Bakers in Google Maps"
        aria-hidden={docked}
        tabIndex={docked ? -1 : undefined}
        className={`fab map flex h-12 w-12 items-center justify-center rounded-full transition-opacity duration-200 sm:h-[54px] sm:w-[54px] ${
          docked ? "pointer-events-none opacity-0" : ""
        }`}
        style={{ backgroundColor: "#1a73e8" }}
      >
        <span className="tip" role="tooltip">
          Get directions
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2a6.6 6.6 0 0 0-6.6 6.6C5.4 13 12 21 12 21s6.6-8 6.6-12.4A6.6 6.6 0 0 0 12 2z"
            fill="#ea4335"
          />
          <circle cx="12" cy="8.6" r="2.3" fill="#fffdf8" />
        </svg>
      </a>

      <a
        href={defaultWhatsappHref}
        target="_blank"
        rel="noopener"
        aria-label="Ask on WhatsApp"
        className="fab wa flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "#25d366" }}
      >
        <span aria-hidden className="pulse" />
        <span className="tip" role="tooltip">
          Ask on WhatsApp
        </span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fffdf8" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.1 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.3-1.4-.7c-.2 0-.3-.1-.5.1l-.7.9c-.1.2-.2.2-.4.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.3.1-.5l.5-.6c.1-.2.1-.3 0-.5l-.7-1.6c-.1-.4-.3-.4-.5-.4z" />
        </svg>
      </a>
    </div>
  );
}
