import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { site, emailHref } from "../content/site";
import { dur, easeOut, navReveal } from "../motion/variants";

/* Pattern adapted from 21st.dev navbar research: minimal top bar,
   transparent→solid on scroll, mobile menu sliding from the top with
   focus management, Escape-to-close, and body scroll lock. */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    firstLinkRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <motion.header
      className={`nav ${solid || open ? "nav--solid" : ""}`}
      initial="hidden"
      animate="visible"
      variants={navReveal}
    >
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">
          {site.brand}
        </a>

        <nav className="nav__links" aria-label="Primary">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className="nav__link">
              {item.label}
            </a>
          ))}
        </nav>

        <a href={emailHref} className="btn btn-primary nav__cta">
          Start a project
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="nav__mobile"
            aria-label="Mobile"
            initial={{ y: "-100%" }}
            animate={{ y: 0, transition: { duration: dur.ui, ease: easeOut } }}
            exit={{ y: "-100%", transition: { duration: dur.ui, ease: easeOut } }}
          >
            <ul className="nav__mobile-list">
              {site.nav.map((item, i) => (
                <li key={item.href}>
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    className="nav__mobile-link"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={emailHref} className="btn btn-primary" onClick={() => setOpen(false)}>
                  Start a project
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
