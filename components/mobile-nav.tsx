"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { actionClasses } from "@/components/ui/action-link";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { outlet } from "@/data/outlet";
import { anchors, telHref, whatsappHref } from "@/lib/links";

const navItems = [
  { href: anchors.menu, label: "Menu" },
  { href: anchors.about, label: "About" },
  { href: anchors.location, label: "Location" },
  { href: anchors.faq, label: "FAQ" },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mobile navigation sheet.
 *
 * Focus is trapped while open, Escape and the backdrop close it, body scroll
 * is locked without a layout jump, and focus returns to the trigger on close.
 * The sheet content is unmounted when closed so there is never a duplicate
 * hidden navigation landmark.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Scroll lock, initial focus, Escape, and focus return.
  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const trigger = triggerRef.current;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-border-strong bg-surface text-ink md:hidden"
      >
        <MenuIcon width={22} height={22} />
        <span className="sr-only">Open menu</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45"
          />

          <div
            ref={panelRef}
            id={panelId}
            data-sheet
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col gap-6 overflow-y-auto border-l border-border bg-canvas px-5 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-lifted"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-lg leading-tight text-ink">
                {outlet.name}
                <span className="mt-0.5 block text-xs font-semibold tracking-[0.14em] text-copper uppercase">
                  Adajan Patiya
                </span>
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface text-ink"
              >
                <CloseIcon width={22} height={22} />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {navItems.map((entry) => (
                  <li key={entry.href}>
                    <a
                      href={entry.href}
                      onClick={close}
                      className="flex min-h-[52px] items-center border-b border-border text-lg text-ink no-underline"
                    >
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <WhatsAppLink href={whatsappHref()} size="lg">
                {outlet.cta.whatsapp}
              </WhatsAppLink>
              <a href={telHref} className={actionClasses("secondary", "lg")}>
                <PhoneIcon />
                <span>{outlet.cta.call}</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
