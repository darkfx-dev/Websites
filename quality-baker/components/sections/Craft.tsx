"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/Reveal";
import { useMotionTier } from "@/lib/motion";

/**
 * The three things every review mentions, in the reviewers' own themes:
 * design, taste, care. On the full tier the section pins and the statements
 * take turns; on lite/static they stack with simple reveals.
 */
const statements = [
  {
    title: "The design comes first.",
    body: "Tell us the theme, the colour, the age, the joke only your family gets. We sketch the cake with you before the oven ever comes on.",
  },
  {
    title: "Taste is not negotiable.",
    body: "Real butter, fresh cream, ganache made slowly. A cake that photographs well but eats badly is a failed cake — ours have to do both.",
  },
  {
    title: "Kindness is part of the recipe.",
    body: "Reviewers keep mentioning our behaviour, and we take that as seriously as the baking. By your second visit, we'll greet you by name.",
  },
];

export function Craft() {
  const tier = useMotionTier();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (tier !== "full") return;
    const section = sectionRef.current;
    if (!section) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const slides = gsap.utils.toArray<HTMLElement>(".craft-slide");
        // Stack the slides on top of each other only when pinning is active,
        // so the no-JS / lite layout stays a normal document flow.
        gsap.set(section.querySelector(".craft-stage"), {
          display: "grid",
        });
        slides.forEach((s) => {
          gsap.set(s, { gridArea: "1 / 1", opacity: 0, y: 44 });
        });
        gsap.set(slides[0], { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.6,
          },
        });

        slides.forEach((slide, i) => {
          if (i === 0) {
            tl.to(slide, { opacity: 1, y: 0, duration: 0.5 });
          } else {
            tl.to(slides[i - 1], { opacity: 0, y: -44, duration: 0.5 }, "+=0.5")
              .to(slide, { opacity: 1, y: 0, duration: 0.5 }, "<+=0.15");
          }
        });
        tl.to({}, { duration: 0.6 }); // hold on the last statement
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [tier]);

  const pinned = tier === "full";

  return (
    <section
      ref={sectionRef}
      id="story" aria-label="Our craft"
      className={`bg-cream text-ink ${pinned ? "flex min-h-svh items-center" : ""}`}
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <p className="font-display text-lg italic text-cocoa">
            What 95 reviews keep telling us
          </p>
        </Reveal>

        <div className={`craft-stage mt-10 ${pinned ? "" : "space-y-16"}`}>
          {statements.map((s, i) => (
            <div key={i} className="craft-slide">
              {pinned ? (
                <Statement {...s} />
              ) : (
                <Reveal delay={0.05 * i}>
                  <Statement {...s} />
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statement({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-[clamp(2rem,5.5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.015em]">
        {title}
      </h2>
      <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink/75">
        {body}
      </p>
    </div>
  );
}
