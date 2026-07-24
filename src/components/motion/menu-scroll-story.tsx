"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { menuCategories } from "@/data/business";
import { sampleDishNames } from "@/data/menu";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { RevealStagger, RevealItem } from "@/components/motion-primitives";

type Stage = { title: string; slugs: string[] };

// Seven narrative stages. Each maps to one or more real categories in
// business.ts so counts are never invented; sample dishes come from menu.ts and
// are always framed as "a few favourites", never "the full menu".
const STAGES: Stage[] = [
  { title: "Pav Bhaji", slugs: ["pav-bhaji"] },
  { title: "South Indian", slugs: ["south-indian"] },
  { title: "Indo-Chinese", slugs: ["chinese"] },
  { title: "Fried Rice & Noodles", slugs: ["fried-rice-and-noodles"] },
  { title: "Pizza & Sandwiches", slugs: ["pizza", "sandwiches"] },
  { title: "Snacks & Chaats", slugs: ["snacks-and-chaats"] },
  {
    title: "Combos & Drinks",
    slugs: ["mpb-special-combos", "delightful-combos", "cold-drinks"],
  },
];

function useStageData() {
  return React.useMemo(
    () =>
      STAGES.map((stage) => {
        const count = stage.slugs.reduce((sum, slug) => {
          const cat = menuCategories.find((c) => c.slug === slug);
          return sum + (cat?.count ?? 0);
        }, 0);
        const samples = stage.slugs
          .flatMap((slug) => sampleDishNames(slug, 3))
          .slice(0, 3);
        return { title: stage.title, count, samples };
      }),
    []
  );
}

export function MenuScrollStory() {
  const reduced = useReducedMotionPreference();
  const stages = useStageData();

  // The pinned 3D scene is a desktop + motion-OK enhancement that requires JS.
  // It starts off, so SSR / no-JS / mobile / reduced-motion all render the
  // readable stacked version instead — content is never trapped behind it.
  const [enable3D, setEnable3D] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduced) {
      setEnable3D(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnable3D(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  // Build the pinned 3D Z-depth dolly only while the desktop scene is mounted.
  React.useEffect(() => {
    if (!enable3D) return;
    const scene = sceneRef.current;
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!scene || !section || !pin) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", scene);
      if (!panels.length) return;

      // Panel 0 starts at the focal plane; the rest wait deep in Z.
      panels.forEach((panel, i) => {
        gsap.set(panel, {
          z: i === 0 ? 0 : -900,
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.75,
          rotateY: i === 0 ? 0 : -12,
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2600",
          pin,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i > 0) {
          tl.to(
            panel,
            { z: 0, opacity: 1, scale: 1, rotateY: 0, duration: 1 },
            i
          );
        }
        if (i < panels.length - 1) {
          tl.to(
            panel,
            { z: 650, opacity: 0, scale: 1.15, rotateY: 10, duration: 1 },
            i + 1
          );
        }
      });
    }, sectionRef);

    // Recompute trigger points once fonts settle (text metrics shift layout).
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [enable3D]);

  // Stacked, fully-static content — SSR / no-JS / mobile / reduced-motion.
  if (!enable3D) {
    return (
      <section
        aria-labelledby="menu-universe-heading"
        className="relative isolate overflow-hidden bg-ivory py-20"
      >
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-tomato">
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
              Explore the menu universe
            </span>
            <h2
              id="menu-universe-heading"
              className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-charcoal"
            >
              Roughly 160 dishes, one kitchen
            </h2>
            <p className="mt-3 text-charcoal/70">
              A quick tour of the range — a few favourites from each part of the
              menu. See everything, and ask about anything, below.
            </p>
          </div>
          <RevealStagger
            as="ul"
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {stages.map((stage) => (
              <RevealItem
                as="li"
                key={stage.title}
                className="rounded-feature border border-warm-border bg-white p-6 shadow-card"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-charcoal">
                    {stage.title}
                  </h3>
                  <span className="font-display text-2xl font-semibold text-tomato">
                    {stage.count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-charcoal/70">
                  A few favourites: {stage.samples.join(", ")}.
                </p>
              </RevealItem>
            ))}
          </RevealStagger>
          <div className="mt-8 text-center">
            <a
              href="#menu-explorer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-button bg-saffron px-6 font-semibold text-charcoal transition-colors hover:bg-[#e79b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              View the full menu
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Desktop + motion-OK: the pinned 3D Z-depth dolly.
  return (
    <section ref={sectionRef} aria-label="Explore the menu universe" className="relative">
      <div
        ref={pinRef}
        className="relative isolate flex h-screen items-center justify-center overflow-hidden bg-ivory text-charcoal"
      >
        {/* Soft accent wash at the rear depth plane (replaces the old tawa
            illustration, which read as a dark blob on the white ground). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[520px] w-[520px] max-w-[70vw] rounded-full bg-saffron/10 blur-3xl" />
        </div>

        <div className="absolute left-0 right-0 top-16 z-20 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-tomato">
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
            Explore the menu universe
          </span>
        </div>
        <a
          href="#menu-explorer"
          className="absolute bottom-14 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-button border border-warm-border bg-white px-5 py-3 text-sm font-semibold text-charcoal shadow-card transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
        >
          View the full menu
          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </a>

        {/* 3D stage: perspective parent + preserve-3d scene of Z-stacked panels. */}
        <div className="relative z-10 h-full w-full" style={{ perspective: "1200px" }}>
          <div
            ref={sceneRef}
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {stages.map((stage) => (
              <div
                key={stage.title}
                data-panel
                className="absolute left-1/2 top-1/2 w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 text-center"
              >
                <p className="font-display text-lg font-semibold text-tomato">
                  {stage.count} dishes &amp; variations
                </p>
                <h3 className="mt-2 font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none text-charcoal">
                  {stage.title}
                </h3>
                <p className="mx-auto mt-5 max-w-md text-lg text-charcoal/70">
                  A few favourites: {stage.samples.join(", ")}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
