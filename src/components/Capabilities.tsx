import { motion } from "framer-motion";
import { site } from "../content/site";
import { fadeUp, staggerContainer, viewportOnce } from "../motion/variants";
import { Icon } from "./Icons";

export function Capabilities() {
  const { capabilities } = site;
  return (
    <section className="section" id="capabilities">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            {capabilities.eyebrow}
          </motion.p>
          <motion.h2 className="section-title" variants={fadeUp}>
            {capabilities.heading}
          </motion.h2>
          <motion.p className="section-lede" variants={fadeUp}>
            {capabilities.lede}
          </motion.p>
          <div className="cards-grid">
            {capabilities.items.map((item) => (
              <motion.article key={item.title} className="card" variants={fadeUp}>
                <span className="card__icon">
                  <Icon name={item.icon} />
                </span>
                <h3 className="card__title">{item.title}</h3>
                <p className="card__body">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
