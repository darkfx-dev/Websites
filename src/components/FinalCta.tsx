import { motion } from "framer-motion";
import { site, emailHref } from "../content/site";
import { fadeUp, staggerContainer, viewportOnce } from "../motion/variants";
import { GemMark } from "./Icons";

export function FinalCta() {
  const { finalCta } = site;
  return (
    <section className="section final-cta" id="contact">
      <div className="container final-cta__inner">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div className="final-cta__mark" variants={fadeUp} aria-hidden="true">
            <GemMark />
          </motion.div>
          <motion.h2 className="final-cta__title" variants={fadeUp}>
            {finalCta.heading}
          </motion.h2>
          <motion.p className="final-cta__body" variants={fadeUp}>
            {finalCta.body}
          </motion.p>
          <motion.div variants={fadeUp}>
            <a href={emailHref} className="btn btn-primary final-cta__btn">
              {finalCta.ctaLabel}
            </a>
          </motion.div>
          <motion.p className="final-cta__note" variants={fadeUp}>
            {finalCta.note}{" "}
            <a href={`mailto:${site.email}`} className="final-cta__email">
              {site.email}
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
