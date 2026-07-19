"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Our Story" },
  { href: "#studio", label: "Custom Cakes" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit Us" },
];

/**
 * Transparent over the hero, settling to a soft espresso surface after
 * scroll. Mobile opens a full-screen sheet with staggered link reveals,
 * Escape-to-close, focus management, and locked background scroll.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const burger = burgerRef.current;
    document.body.style.overflow = "hidden";
    const first = sheetRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 ${scrolled ? "scrolled" : ""}`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 sm:px-8"
      >
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-porcelain"
        >
          Modi Bakers
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-porcelain/75 transition-colors duration-150 hover:text-vanilla"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#studio"
            className="glow-btn inline-flex min-h-11 items-center rounded-full bg-caramel px-5 py-2 text-sm font-semibold text-noir"
          >
            <span aria-hidden className="icing-swipe" />
            Order a Cake
          </a>
        </div>

        <button
          ref={burgerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border border-porcelain/25 md:hidden"
        >
          <span className="h-px w-5 bg-porcelain" />
          <span className="h-px w-5 bg-porcelain" />
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`sheet fixed inset-0 z-50 flex flex-col bg-soot md:hidden ${open ? "open" : ""}`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-lg font-semibold text-porcelain">
            Modi Bakers
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-porcelain/25 text-porcelain"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 px-8 pb-16">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="sheet-link py-3 font-display text-4xl font-medium text-porcelain transition-colors hover:text-vanilla"
              style={{ "--d": `${0.06 + i * 0.05}s` } as React.CSSProperties}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#studio"
            onClick={() => setOpen(false)}
            className="sheet-link glow-btn mt-6 inline-flex min-h-12 w-fit items-center rounded-full bg-caramel px-7 py-3 font-semibold text-noir"
            style={{ "--d": "0.36s" } as React.CSSProperties}
          >
            <span aria-hidden className="icing-swipe" />
            Order a Cake
          </a>
          <p
            className="sheet-link mt-10 text-sm text-taupe"
            style={{ "--d": "0.42s" } as React.CSSProperties}
          >
            {site.hours} · {site.hoursNote} ·{" "}
            <a href={site.phoneHref} className="text-vanilla underline underline-offset-4">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </header>
  );
}
