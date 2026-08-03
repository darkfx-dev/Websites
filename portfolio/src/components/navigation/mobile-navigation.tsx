"use client";

import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { cn } from "@/lib/utils";

export type NavSection = { id: string; label: string };

/**
 * The mobile menu panel.
 *
 * Everything a modal owes the keyboard lives here: the background is scroll
 * locked, Escape closes, Tab cycles inside the panel instead of wandering into
 * the page behind it, and focus returns to the button that opened it.
 *
 * Under reduced motion the animation props are omitted entirely rather than
 * set to zero duration, so the panel simply appears — no transform is ever
 * applied to an element the visitor is reading.
 */
export function MobileNavigation({
  open,
  onClose,
  sections,
  active,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  sections: readonly NavSection[];
  active: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const reduced = useReducedMotionPreference();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trigger = triggerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;

      // `-1` covers focus having escaped the panel entirely; either edge of
      // the cycle then pulls it back in rather than leaving it outside.
      const index = list.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && (index === 0 || index === -1)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (index === list.length - 1 || index === -1)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(4,6,9,0.72)] backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduced ? undefined : { opacity: 0, y: -10 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
            className="liquid-glass absolute inset-x-3 top-[80px] p-3"
          >
            <ul className="flex flex-col">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={onClose}
                    aria-current={active === s.id ? "true" : undefined}
                    className={cn(
                      "flex min-h-[52px] items-center rounded-sm px-4 text-base transition-colors",
                      active === s.id
                        ? "bg-accent-soft text-ink"
                        : "text-ink-soft hover:bg-[rgba(255,255,255,0.05)] hover:text-ink"
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-line pt-3">
              <a href="#contact" onClick={onClose} className="btn btn-primary w-full">
                Get in touch
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
