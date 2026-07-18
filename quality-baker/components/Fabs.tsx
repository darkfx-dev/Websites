"use client";

import { AnimatePresence, m } from "framer-motion";
import { useCart } from "@/lib/cart";
import { EASE_OUT_STRONG } from "@/lib/motion";
import { defaultWhatsappHref, site } from "@/lib/site";

/**
 * Floating actions: WhatsApp (bottom-right, branded cocoa/caramel, gentle
 * opacity pulse) and Get Directions (bottom-left, miniature red-pin-on-blue
 * badge). When the order basket has items, a "Send order" pill docks above
 * the WhatsApp button and batches everything into one message.
 */
export function Fabs() {
  const { items, whatsappOrderHref } = useCart();

  return (
    <>
      {/* Map / directions — bottom-left */}
      <a
        href={site.mapsDirectionsHref}
        target="_blank"
        rel="noopener"
        aria-label="Get directions to The Quality Baker"
        className="fab tip-left fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-caramel/30 bg-noir/90 backdrop-blur-sm"
      >
        <span className="tip" role="tooltip">
          Get Directions
        </span>
        {/* Red pin on a small blue badge — Maps visual language, custom-drawn */}
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="17.5" r="5.5" fill="#4285f4" opacity="0.9" />
          <path
            d="M12 2a6 6 0 0 0-6 6c0 4 6 11 6 11s6-7 6-11a6 6 0 0 0-6-6z"
            fill="#ea4335"
          />
          <circle cx="12" cy="8" r="2.2" fill="#fdf8f0" />
        </svg>
      </a>

      {/* Order pill + WhatsApp — bottom-right */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
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
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-noir text-xs font-bold text-cream">
                {items.length}
              </span>
              Send order on WhatsApp
            </m.a>
          )}
        </AnimatePresence>

        <a
          href={defaultWhatsappHref}
          target="_blank"
          rel="noopener"
          aria-label="Chat with us on WhatsApp"
          className="fab flex h-14 w-14 items-center justify-center rounded-full bg-cocoa ring-2 ring-caramel/60"
        >
          <span aria-hidden className="pulse" />
          <span className="tip" role="tooltip">
            WhatsApp us
          </span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fdf8f0" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.1 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.3-1.4-.7c-.2 0-.3-.1-.5.1l-.7.9c-.1.2-.2.2-.4.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.3.1-.5l.5-.6c.1-.2.1-.3 0-.5l-.7-1.6c-.1-.4-.3-.4-.5-.4z" />
          </svg>
        </a>
      </div>
    </>
  );
}
