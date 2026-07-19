import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface FaqItem {
  q: string;
  a: string;
}

/** Accessible accordion: real buttons, aria-expanded, labelled regions. */
export default function FAQ({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  const reduce = useReducedMotion();

  return (
    <div className="faq">
      {items.map((item, i) => {
        const open = openIndex === i;
        const headerId = `${baseId}-h-${i}`;
        const panelId = `${baseId}-p-${i}`;
        return (
          <div className="faq__item" key={i}>
            <h3 className="faq__q">
              <button
                type="button"
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  style={{
                    transform: open ? "rotate(45deg)" : "none",
                    transition: reduce ? "none" : "transform 180ms ease",
                  }}
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="faq__a">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <style>{`
        .faq { border-top: 1px solid var(--border); }
        .faq__item { border-bottom: 1px solid var(--border); }
        .faq__q { margin: 0; font-family: var(--font-sans); }
        .faq__q button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          width: 100%;
          min-height: 56px;
          padding: 1rem 0.25rem;
          background: none;
          border: 0;
          text-align: left;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--ink);
        }
        .faq__q button:hover { color: var(--red); }
        .faq__q svg { width: 1.25rem; height: 1.25rem; flex: none; color: var(--red); }
        .faq__a { padding: 0 0.25rem 1.25rem; color: var(--ink-muted); margin: 0; }
      `}</style>
    </div>
  );
}
