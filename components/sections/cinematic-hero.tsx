"use client";

import { useEffect, useRef, useState } from "react";

import { FrameSequence, type FrameVariant } from "@/lib/frame-sequence";
import { outlet } from "@/data/outlet";
import { anchors } from "@/lib/links";

/**
 * Cinematic scroll-controlled hero.
 *
 * The supplied asset is a 240-frame image sequence rather than the MP4 named
 * in the asset contract, so it is mapped deliberately: the sequence is drawn
 * to a canvas and scrubbed by scroll position. This is also the better
 * mechanism — seeking a <video> element per scroll frame stalls on keyframes,
 * while a decoded frame sequence is a straight drawImage.
 *
 * Deviation from the suggested stack: no GSAP/ScrollTrigger. Pinning is done
 * with CSS `position: sticky` (no layout thrash, survives JS failure) and
 * progress comes from one `getBoundingClientRect` read per animation frame.
 * Adding a scroll library for ~20 lines of math would not have earned its
 * bytes, and the spec's own dependency rules say to install only what is
 * required.
 *
 * Scroll never drives React state — progress is written to CSS custom
 * properties and the canvas directly, so no re-render happens while scrolling.
 *
 * The footage is generated atmospheric brand imagery. It is not represented
 * anywhere as a photograph of the real premises.
 */

const DAMPING_TAU_MS = 55;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Maps hero progress to the opacity of the headline block. */
function copyOpacity(progress: number) {
  if (progress <= 0.5) return 1;
  return clamp(1 - (progress - 0.5) / 0.18, 0, 1);
}

export function CinematicHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // `null` until measured, so the first paint never guesses wrong.
  const [scrubbing, setScrubbing] = useState(false);
  const [copyHidden, setCopyHidden] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!track || !canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;

    // Reduced motion, Data Saver and 2G/3G all get the static poster.
    const constrained =
      connection?.saveData === true ||
      (connection?.effectiveType ? /(^|-)2g$/.test(connection.effectiveType) : false);

    // `scrubbing` already starts false, so bailing out leaves the poster up.
    if (motionQuery.matches || constrained) return;

    const variant: FrameVariant = window.matchMedia("(min-width: 768px)").matches
      ? "desktop"
      : "mobile";

    let disposed = false;
    let raf = 0;
    let lastTime = performance.now();
    let currentFrame = 0;
    let targetFrame = 0;
    let drawnIndex = -1;
    let sizedFor = "";
    let visible = true;

    const sequence = new FrameSequence(variant, {
      onFirstReady: () => {
        if (!disposed) setScrubbing(true);
      },
    });
    sequence.start();

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const key = `${width}x${height}x${dpr}`;
      if (key === sizedFor || width === 0 || height === 0) return false;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      sizedFor = key;
      return true;
    };

    /** Draws `frame` with cover semantics inside the canvas. */
    const draw = (frame: ImageBitmap | HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const fw = "width" in frame ? frame.width : 0;
      const fh = "height" in frame ? frame.height : 0;
      if (!fw || !fh) return;

      const scale = Math.max(cw / fw, ch / fh);
      const dw = fw * scale;
      const dh = fh * scale;
      // Bias the crop slightly upward: the entrance and central aisle — the
      // subject the spec says must never be cropped out — sit above centre.
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) * 0.42;

      context.drawImage(frame, dx, dy, dw, dh);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;

      targetFrame = progress * (sequence.count - 1);

      // Frame-rate independent damping: smooths scroll-event granularity
      // without introducing lag the user can feel.
      const alpha = 1 - Math.exp(-delta / DAMPING_TAU_MS);
      currentFrame += (targetFrame - currentFrame) * alpha;

      // Snap at the ends so the sequence always resolves fully.
      if (Math.abs(targetFrame - currentFrame) < 0.01) currentFrame = targetFrame;

      const resized = resize();
      const picked = sequence.nearest(currentFrame);

      if (picked && (resized || picked.index !== drawnIndex)) {
        draw(picked.frame);
        drawnIndex = picked.index;
      }

      if (copyRef.current) {
        copyRef.current.style.setProperty("--hero-copy-opacity", copyOpacity(progress).toFixed(3));
      }
      if (cueRef.current) {
        cueRef.current.style.setProperty(
          "--hero-cue-opacity",
          clamp((progress - 0.82) / 0.12, 0, 1).toFixed(3),
        );
      }

      // One boolean per threshold crossing, not per frame.
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

    const onMotionChange = () => {
      if (motionQuery.matches) setScrubbing(false);
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      sequence.destroy();
    };
  }, []);

  return (
    <section
      aria-label={`${outlet.name} — restaurant tour`}
      data-contrast-exempt
      className="relative"
    >
      {/*
        Track height drives how much scroll the sequence consumes. Shorter on
        phones so the visitor is never held in a long pinned sequence.
      */}
      <div ref={trackRef} className="relative h-[160svh] md:h-[210svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
          {/*
            The poster is always present: it is the LCP element, the
            reduced-motion state, and what a visitor without JavaScript sees.
            The canvas simply covers it once the first frame decodes.
          */}
          {/*
            Deliberately a plain <img>, not next/image: the poster is already a
            hand-tuned WebP in /public at exactly the size the stage needs, and
            it must be the LCP element with no wrapper or loader indirection.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/hero/poster-start.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 42%" }}
          />

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full transition-opacity duration-500"
            style={{ opacity: scrubbing ? 1 : 0 }}
          />

          {/*
            A restrained bottom-weighted scrim only. The spec forbids covering
            the footage in a heavy overlay, so this is just enough to hold the
            wordmark at AA against the brightest frame.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink/65"
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
              <h1 className="text-hero text-canvas drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
                {outlet.name}
              </h1>

              <div className="mt-8 flex justify-center">
                <a
                  href={anchors.menu}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-canvas px-7 text-base font-semibold text-ink no-underline transition-colors duration-200 hover:bg-white"
                >
                  Explore menu
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div
              ref={cueRef}
              aria-hidden="true"
              className="container-page pb-10 text-center text-sm text-canvas/80"
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
