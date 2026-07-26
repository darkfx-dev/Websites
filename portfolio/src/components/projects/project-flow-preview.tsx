"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { MediaRequirement } from "@/components/ui/content";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { cn } from "@/lib/utils";

const KIND_LABEL = {
  "input-processing-result": ["Input", "Processing", "Result"],
  "overview-detail-action": ["Overview", "Detail", "Action"],
} as const;

/**
 * Animated walk-through of a real interface, one screen at a time.
 *
 * Rules this enforces rather than assumes:
 *  - it only ever renders screenshots supplied in `portfolio.ts`. With fewer
 *    than three it renders a media requirement instead of inventing a UI;
 *  - it advances once and stops, rather than looping forever beside the text
 *    someone is trying to read. Replay is a deliberate action;
 *  - it pauses when scrolled out of view, so nothing animates off screen;
 *  - under reduced motion it shows the screens without transitions, and the
 *    controls still work;
 *  - the full sequence is described in text for anyone who cannot see it.
 */
export function ProjectFlowPreview({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const flow = project.flow;
  const screens = flow?.screens ?? [];
  const enabled = screens.length >= 3;

  const [index, setIndex] = useState(0);
  const [autoplayed, setAutoplayed] = useState(false);
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();

  const last = screens.length - 1;
  const go = useCallback(
    (next: number) => setIndex(Math.min(Math.max(next, 0), Math.max(last, 0))),
    [last]
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, [enabled]);

  // Advance once, the first time it is properly on screen. Never loops.
  useEffect(() => {
    if (!enabled || !inView || autoplayed || reduced) return;
    if (index >= last) {
      setAutoplayed(true);
      return;
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), 1500);
    return () => window.clearTimeout(t);
  }, [enabled, inView, autoplayed, index, last, reduced]);

  if (!enabled) {
    return (
      <MediaRequirement
        className={cn("aspect-[16/10]", className)}
        title={`${project.name}: interface screens not yet supplied`}
        detail="Add three real screenshots for this project in src/data/portfolio.ts to enable the flow walk-through. No interface is invented here."
      />
    );
  }

  const current = screens[index];
  const stepLabels = KIND_LABEL[flow!.kind];

  return (
    <figure ref={hostRef} className={cn("m-0", className)}>
      {/* Browser-style frame. Decorative chrome is hidden from assistive tech. */}
      <div className="liquid-glass overflow-hidden rounded-lg">
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5 border-b border-line px-4 py-3"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.16)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.09)]" />
          <span className="mono ml-3 truncate text-xs text-ink-faint">
            {project.name}
          </span>
        </div>

        {/* aspect-ratio reserves the box so advancing never shifts layout. */}
        <div className="relative aspect-[16/10] w-full bg-[rgba(255,255,255,0.02)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, x: 24 }}
              animate={reduced ? {} : { opacity: 1, x: 0 }}
              exit={reduced ? {} : { opacity: 0, x: -24 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {current ? (
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover object-top"
                  // Below the fold in every layout this is used in.
                  loading="lazy"
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <figcaption className="mt-4">
        {/* Step indicator: label + position, never colour alone. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono text-xs text-ink-faint">
            <span className="text-accent">{stepLabels[Math.min(index, 2)]}</span>
            <span aria-hidden="true"> · </span>
            step {index + 1} of {screens.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              className="grid h-11 w-11 place-items-center rounded-sm border border-line text-ink-soft transition-colors hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Previous screen"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === last}
              className="grid h-11 w-11 place-items-center rounded-sm border border-line text-ink-soft transition-colors hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Next screen"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setAutoplayed(true);
              }}
              className="grid h-11 w-11 place-items-center rounded-sm border border-line text-ink-soft transition-colors hover:border-accent hover:text-ink"
              aria-label="Replay from the first screen"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Announced on change, so the caption is not visual-only. */}
        <p aria-live="polite" className="mt-3 text-sm text-ink-soft">
          {current?.caption}
        </p>

        <p className="sr-only">
          Interface walk-through for {project.name}. {flow!.summary}
        </p>
      </figcaption>
    </figure>
  );
}
