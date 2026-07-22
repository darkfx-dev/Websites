import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "../content/site";
import { dur, easeOut, fadeUp, staggerContainer, viewportOnce } from "../motion/variants";
import { ChevronDown } from "./Icons";

/* Accessible accordion — pattern adapted from 21st.dev Base-UI accordion
   research: real <button> triggers with aria-expanded/aria-controls,
   labelled panels, smooth height animation, single item open at a time. */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const { faq } = site;

  return (
    <section className="section" id="faq">
      <div className="container faq__container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            {faq.eyebrow}
          </motion.p>
          <motion.h2 className="section-title" variants={fadeUp}>
            {faq.heading}
          </motion.h2>
          <motion.div className="faq__list" variants={fadeUp}>
            {faq.items.map((item, i) => {
              const open = openIndex === i;
              return (
                <div className="faq__item" key={item.q}>
                  <h3 className="faq__q">
                    <button
                      type="button"
                      className="faq__trigger"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      onClick={() => setOpenIndex(open ? null : i)}
                    >
                      <span>{item.q}</span>
                      <motion.span
                        className="faq__chevron"
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: reduced ? 0 : dur.micro }}
                      >
                        <ChevronDown />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${i}`}
                        className="faq__panel"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: dur.ui, ease: easeOut }}
                      >
                        <p className="faq__a">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
