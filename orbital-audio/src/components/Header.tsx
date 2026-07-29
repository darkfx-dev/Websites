import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useScrollView } from "../hooks/useScrollView";
import { NeonButton } from "./NeonButton";

const LINKS = [
  { id: "product", label: "Product" },
  { id: "workflow", label: "How it works" },
  { id: "pricing", label: "Pricing" },
] as const;

export function Header() {
  const { active } = useScrollView();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes and hands focus back. The panel is a disclosure rather than
  // a modal — the page behind it stays scrollable and focus is free to leave —
  // so it needs no focus trap, and cannot strand a keyboard user inside it.
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
    <header className="header" data-solid={active !== "hero" || open}>
      <div className="page header__bar">
        <a href="#hero" className="wordmark">
          Orbital<em>Audio</em>
          <span aria-hidden="true" />
        </a>

        <nav className="header__nav" aria-label="Sections">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          {/* Stays visible at every width — it is the page's conversion
              goal, and hiding it behind a hamburger on the smallest screens
              would hide it from the people most likely to be browsing. */}
          <NeonButton href="#cta" variant="primary" size="sm">
            Start free trial
          </NeonButton>

          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            className="header__panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="page">
              <ul>
                {LINKS.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} onClick={() => setOpen(false)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <NeonButton href="#cta" variant="primary" size="lg">
                Start free trial
              </NeonButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
