import { motion, useReducedMotion } from "framer-motion";
import { site, emailHref } from "../content/site";
import { fadeUp, staggerContainer } from "../motion/variants";

export function Hero() {
  const reduced = useReducedMotion();
  const { hero } = site;

  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <motion.div
          className="hero__content"
          variants={reduced ? undefined : staggerContainer}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          <motion.p className="eyebrow" variants={reduced ? undefined : fadeUp}>
            {hero.eyebrow}
          </motion.p>
          <motion.h1 className="hero__title" variants={reduced ? undefined : fadeUp}>
            {hero.heading}
          </motion.h1>
          <motion.p className="hero__lede" variants={reduced ? undefined : fadeUp}>
            {hero.lede}
          </motion.p>
          <motion.div className="hero__actions" variants={reduced ? undefined : fadeUp}>
            <a href={emailHref} className="btn btn-primary">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </motion.div>
          <motion.p className="hero__context" variants={reduced ? undefined : fadeUp}>
            {hero.contextLine}
          </motion.p>
        </motion.div>
        {/* Right column is intentionally empty on desktop — the fixed
            WebGL sculpture occupies this space visually */}
        <div className="hero__visual-space" aria-hidden="true" />
      </div>
      <a href="#capabilities" className="hero__scroll-hint" aria-label="Scroll to capabilities">
        <span aria-hidden="true">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4v16m0 0 6-6m-6 6-6-6" />
        </svg>
      </a>
    </section>
  );
}
