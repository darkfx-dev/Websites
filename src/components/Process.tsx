import { motion } from "framer-motion";
import { site } from "../content/site";
import { fadeUp, staggerContainer, viewportOnce } from "../motion/variants";

export function Process() {
  const { process } = site;
  return (
    <section className="section" id="process">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            {process.eyebrow}
          </motion.p>
          <motion.h2 className="section-title" variants={fadeUp}>
            {process.heading}
          </motion.h2>
          <motion.p className="section-lede" variants={fadeUp}>
            {process.lede}
          </motion.p>
          <ol className="steps">
            {process.steps.map((step, i) => (
              <motion.li key={step.title} className="step" variants={fadeUp}>
                <span className="step__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__body">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
