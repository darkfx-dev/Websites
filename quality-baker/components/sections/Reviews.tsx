"use client";

import { useEffect, useRef } from "react";
import { reviews } from "@/data/reviews";
import { Reveal } from "@/components/Reveal";
import { useMotionTier } from "@/lib/motion";
import { site } from "@/lib/site";

/**
 * Real Google reviews, verbatim. Full tier on wide screens: a pinned
 * horizontal drift scrubbed by scroll. Everywhere else: a stacked list.
 */
export function Reviews() {
  const tier = useMotionTier();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tier !== "full") return;
    if (!window.matchMedia("(min-width: 800px)").matches) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

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
        gsap.set(track, {
          display: "flex",
          flexWrap: "nowrap",
          width: "max-content",
        });
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      aria-label="Customer reviews"
      className="overflow-hidden bg-cream text-ink"
    >
      <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 md:pt-32">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
            In their words
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            {site.rating}★ across {site.reviewCount} Google reviews. These are
            quoted exactly as written.
          </p>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-20"
      >
        {reviews.map((review, i) => (
          <Reveal
            key={i}
            delay={0.06 * i}
            className={`md:min-w-[26rem] md:max-w-[26rem] ${
              i === reviews.length - 1 ? "md:col-span-2 md:justify-self-center" : ""
            }`}
          >
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-terracotta/15 bg-cream px-8 py-9 md:mr-2">
              <blockquote className="font-display text-2xl font-medium leading-snug text-ink">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-sm text-ink/60">
                <span aria-label="Rated 5 stars" className="tracking-[0.2em] text-caramel">
                  ★★★★★
                </span>
                {review.source}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
