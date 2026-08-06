"use client";

import { useEffect, useRef, useState } from "react";

import { FrameSequence, type FrameVariant } from "@/lib/frame-sequence";

/**
 * Site-wide cinematic backdrop.
 *
 * One fixed canvas sits behind the entire document and scrubs the restaurant
 * footage against total page scroll, so the whole site reads as one continuous
 * move through the room rather than a video that stops after the hero.
 *
 * Two-phase mapping. A single linear map across a long document would advance
 * roughly one frame per 100px of scroll, which reads as stepping. Instead the
 * hero consumes the first 70% of the sequence at high density — that is where
 * the footage is unveiled and the detail has to hold up — and the remaining
 * 30% drifts slowly behind the content below, where the veil makes stepping
 * imperceptible.
 *
 * Legibility is preserved by the sections themselves: each content band
 * carries its own near-opaque surface (`.veil`), so the footage stays a faint
 * moving texture behind text and full strength only in the hero and the
 * dedicated reveal bands. The contrast harness measures the real composited
 * pixels, so this is verified rather than assumed.
 *
 * Scroll never touches React state — progress is written straight to the
 * canvas. One rAF loop, one getBoundingClientRect read per frame.
 */

const DAMPING_TAU_MS = 60;
/** Share of the sequence spent inside the hero. */
const HERO_SHARE = 0.7;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SiteBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;

    const constrained =
      connection?.saveData === true ||
      (connection?.effectiveType ? /(^|-)2g$/.test(connection.effectiveType) : false);

    // Reduced motion, Data Saver and 2G keep the static poster underneath.
    if (motionQuery.matches || constrained) return;

    const variant: FrameVariant = window.matchMedia("(min-width: 768px)").matches
      ? "desktop"
      : "mobile";

    let disposed = false;
    let raf = 0;
    let lastTime = performance.now();
    let currentFrame = 0;
    let drawnIndex = -1;
    let sizedFor = "";

    const sequence = new FrameSequence(variant, {
      onFirstReady: () => {
        if (!disposed) setActive(true);
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

    const draw = (frame: ImageBitmap | HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const fw = frame.width;
      const fh = frame.height;
      if (!fw || !fh) return;

      const scale = Math.max(cw / fw, ch / fh);
      const dw = fw * scale;
      const dh = fh * scale;
      // The entrance and central aisle sit above centre; bias the crop up so
      // the subject is never the part that gets cut.
      context.drawImage(frame, (cw - dw) / 2, (ch - dh) * 0.42, dw, dh);
    };

    /** Total-document progress split across the hero and everything after it. */
    const sequenceProgress = () => {
      const hero = document.getElementById("hero-track");
      const heroSpan = hero ? hero.offsetHeight - window.innerHeight : 0;
      const scrolled = window.scrollY;

      if (heroSpan > 0 && scrolled <= heroSpan) {
        return (scrolled / heroSpan) * HERO_SHARE;
      }

      const rest = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight - Math.max(0, heroSpan),
      );
      const after = clamp((scrolled - Math.max(0, heroSpan)) / rest, 0, 1);
      return HERO_SHARE + after * (1 - HERO_SHARE);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      const target = clamp(sequenceProgress(), 0, 1) * (sequence.count - 1);

      // Frame-rate independent damping: smooths scroll granularity without
      // adding lag the user can feel.
      const alpha = 1 - Math.exp(-delta / DAMPING_TAU_MS);
      currentFrame += (target - currentFrame) * alpha;
      if (Math.abs(target - currentFrame) < 0.01) currentFrame = target;

      const resized = resize();
      const picked = sequence.nearest(currentFrame);
      if (picked && (resized || picked.index !== drawnIndex)) {
        draw(picked.frame);
        drawnIndex = picked.index;
      }
    };

    raf = requestAnimationFrame(tick);

    const onMotionChange = () => {
      if (motionQuery.matches) setActive(false);
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      motionQuery.removeEventListener("change", onMotionChange);
      sequence.destroy();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-ink">
      {/*
        The poster is the first paint, the reduced-motion state and the
        no-JavaScript state. The canvas covers it once a frame decodes.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero/poster-start.webp"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 42%" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: active ? 1 : 0 }}
      />
    </div>
  );
}
