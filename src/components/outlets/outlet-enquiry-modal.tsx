"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import type { Outlet } from "@/data/outlets";
import {
  buildOutletEnquiryUrl,
  enquiryCategories,
} from "@/lib/outlet-enquiry";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Enquiry dialog shown after an outlet is chosen, so the user confirms which
 * branch they are messaging and what about before leaving for WhatsApp.
 *
 * Focus handling, scroll lock and Escape mirror the mobile-menu dialog in
 * `site-header.tsx` so the two behave identically.
 *
 * Rendered through a portal: a dialog belongs at the top of the document, and
 * this way a transformed ancestor (which would otherwise become the containing
 * block for `position: fixed`) can never break it.
 */
export function OutletEnquiryModal({
  outlet,
  open,
  onClose,
}: {
  outlet: Outlet | null;
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const resetTimer = React.useRef<number | null>(null);

  React.useEffect(() => setMounted(true), []);

  // Start each outlet's enquiry from a clean slate — carrying selections over
  // to a different branch would be a confusing thing to send.
  React.useEffect(() => {
    if (!open) return;
    setSelected([]);
    setMessage("");
    setError(null);
    setSubmitting(false);
  }, [open, outlet?.id]);

  React.useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    []
  );

  // Scroll lock + Escape + cyclic focus trap, for as long as the dialog is open.
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the dialog for keyboard and screen-reader users.
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      "button, a[href], textarea"
    );
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const toggleCategory = (category: string) => {
    setSelected((prev) => {
      const next = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      if (next.length > 0) setError(null);
      return next;
    });
  };

  // Live href, so the control is a real link the browser navigates natively —
  // window.open() is unreliable behind popup blockers and for app deep links.
  const waHref = outlet
    ? buildOutletEnquiryUrl({
        outlet,
        categories: selected,
        additionalMessage: message,
      })
    : "#";

  const onContinue = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (submitting) {
      // Second activation while the first is still handing off.
      e.preventDefault();
      return;
    }
    if (selected.length === 0) {
      e.preventDefault();
      setError(
        "Please select at least one option so we know what you're asking about."
      );
      return;
    }
    setError(null);
    setSubmitting(true);
    // The link opens in a new tab, so this tab stays put. Clear the pending
    // state and close shortly after hand-off rather than leaving the dialog
    // stuck on "Preparing…". This is not an artificial delay before the
    // redirect — navigation has already been handed to the browser.
    resetTimer.current = window.setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 900);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && outlet ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close enquiry options"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="outlet-enquiry-title"
            aria-describedby="outlet-enquiry-subtitle"
            initial={reduce ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 28, mass: 0.85 }}
            className={cn(
              "relative flex max-h-[92dvh] w-full flex-col overflow-hidden border border-warm-border bg-cream shadow-elevated",
              "rounded-t-feature sm:max-w-lg sm:rounded-feature",
              "pb-[env(safe-area-inset-bottom)] sm:pb-0"
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-warm-border p-6 pb-4">
              <div>
                <h3
                  id="outlet-enquiry-title"
                  className="font-display text-xl font-semibold text-charcoal"
                >
                  Tell us what you&rsquo;re looking for
                </h3>
                <p
                  id="outlet-enquiry-subtitle"
                  className="mt-2 text-sm leading-relaxed text-charcoal/70"
                >
                  Select one or more options before continuing to WhatsApp. This
                  helps us prepare your order or enquiry in advance for faster
                  response.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-warm-border bg-white text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Scrolls internally so the dialog never exceeds the viewport. */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-5">
              <div className="rounded-card border border-warm-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/55">
                  Messaging outlet
                </p>
                <p className="mt-1.5 font-display text-lg font-semibold text-charcoal">
                  {outlet.name}
                </p>
                <p className="text-sm font-medium text-tomato">
                  {outlet.subtitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                  {outlet.addressLines.join(" ")}
                </p>
              </div>

              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-charcoal">
                  What is your enquiry about?
                </legend>
                <div
                  className="mt-3 flex flex-wrap gap-2"
                  aria-describedby={error ? "outlet-enquiry-error" : undefined}
                >
                  {enquiryCategories.map((category) => {
                    const isOn = selected.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        aria-pressed={isOn}
                        className={cn(
                          "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 text-sm font-medium",
                          "transition-[background-color,border-color,color,transform] duration-160 ease-standard active:scale-[0.97]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
                          isOn
                            ? "border-charcoal bg-charcoal text-cream"
                            : "border-warm-border bg-white text-charcoal/80 hover:border-charcoal/40 hover:text-charcoal"
                        )}
                      >
                        {isOn ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : null}
                        {category}
                      </button>
                    );
                  })}
                </div>
                {error ? (
                  <p
                    id="outlet-enquiry-error"
                    role="alert"
                    className="mt-3 text-sm font-medium text-tomato"
                  >
                    {error}
                  </p>
                ) : null}
              </fieldset>

              <div className="mt-6">
                <label
                  htmlFor="outlet-enquiry-message"
                  className="text-sm font-semibold text-charcoal"
                >
                  Additional message{" "}
                  <span className="font-normal text-charcoal/55">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="outlet-enquiry-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={600}
                  placeholder="Write any additional details here... (e.g., spice level, quantity, timing preferences)"
                  className="mt-2 w-full resize-y rounded-control border border-warm-border bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>
            </div>

            <div className="border-t border-warm-border bg-cream p-6 pt-4">
              <a
                ref={linkRef}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onContinue}
                aria-disabled={submitting || undefined}
                className={cn(
                  "group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-button bg-coriander px-6 text-base font-semibold text-white",
                  "transition-[background-color,transform,box-shadow] duration-220 ease-standard",
                  "hover:-translate-y-0.5 hover:bg-[#27563c] active:translate-y-0 active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2",
                  submitting && "pointer-events-none opacity-70"
                )}
              >
                {submitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                    Preparing your message...
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                    Continue to WhatsApp
                  </>
                )}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
