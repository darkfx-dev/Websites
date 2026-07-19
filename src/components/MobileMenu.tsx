import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  items: readonly NavItem[];
  currentPath: string;
}

/**
 * Accessible mobile navigation drawer.
 * Focus is trapped while open; Escape closes; body scroll is locked.
 */
export default function MobileMenu({ items, currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
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
    document.addEventListener("keydown", onKey);
    drawerRef.current
      ?.querySelector<HTMLElement>("a[href], button")
      ?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className="mobile-menu-root">
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-trigger"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-menu-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-nav-drawer"
              ref={drawerRef}
              className="mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav aria-label="Main">
                <ul>
                  {items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={
                          currentPath === item.href ? "page" : undefined
                        }
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <a className="btn btn--primary mobile-menu-cta" href="/admissions">
                Admission Enquiry
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-menu-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          min-height: 48px;
          min-width: 48px;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--ink);
        }
        .mobile-menu-trigger svg { width: 1.25rem; height: 1.25rem; }
        @media (min-width: 860px) { .mobile-menu-root { display: none; } }
        .mobile-menu-scrim {
          position: fixed; inset: 0;
          background: rgba(29, 31, 35, 0.5);
          z-index: var(--z-drawer);
        }
        .mobile-menu-drawer {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: calc(var(--z-drawer) + 1);
          background: var(--paper);
          border-bottom: 1px solid var(--border);
          padding: 5rem 1.25rem 1.5rem;
          box-shadow: 0 20px 40px rgba(29, 31, 35, 0.15);
        }
        .mobile-menu-drawer ul {
          list-style: none; margin: 0 0 1rem; padding: 0;
          display: flex; flex-direction: column;
        }
        .mobile-menu-drawer a:not(.btn) {
          display: block;
          padding: 0.85rem 0.25rem;
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--border);
        }
        .mobile-menu-drawer a:not(.btn):hover { color: var(--red); }
        .mobile-menu-drawer a[aria-current="page"] { color: var(--red); }
        .mobile-menu-cta { width: 100%; }
      `}</style>
    </div>
  );
}
