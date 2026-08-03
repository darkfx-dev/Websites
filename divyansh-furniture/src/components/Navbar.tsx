"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { business, navLinks } from "@/data/site";
import { BookButton } from "@/components/ui/BookButton";
import { messages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Sticky navbar.
 *
 * Transparent over the hero so the composition is not boxed in, and glass
 * once the visitor leaves it. The active section is marked with
 * `aria-current` as well as colour, so the state is not carried by colour
 * alone.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const reduced = useReducedMotion();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observed = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (observed.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Escape closes and hands focus back. This is a disclosure, not a modal —
  // the page behind stays scrollable and focus is free to leave — so it needs
  // no focus trap and cannot strand a keyboard user inside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300 ease-soft",
          scrolled || open
            ? "glass border-b border-hairline"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav
          aria-label="Primary"
          className="page flex h-[76px] items-center justify-between gap-4"
        >
          <a href="#top" className="group flex min-h-[44px] items-center gap-2 rounded-sm">
            <span className="font-display text-[1.35rem] leading-none tracking-tight">
              Divyansh
            </span>
            <span className="text-label tracking-[0.22em] text-brass">
              FURNITURE
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative flex min-h-[44px] items-center rounded-sm px-3.5 text-sm transition-colors duration-200",
                      isActive ? "text-silk" : "text-silk-dim hover:text-silk"
                    )}
                  >
                    {link.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3.5 bottom-1.5 h-px bg-brass"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <BookButton message={messages.general} variant="primary">
                Book now
              </BookButton>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-12 w-12 place-items-center rounded-sm border border-hairline-strong text-silk transition-colors duration-200 hover:border-brass-line lg:hidden"
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

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            className="glass overflow-hidden border-b border-hairline lg:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="page py-3">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? "true" : undefined}
                      className="flex min-h-[56px] items-center border-b border-hairline text-base text-silk-dim transition-colors hover:text-silk"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <BookButton
                  message={messages.general}
                  variant="primary"
                  fullWidth
                >
                  Book on WhatsApp
                </BookButton>
              </div>
              <p className="mt-3 text-label text-silk-faint">
                {business.tagline}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
