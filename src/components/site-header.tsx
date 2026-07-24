"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { business, navLinks } from "@/data/business";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("home");
  const reduce = useReducedMotion();
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Toggle the solid navbar background once the page is scrolled.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav item for the section currently in view.
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll only while the mobile menu is open; restore focus on close.
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Capture the trigger now so the cleanup restores focus to a stable node.
    const trigger = toggleRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Cyclic focus trap: keep Tab / Shift+Tab within the open panel.
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement;
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the panel for keyboard/screen-reader users.
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-colors duration-220 ease-standard",
          scrolled || open
            ? "border-b border-warm-border bg-white/90 shadow-card backdrop-blur-md supports-[backdrop-filter]:bg-white/80"
            : "bg-transparent"
        )}
      >
        <nav
          aria-label="Primary"
          className="container-page flex h-[68px] items-center justify-between gap-4"
        >
          <a
            href="#home"
            className="flex items-center gap-2.5 rounded-control font-display text-lg font-semibold tracking-tight text-charcoal sm:text-xl"
          >
            <motion.span
              className="inline-flex shrink-0"
              animate={reduce ? undefined : { y: [0, -3, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Image
                src="/images/mpb-logo.png"
                alt=""
                width={44}
                height={25}
                priority
                className="h-8 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] sm:h-9"
              />
            </motion.span>
            Mahesh Pav Bhaji
          </a>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-control px-3 py-2 text-sm font-medium transition-colors duration-160",
                      isActive
                        ? "text-tomato"
                        : "text-charcoal/80 hover:text-charcoal"
                    )}
                  >
                    {link.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-tomato"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              href={business.whatsapp.primary}
              external
              variant="whatsapp"
              className="hidden sm:inline-flex"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              WhatsApp Us
            </Button>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-warm-border bg-cream text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal lg:hidden"
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu dialog */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={reduce ? undefined : { opacity: 0, y: -8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 28,
                mass: 0.85,
              }}
              className="absolute inset-x-3 top-[76px] rounded-feature border border-warm-border bg-cream p-4 shadow-elevated"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const isActive = active === link.href.replace("#", "");
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "flex min-h-[48px] items-center rounded-control px-3 text-base font-medium",
                          isActive
                            ? "bg-ivory text-tomato"
                            : "text-charcoal hover:bg-ivory"
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 border-t border-warm-border pt-3">
                <Button
                  href={business.whatsapp.primary}
                  external
                  variant="whatsapp"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  WhatsApp Us
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
