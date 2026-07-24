"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { menuHighlights } from "@/data/business";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { RevealStagger, RevealItem } from "@/components/motion-primitives";

/**
 * Scroll-driven 3D carousel: the signature food groups sit on the face of a
 * cylinder and rotate past the viewer as the section scrolls through.
 *
 * Distinct from MenuScrollStory's Z-depth dolly — this one rotates around the
 * Y axis, so the two signature moments don't read as the same trick twice.
 *
 * OWNERSHIP: GSAP owns the ring's rotation and the per-card counter-rotation.
 * SAFETY: the ring is only assembled once the effect runs, so no-JS and
 * reduced-motion both fall back to the plain stacked card grid below, which is
 * what the server renders. Desktop-only — the perspective maths needs the room.
 */
export function DishCarousel3D() {
  const reduced = useReducedMotionPreference();
  const [enable3D, setEnable3D] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);

  const items = menuHighlights;
  const count = items.length;
  // Radius so neighbouring cards sit shoulder-to-shoulder around the ring.
  const radius = 460;

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

  React.useEffect(() => {
    if (!enable3D) return;
    const section = sectionRef.current;
    const ring = ringRef.current;
    if (!section || !ring) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-ring-card]", ring);

      // Seat each card on the cylinder face.
      //
      // NOTE: GSAP composes transforms translate-then-rotate, the opposite of
      // raw CSS (which applies them left-to-right). So `z` alone would move
      // every card forward and then spin it about the centre, collapsing them
      // all onto the same spot. Pushing the transform-origin back by the radius
      // is what actually seats them around the ring here. (A hand-written CSS
      // version of this same effect needs `rotateY() translateZ()` instead.)
      cards.forEach((card, i) => {
        const angle = (360 / count) * i;
        gsap.set(card, {
          rotateY: angle,
          z: radius,
          transformOrigin: `50% 50% ${-radius}px`,
        });
      });

      // Rotate the whole ring as the section scrolls through the viewport.
      gsap.to(ring, {
        rotateY: -360 + 360 / count,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [enable3D, count, radius]);

  // Static fallback — server-rendered, and what mobile / reduced-motion keep.
  if (!enable3D) {
    return (
      <section aria-labelledby="showcase-heading" className="section-y bg-cream">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-tomato">
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
              Signature range
            </span>
            <h2
              id="showcase-heading"
              className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold text-charcoal"
            >
              Eight ways to eat with us
            </h2>
          </div>
          <RevealStagger
            as="ul"
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {items.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="rounded-feature border border-warm-border bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-charcoal/70">{item.description}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showcase-heading-3d"
      className="relative overflow-hidden bg-cream py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-tomato">
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
            Signature range
          </span>
          <h2
            id="showcase-heading-3d"
            className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold text-charcoal"
          >
            Eight ways to eat with us
          </h2>
          <p className="mt-3 text-charcoal/65">
            Scroll to turn the carousel through every part of the menu.
          </p>
        </div>
      </div>

      {/* 3D stage */}
      <div
        className="relative mt-16 h-[340px]"
        style={{ perspective: "1600px" }}
        aria-hidden="true"
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 h-0 w-[280px] -translate-x-1/2 -translate-y-1/2"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              data-ring-card
              // backfaceVisibility hides cards on the far side of the ring —
              // without it they show through mirrored (text renders backwards).
              style={{ backfaceVisibility: "hidden" }}
              className="absolute left-0 top-1/2 w-[280px] -translate-y-1/2 rounded-feature border border-warm-border bg-white p-6 shadow-elevated"
            >
              <h3 className="font-display text-lg font-semibold text-charcoal">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The ring is aria-hidden (it's a visual treatment of content that also
          exists as real text); this list keeps the same content available to
          assistive tech without duplicating it visually. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.title}>
            {item.title}: {item.description}
          </li>
        ))}
      </ul>
    </section>
  );
}
