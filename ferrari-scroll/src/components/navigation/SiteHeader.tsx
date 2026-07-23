import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { brand, nav } from "../../content/experience";
import { menuPanel } from "../../lib/motion";

/* Persistent header over the dark cinematic canvas. Wordmark + primary nav +
   an accessible mobile menu (focus trap, Escape, body-scroll lock). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const links = nav.slice(0, 4); // Experience · Design · Engineering · Craft

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>("a,button");
    focusables?.[0]?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[82rem] items-center justify-between px-[clamp(1.1rem,4vw,3rem)]">
        <a href="#reveal" className="font-display text-[1.1rem] tracking-[0.22em] text-warm-white">
          {brand.wordmark}
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="tap inline-flex items-center px-3 text-[0.8rem] uppercase tracking-[0.16em] text-silver transition-colors hover:text-warm-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="tap inline-flex items-center justify-center text-warm-white md:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <m.div
            id="site-menu"
            ref={panelRef}
            className="md:hidden"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav aria-label="Mobile" className="grid gap-1 border-t border-white/10 bg-carbon/95 px-[clamp(1.1rem,4vw,3rem)] pb-6 pt-2 backdrop-blur-sm">
              {nav.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="tap flex items-center font-display text-[1.4rem] text-warm-white"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
