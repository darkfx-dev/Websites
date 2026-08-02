"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { actionClasses } from "@/components/ui/action-link";
import { PhoneIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { outlet } from "@/data/outlet";
import { telHref, whatsappHref } from "@/lib/links";
import { stickyBar } from "@/lib/motion";

/**
 * 096 — sticky mobile inquiry bar.
 *
 * Appears once the hero actions scroll out of view. Two actions only, both
 * clearing 44×44px, with safe-area padding. The space it occupies is
 * reserved on `body` from the first paint (see globals.css), so it never
 * covers content and never shifts layout.
 *
 * Hidden at 768px and above, where the header CTA is always on screen.
 */
export function MobileInquiryBar() {
  const [visible, setVisible] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const reduced = useAccessibleMotion();

  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Marks the end of the hero region. */}
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none h-px" />

      <AnimatePresence>
        {visible ? (
          <m.div
            data-print-hide
            variants={stickyBar(reduced)}
            initial="hidden"
            animate="visible"
            exit="exit"
            /* Opaque, like the header: a blurred translucent bar makes the
               contrast of anything drawn on it depend on the scroll position,
               and it costs a backdrop filter on every scroll frame. */
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-canvas pb-[env(safe-area-inset-bottom)] md:hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <WhatsAppLink href={whatsappHref()} className="flex-1">
                {outlet.cta.whatsapp}
              </WhatsAppLink>
              <a
                href={telHref}
                className={actionClasses("secondary", "md", "flex-1")}
                aria-label={`Call the outlet on ${outlet.contact.phoneDisplay}`}
              >
                <PhoneIcon />
                <span>Call</span>
              </a>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
