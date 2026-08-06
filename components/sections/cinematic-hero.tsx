"use client";

import { useEffect, useRef, useState } from "react";

import { outlet } from "@/data/outlet";
import { anchors } from "@/lib/links";

/**
 * Cinematic hero.
 *
 * The footage itself belongs to `SiteBackdrop`, which scrubs one fixed canvas
 * behind the whole document. The hero is the window onto it: a tall scroll
 * track with nothing opaque in front, so the first 70% of the sequence plays
 * at full strength here before the content bands veil it.
 *
 * This component therefore owns only the scrims and the copy choreography.
 * Scroll drives CSS custom properties on refs, never React state, so nothing
 * re-renders while scrolling.
 */

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Headline holds until the halfway point, then clears for the interior. */
function copyOpacity(progress: number) {
  if (progress <= 0.5) return 1;
  return clamp(1 - (progress - 0.5) / 0.18, 0, 1);
}

export function CinematicHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [copyHidden, setCopyHidden] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = true;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;

      copyRef.current?.style.setProperty("--hero-copy-opacity", copyOpacity(progress).toFixed(3));
      cueRef.current?.style.setProperty(
        "--hero-cue-opacity",
        clamp((progress - 0.82) / 0.12, 0, 1).toFixed(3),
      );

      // One state change per threshold crossing, not per frame.
      setCopyHidden((previous) => {
        const next = progress > 0.72;
        return previous === next ? previous : next;
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(track);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      aria-label={`${outlet.name} — restaurant tour`}
      data-contrast-exempt
      className="relative"
    >
      {/* Shorter on phones so nobody is held in a long pinned sequence. */}
      <div id="hero-track" ref={trackRef} className="relative h-[160svh] md:h-[210svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/*
            A bottom-weighted scrim only. The spec forbids burying the footage
            under a heavy overlay, so this is just enough to hold the wordmark
            and CTA above AA against the brightest frame — measured by the
            audit's hero-scrim check rather than assumed.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink/70"
          />

          <div className="relative flex h-full flex-col justify-between">
            <div />

            <div
              ref={copyRef}
              inert={copyHidden || undefined}
              className="container-page pb-4 text-center"
              style={{
                opacity: "var(--hero-copy-opacity, 1)",
                transition: "opacity 120ms linear",
              }}
            >
              <h1 className="text-hero text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
                {outlet.name}
              </h1>

              <div className="mt-8 flex justify-center">
                <a
                  href={anchors.menu}
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-white px-7 text-base font-semibold text-ink no-underline transition-colors duration-200 hover:bg-white/90"
                >
                  Explore menu
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>

            <div
              ref={cueRef}
              aria-hidden="true"
              className="container-page pb-10 text-center text-sm text-white/85"
              style={{ opacity: "var(--hero-cue-opacity, 0)" }}
            >
              Inside the restaurant
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
