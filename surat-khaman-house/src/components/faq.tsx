"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";

import { faqs } from "@/data/faq";
import { motionTokens } from "@/lib/motion";

/**
 * Accordion built from real `<button>` elements with `aria-expanded` and
 * `aria-controls`, so it is operable by keyboard and announced correctly.
 *
 * Answers are rendered in the HTML and only collapsed visually, so the content
 * is present for search engines and for anyone whose JavaScript fails.
 */
export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className="section-y border-b border-[rgba(10,10,10,0.12)]">
      <div className="container-page">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          04 — FAQ
        </p>

        <div className="mt-3 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em] text-ink lg:col-span-4">
            Questions
          </h2>

          <ul className="border-t border-[rgba(10,10,10,0.12)] lg:col-span-8">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              const panelId = `faq-panel-${faq.id}`;
              const buttonId = `faq-button-${faq.id}`;

              return (
                <li
                  key={faq.id}
                  className="border-b border-[rgba(10,10,10,0.12)]"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-ink"
                    >
                      {faq.question}
                      <Plus
                        aria-hidden
                        className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ease-standard ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <m.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                          duration: motionTokens.duration.panel,
                          ease: motionTokens.ease.standard,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-measure pb-5 text-ink-soft">
                          {faq.answer}
                        </p>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
