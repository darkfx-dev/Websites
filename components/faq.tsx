"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";

import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { actionClasses } from "@/components/ui/action-link";
import { ChevronDownIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { faqEntries, type FaqAction } from "@/data/faq";
import { outlet } from "@/data/outlet";
import { directionsHref, telHref, whatsappHref } from "@/lib/links";
import { duration, ease } from "@/lib/motion";

/**
 * 091 — FAQ accordion.
 *
 * A real button per question with `aria-expanded` and `aria-controls`; panel
 * content is mounted only while open, so assistive technology never reads a
 * collapsed answer. Multiple items may be open at once — these answers are
 * independent. Height animation is skipped entirely under reduced motion.
 */
export function Faq() {
  const [open, setOpen] = useState<readonly string[]>([]);
  const reduced = useAccessibleMotion();

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  return (
    <section id="faq" className="container-page scroll-mt-24 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-copper uppercase">
          Before you go
        </p>
        <h2 className="text-section text-ink">Questions this outlet gets asked</h2>
      </div>

      <ul className="mt-10 max-w-3xl border-t border-border">
        {faqEntries.map((entry) => {
          const isOpen = open.includes(entry.id);
          const panelId = `faq-panel-${entry.id}`;
          const buttonId = `faq-button-${entry.id}`;

          return (
            <li key={entry.id} className="border-b border-border">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(entry.id)}
                  className="flex w-full min-h-[64px] items-center justify-between gap-5 py-5 text-left font-display text-lg text-ink"
                >
                  {entry.question}
                  <ChevronDownIcon
                    className={`shrink-0 text-copper transition-transform duration-[180ms] ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <m.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={
                      reduced
                        ? { duration: duration.instant }
                        : { duration: duration.base, ease: ease.standard }
                    }
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      <p className="measure text-muted">{entry.answer}</p>
                      {entry.action ? (
                        <div className="mt-5">
                          <FaqAction action={entry.action} />
                        </div>
                      ) : null}
                    </div>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-muted">Still unsure about today?</p>
        <WhatsAppLink href={whatsappHref()}>{outlet.cta.whatsapp}</WhatsAppLink>
      </div>
    </section>
  );
}

function FaqAction({ action }: { action: FaqAction }) {
  if (action === "whatsapp") {
    return <WhatsAppLink href={whatsappHref()}>{outlet.cta.whatsapp}</WhatsAppLink>;
  }

  if (action === "call") {
    return (
      <a href={telHref} className={actionClasses("secondary")}>
        <PhoneIcon />
        <span>{outlet.contact.phoneDisplay}</span>
      </a>
    );
  }

  return (
    <a
      href={directionsHref}
      target="_blank"
      rel="noopener noreferrer"
      className={actionClasses("secondary")}
    >
      <MapPinIcon />
      <span>Open in Google Maps</span>
      <span className="sr-only"> (opens Google Maps)</span>
    </a>
  );
}
