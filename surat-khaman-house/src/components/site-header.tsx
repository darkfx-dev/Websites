"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ActionLink } from "@/components/ui/action-link";
import { business, navLinks } from "@/data/business";
import { telHref, whatsappHref } from "@/lib/links";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Thin editorial header. It carries the wordmark, four section links and a
 * WhatsApp CTA — and deliberately no area name, address, landmark, map icon,
 * directions link or location nav item, because none of those may appear
 * before the final Location & Contact section.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Lock background scrolling while the sheet is open, and restore the exact
  // previous value rather than assuming it was "".
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes, and Tab is cycled inside the panel so focus cannot walk out
  // into the page behind it.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the panel on open; return it to the trigger on close.
  useEffect(() => {
    if (open) {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      first?.focus();
    } else {
      // Only pull focus back if it is still inside the (now closed) panel,
      // so closing via a link click does not fight the browser.
      if (
        document.activeElement === document.body ||
        panelRef.current?.contains(document.activeElement)
      ) {
        toggleRef.current?.focus();
      }
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(10,10,10,0.12)] bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center font-display text-xl leading-none tracking-tight text-ink sm:text-2xl"
        >
          {business.name}
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ActionLink href={whatsappHref} external>
            Ask on WhatsApp
          </ActionLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex h-11 w-11 items-center justify-center rounded-card border border-[rgba(10,10,10,0.16)] text-ink md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <m.div
              className="fixed inset-0 top-16 z-40 bg-ink/20 md:hidden"
              onClick={close}
              aria-hidden
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: motionTokens.duration.fast }}
            />
            <m.div
              ref={panelRef}
              id={panelId}
              className="fixed inset-x-0 top-16 z-40 border-b border-[rgba(10,10,10,0.12)] bg-surface md:hidden"
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: motionTokens.duration.panel,
                ease: motionTokens.ease.standard,
              }}
            >
              <nav aria-label="Mobile" className="container-page py-4">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={close}
                        className="flex min-h-12 items-center border-b border-[rgba(10,10,10,0.08)] text-base font-medium text-ink"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-col gap-3 pb-2">
                  <ActionLink href={whatsappHref} external size="lg">
                    Ask on WhatsApp
                  </ActionLink>
                  <ActionLink href={telHref} variant="secondary" size="lg">
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {business.telephone.display}
                  </ActionLink>
                </div>
              </nav>
            </m.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/** Rendered above everything so keyboard users can jump past the header. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:left-4 focus:top-4 focus:z-[60]",
        "focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-card",
        "focus:border focus:border-ink focus:bg-surface focus:px-4 focus:text-sm focus:font-semibold focus:text-ink",
      )}
    >
      Skip to content
    </a>
  );
}
