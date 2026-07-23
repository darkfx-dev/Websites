import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { business } from "../config/business";
import { imageReveal, sectionReveal, viewportOnce } from "../motion/variants";
import { ResponsiveMedia } from "./ResponsiveMedia";

/* Heritage + interior section. The interior photograph is confirmed genuine,
   so it is presented as the real salon with descriptive alt text. "2003" is
   used as a restrained typographic motif. The image reveals once with a
   gentle mask + settle, plus a small (~12px) scroll parallax; all disabled
   under reduced motion. */
export function HeritageStory() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const confirmed = business.visuals.interiorImageAuthenticityConfirmed;

  return (
    <section id="about" className="bg-ivory">
      <div className="container-page grid items-center gap-10 py-20 md:grid-cols-2 md:gap-14 md:py-28">
        {/* Copy */}
        <m.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="eyebrow text-forest-rich">Inside Parth Salon</p>
          <h2
            className="mt-4 text-forest"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
          >
            A local salon since{" "}
            <span className="relative whitespace-nowrap text-forest-rich">2003.</span>
          </h2>
          <p className="mt-6 max-w-[38ch] text-[1.05rem] text-muted-ink">
            Parth Salon has been part of Katargam since 2003. The website makes
            it simple to ask about current services, check appointment
            availability, call the salon, and find directions.
          </p>

          {/* 2003 as a restrained typographic motif */}
          <div className="mt-8 flex items-center gap-4" aria-hidden="true">
            <span
              className="font-display leading-none text-silver-ink"
              style={{ fontSize: "clamp(3.5rem, 9vw, 6rem)" }}
            >
              2003
            </span>
            <span className="hairline mt-2 flex-1" />
          </div>
        </m.div>

        {/* Interior photograph — brushed-silver frame, mask reveal */}
        <div ref={wrapRef} className="relative">
          <m.div
            className="overflow-hidden rounded-[10px] border border-silver p-1"
            style={{ y: reduced ? 0 : y }}
          >
            <m.div
              className="overflow-hidden rounded-[7px]"
              variants={reduced ? undefined : imageReveal}
              initial={reduced ? undefined : "hidden"}
              whileInView={reduced ? undefined : "visible"}
              viewport={viewportOnce}
            >
              <ResponsiveMedia
                src={business.visuals.interiorImage}
                alt="Interior of Parth Salon: forest-green leather styling chairs beneath arched mirrors in a softly-lit grey plaster room."
                width={business.visuals.interiorImageWidth}
                height={business.visuals.interiorImageHeight}
                sizes="(min-width: 768px) 44vw, 92vw"
                imgClassName="h-full w-full object-cover"
                style={{ objectPosition: "50% 62%" }}
              />
            </m.div>
          </m.div>
          {confirmed && (
            <p className="mt-3 text-[0.8rem] text-muted-ink">
              Inside Parth Salon, Katargam.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
