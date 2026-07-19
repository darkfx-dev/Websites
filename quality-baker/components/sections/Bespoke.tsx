"use client";

import { useEffect, useRef } from "react";
import { GlowButton } from "@/components/GlowButton";
import { HeroCake } from "@/components/HeroCake";
import { useMotionTier } from "@/lib/motion";

/**
 * The cinematic scroll sequence: a title-sequence beat between the menu and
 * the studio. A line-drawn celebration cake turns slowly out of darkness
 * while warm vanilla light finds its form; three short text beats hand over
 * to the studio CTA. Built with transforms and opacity on layered SVG/DOM —
 * deliberately not WebGL: same cinematic read, none of the 3D payload or
 * mid-range-phone risk (the spec's fallback clause). Full tier pins and
 * scrubs; lite/static show the final lit frame.
 */
const beats = [
  "Tell us the occasion.",
  "We sketch it with you.",
  "Made for the day itself.",
];

export function Bespoke() {
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
        const cake = section.querySelector(".seq-cake");
        const light = section.querySelector(".seq-light");
        const lines = gsap.utils.toArray<HTMLElement>(".seq-beat");
        const cta = section.querySelector(".seq-cta");

        gsap.set(cake, { rotate: -10, scale: 0.82, opacity: 0.25 });
        gsap.set(light, { opacity: 0 });
        gsap.set(lines, { opacity: 0, y: 30 });
        gsap.set(cta, { opacity: 0, y: 24 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.6,
          },
        });

        tl.to(cake, { rotate: 0, scale: 1, opacity: 1, duration: 1.6 }, 0)
          .to(light, { opacity: 1, duration: 1.6 }, 0.4);
        lines.forEach((lineEl, i) => {
          tl.to(lineEl, { opacity: 1, y: 0, duration: 0.4 }, 0.3 + i * 0.55)
            .to(
              lineEl,
              { opacity: i === lines.length - 1 ? 1 : 0, y: i === lines.length - 1 ? 0 : -24, duration: 0.35 },
              0.75 + i * 0.55
            );
        });
        tl.to(cta, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
        tl.to({}, { duration: 0.4 });
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
      aria-label="Bespoke celebration cakes"
      className={`relative overflow-hidden bg-noir text-porcelain ${
        pinned ? "flex min-h-svh items-center" : ""
      }`}
    >
      {/* Vanilla light that finds the cake (static and lit on calm tiers) */}
      <div
        aria-hidden
        className="seq-light pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 62% 45%, rgb(243 228 200 / 0.16), rgb(166 106 63 / 0.07) 55%, transparent 78%)",
        }}
      />
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            Bespoke celebration cakes
          </p>
          <div className={pinned ? "relative mt-6 h-40" : "mt-6 space-y-3"}>
            {beats.map((b) => (
              <p
                key={b}
                className={`seq-beat font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-medium leading-tight ${
                  pinned ? "absolute inset-x-0 top-0" : ""
                }`}
              >
                {b}
              </p>
            ))}
          </div>
          <div className="seq-cta mt-8">
            <p className="mb-6 max-w-[46ch] text-lg leading-relaxed text-porcelain/70">
              Weddings, milestone birthdays, and ordinary afternoons worth
              celebrating. Bring the idea — the sketch comes free.
            </p>
            <GlowButton href="#studio">Build Your Cake</GlowButton>
          </div>
        </div>
        <div aria-hidden className="seq-cake mx-auto w-full max-w-[420px]">
          <HeroCake className="w-full" />
        </div>
      </div>
    </section>
  );
}
