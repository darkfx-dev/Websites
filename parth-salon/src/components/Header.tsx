import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { business } from "../config/business";
import { navLinks } from "../data/nav";
import { menuPanel } from "../motion/variants";
import { ChatGlyph } from "./Icons";

/* Sticky header: transparent over the forest hero, then an ivory bar with a
   hairline once scrolled. Mobile menu traps focus, closes on Escape, locks
   body scroll, and exposes a visible close control. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  // Menu open: focus first link, lock scroll, Escape to close, focus trap.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-100 transition-colors duration-300 ${
        solid
          ? "bg-ivory/95 backdrop-blur-sm border-b border-silver-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-4">
        {/* Wordmark */}
        <a
          href="#top"
          className={`font-display text-[1.6rem] leading-none tracking-tight ${
            solid ? "text-forest" : "text-ivory"
          }`}
        >
          Parth<span className="text-forest-rich">.</span>
          <span className="sr-only"> Salon — home</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`tap inline-flex items-center rounded-[6px] px-3 text-[0.92rem] transition-colors ${
                solid
                  ? "text-graphite hover:text-forest-rich"
                  : "text-ivory/85 hover:text-ivory"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={business.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap ml-2 inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-forest px-4 text-[0.9rem] font-semibold text-white transition-colors hover:bg-forest-rich"
          >
            <ChatGlyph className="shrink-0" />
            Book on WhatsApp
          </a>
        </nav>

        {/* Mobile: quick WhatsApp + menu */}
        <div className="flex items-center gap-1 lg:hidden">
          <a
            href={business.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message Parth Salon on WhatsApp"
            className={`tap inline-flex items-center justify-center rounded-[8px] ${
              solid ? "text-whatsapp-ink" : "text-whatsapp"
            }`}
          >
            <ChatGlyph className="h-6 w-6" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`tap inline-flex items-center justify-center rounded-[8px] ${
              solid ? "text-forest" : "text-ivory"
            }`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={panelRef}
            className="lg:hidden"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav
              aria-label="Mobile"
              className="container-page grid gap-1 border-t border-silver-line bg-ivory pb-6 pt-2"
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="tap flex items-center rounded-[6px] py-2 font-display text-[1.5rem] text-graphite"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={business.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] bg-whatsapp px-4 font-semibold text-[#04310f]"
                >
                  <ChatGlyph />
                  WhatsApp
                </a>
                <a
                  href={business.telephoneUrl}
                  onClick={() => setOpen(false)}
                  className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-silver-line bg-white px-4 font-semibold text-forest"
                >
                  <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                  Call
                </a>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>

      {/* Reading-progress line — a direct MotionValue → scaleX binding (no
          keyframes), so it stays cheap and never triggers layout. Decorative. */}
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-forest-rich"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
