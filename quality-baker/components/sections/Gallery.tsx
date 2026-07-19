"use client";

import { useEffect, useRef, useState } from "react";
import { PastryArt } from "@/components/PastryArt";
import { Reveal } from "@/components/Reveal";
import { useMotionTier } from "@/lib/motion";
import type { PastryVariant } from "@/components/PastryArt";

/**
 * Signature animation #3: the display-case parallax. Tiles sit in an
 * editorial masonry (varied spans, not a uniform grid) and drift at
 * slightly different speeds on scroll; a foreground sprinkle layer moves
 * fastest, like crumbs on the glass. Full tier only — lite/static get the
 * same composition, still.
 *
 * ⚠ The tiles are illustrated placeholders for photographs of the shop's
 * real cakes (network policy here blocks stock-photo CDNs — swap each
 * <PastryArt> for a next/image when the owner's photos arrive).
 */
const tiles: {
  variant: PastryVariant;
  label: string;
  span: string;
  speed: number;
}[] = [
  { variant: "tiered", label: "Tiered wedding & engagement cakes", span: "col-span-2 row-span-2", speed: 0 },
  { variant: "candles", label: "Birthday cakes, any theme", span: "", speed: -6 },
  { variant: "cupcake", label: "Cupcake boxes for parties", span: "", speed: 4 },
  { variant: "layer", label: "Classic cream layer cakes", span: "row-span-2", speed: -4 },
  { variant: "slice", label: "Pastry slices, daily fresh", span: "", speed: 6 },
  { variant: "croissant", label: "Small bakes & breads", span: "", speed: -8 },
];

export function Gallery() {
  const tier = useMotionTier();
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (i: number) => {
    setLightbox(i);
    dialogRef.current?.showModal();
  };
  const closeLightbox = () => {
    dialogRef.current?.close();
  };
  const stepLightbox = (dir: number) =>
    setLightbox((cur) =>
      cur === null ? null : (cur + dir + tiles.length) % tiles.length
    );

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
        section.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
          const speed = Number(el.dataset.speed || 0);
          if (!speed) return;
          gsap.fromTo(
            el,
            { yPercent: -speed },
            {
              yPercent: speed,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
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
    <section id="gallery" aria-label="Gallery" ref={sectionRef} className="relative overflow-hidden bg-noir text-cream">
      {/* Foreground sprinkle layer — fastest-moving, like crumbs on the case glass */}
      <div
        aria-hidden
        data-speed="12"
        className="pointer-events-none absolute inset-0 z-10 opacity-50"
      >
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <g fill="#a66a3f">
            <circle cx="8" cy="22" r="0.45" />
            <circle cx="93" cy="14" r="0.35" />
            <circle cx="22" cy="78" r="0.4" />
            <circle cx="70" cy="88" r="0.3" />
            <circle cx="55" cy="8" r="0.3" />
            <circle cx="85" cy="55" r="0.45" />
            <circle cx="14" cy="48" r="0.3" />
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
              From the counter
            </h2>
            <p className="max-w-[34ch] text-sm leading-relaxed text-cream/60">
              Hand-drawn for now — this case is waiting for photographs of the
              real thing, straight from the shop.
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid auto-rows-[9.5rem] grid-cols-2 gap-4 sm:auto-rows-[11rem] sm:gap-6 lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <li key={tile.variant} className={tile.span} data-speed={tile.speed}>
              <Reveal delay={0.04 * i} className="h-full">
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  aria-label={`View larger: ${tile.label}`}
                  className="frame flex h-full w-full cursor-zoom-in flex-col overflow-hidden rounded-2xl border border-caramel/15 bg-espresso/50 text-left"
                >
                  <PastryArt
                    variant={tile.variant}
                    className="min-h-0 w-full flex-1 object-contain"
                  />
                  <span className="block w-full border-t border-caramel/15 px-4 py-2.5 text-[0.8rem] text-cream/70">
                    {tile.label}
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* Lightbox: native <dialog> gives Escape + focus return for free */}
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Gallery image viewer"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") stepLightbox(1);
          if (e.key === "ArrowLeft") stepLightbox(-1);
        }}
      >
        {lightbox !== null && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
            <PastryArt
              variant={tiles[lightbox].variant}
              className="max-h-[70vh] w-full max-w-xl"
            />
            <p className="text-center text-cream/85">{tiles[lightbox].label}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label="Previous image"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cream/30 text-cream hover:border-caramel"
              >
                ←
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="min-h-12 cursor-pointer rounded-full border border-cream/30 px-6 text-cream hover:border-caramel"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                aria-label="Next image"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cream/30 text-cream hover:border-caramel"
              >
                →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
