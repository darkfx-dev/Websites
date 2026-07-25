"use client";

import * as React from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { menuHighlights } from "@/data/business";
import {
  countForSelection,
  selectionFromHighlight,
  selectMenuGroup,
} from "@/lib/menu-selection";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { SectionHeading } from "@/components/section-heading";
import { RevealStagger, RevealItem } from "@/components/motion-primitives";
import { highlightIcon } from "./highlight-icons";
import { cn } from "@/lib/utils";

const CARD_HEIGHT = 236;
/**
 * Card width by viewport, so the ring also works in a narrower window rather
 * than only at full desktop width. Radius follows from it: circumference ≈
 * count × card width keeps the cards shoulder-to-shoulder around the ring.
 */
function cardWidthFor(viewportWidth: number): number {
  if (viewportWidth >= 1200) return 300;
  if (viewportWidth >= 900) return 268;
  return 236;
}
const RADIUS_RATIO = 1.43;
/**
 * Seconds for one full ambient revolution. The ring always turns under its own
 * power and scroll adds to that, rather than scroll being the only driver —
 * so the carousel still visibly rotates while the page is sitting still.
 */
const DRIFT_SECONDS = 30;

/**
 * The signature food groups arranged on a vertical cylinder that turns as the
 * page scrolls — a full 360° loop across the section's passage, so scrolling
 * carries you all the way around and back to where you started.
 *
 * Every card is a real <button>: choosing one filters the menu explorer below
 * to exactly that group's dishes and scrolls you to it (see `menu-selection`).
 *
 * OWNERSHIP: GSAP alone writes the ring's transform and the per-card opacity.
 * Framer Motion touches nothing here, so no two systems can fight over the same
 * property. CSS owns hover/focus feedback only.
 *
 * SAFETY: the ring is assembled client-side, so the server renders — and no-JS,
 * reduced-motion and narrow viewports keep — the plain bento grid below, which
 * is equally clickable. No content or action exists only inside the 3D view.
 */
export function MenuRing3D() {
  const reduced = useReducedMotionPreference();
  const [enable3D, setEnable3D] = React.useState(false);
  const [cardWidth, setCardWidth] = React.useState(300);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLUListElement>(null);
  /** Nudge the ring by ±1 card; assigned once the 3D effect is live. */
  const nudgeRef = React.useRef<((direction: number) => void) | null>(null);

  const items = menuHighlights;
  const count = items.length;
  const step = 360 / count;
  const radius = Math.round(cardWidth * RADIUS_RATIO);

  React.useEffect(() => {
    if (reduced) {
      setEnable3D(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setEnable3D(mq.matches);
      setCardWidth(cardWidthFor(window.innerWidth));
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  React.useEffect(() => {
    if (!enable3D) return;
    const section = sectionRef.current;
    const ring = ringRef.current;
    if (!section || !ring) return;

    let ticker: (() => void) | null = null;
    /** True while a pointer rests on the ring or a card holds focus. */
    let pointerOrFocusHeld = false;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-ring-card]", ring);
      if (cards.length === 0) return;

      // Seat each card on the cylinder face.
      //
      // NOTE: GSAP composes transforms translate-then-rotate, the opposite of
      // raw CSS (which applies them left-to-right). So `z` alone would move
      // every card forward and then spin it about the centre, collapsing them
      // all onto the same spot. Pushing the transform-origin back by the radius
      // is what actually seats them around the ring here, and `z` then recentres
      // the ring on the stage so the perspective reads symmetrically. (A
      // hand-written CSS version of this needs `rotateY() translateZ()`.)
      cards.forEach((card, i) => {
        gsap.set(card, {
          rotateY: step * i,
          z: radius,
          transformOrigin: `50% 50% ${-radius}px`,
        });
      });

      gsap.set(ring, { xPercent: -50, yPercent: -50 });

      // Three independent contributions to one rotation, so nothing overwrites
      // anything else: `scroll` is scrubbed by ScrollTrigger, `drift` is the
      // ambient spin, `focus` is the offset added by keyboard focus and the
      // prev/next controls.
      const state = { scroll: 0, drift: 0, focus: 0 };

      const setRotation = gsap.quickSetter(ring, "rotationY", "deg");
      const setOpacity = cards.map((card) => gsap.quickSetter(card, "opacity"));
      // Tracked so `data-*` attributes are only written when they change,
      // rather than on every frame.
      const facingAway = cards.map(() => false);
      let frontIndex = -1;

      const render = () => {
        const rotation = state.scroll + state.drift + state.focus;
        setRotation(rotation);

        let bestIndex = 0;
        let bestFacing = -Infinity;

        cards.forEach((card, i) => {
          // How squarely this card faces the viewer: 1 = dead ahead, 0 = edge
          // on, negative = turned away (and hidden by backface-visibility).
          const facing = Math.cos(((rotation + step * i) * Math.PI) / 180);
          setOpacity[i](0.3 + 0.7 * Math.max(0, facing));

          const away = facing <= 0.05;
          if (away !== facingAway[i]) {
            facingAway[i] = away;
            card.dataset.away = away ? "true" : "false";
          }

          if (facing > bestFacing) {
            bestFacing = facing;
            bestIndex = i;
          }
        });

        if (bestIndex !== frontIndex) {
          if (frontIndex >= 0) delete cards[frontIndex].dataset.front;
          cards[bestIndex].dataset.front = "true";
          frontIndex = bestIndex;
        }
      };

      // A full revolution across the section's passage through the viewport:
      // scroll all the way past and the ring has come right back around.
      gsap.to(state, {
        scroll: -360,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const drift = gsap.to(state, {
        drift: "-=360",
        duration: DRIFT_SECONDS,
        ease: "none",
        repeat: -1,
      });

      ticker = render;
      gsap.ticker.add(render);

      // Don't burn a frame callback (and an ambient tween) on a section that
      // isn't on screen — this sits well below the fold for most of the visit.
      const visibility = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!ticker) {
              ticker = render;
              gsap.ticker.add(render);
            }
            if (!pointerOrFocusHeld) drift.play();
          } else {
            if (ticker) {
              gsap.ticker.remove(ticker);
              ticker = null;
            }
            drift.pause();
          }
        },
        { rootMargin: "200px 0px" }
      );
      visibility.observe(section);

      // Rotate a card to the front. `turns` is signed, so we always take the
      // short way round rather than unwinding through the back of the ring.
      const rotateToFront = (index: number, duration: number) => {
        const current = state.scroll + state.drift + state.focus;
        const desired = -step * index;
        const delta = ((((desired - current) % 360) + 540) % 360) - 180;
        gsap.to(state, {
          focus: state.focus + delta,
          duration,
          ease: "power3.out",
          overwrite: true,
        });
      };

      nudgeRef.current = (direction: number) => {
        gsap.to(state, {
          focus: state.focus + direction * step,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        });
      };

      // Pause the ambient spin while the pointer is over it, so a card the user
      // is reaching for doesn't slide out from under the cursor. Tracked as a
      // flag as well, so the visibility observer doesn't restart the spin under
      // a pointer that's still resting on the ring.
      const hold = () => {
        pointerOrFocusHeld = true;
        drift.pause();
      };
      const release = () => {
        pointerOrFocusHeld = false;
        drift.play();
      };

      // Keyboard: bring the focused card round to the front, otherwise it would
      // be facing away and invisible when it takes focus.
      const onFocusIn = (event: FocusEvent) => {
        hold();
        const card = (event.target as HTMLElement).closest<HTMLElement>(
          "[data-ring-card]"
        );
        if (!card) return;
        const index = cards.indexOf(card);
        if (index >= 0) rotateToFront(index, 0.6);
      };
      const onFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (next && ring.contains(next)) return;
        release();
      };

      const stage = ring.parentElement;
      stage?.addEventListener("pointerenter", hold);
      stage?.addEventListener("pointerleave", release);
      ring.addEventListener("focusin", onFocusIn);
      ring.addEventListener("focusout", onFocusOut);

      return () => {
        visibility.disconnect();
        stage?.removeEventListener("pointerenter", hold);
        stage?.removeEventListener("pointerleave", release);
        ring.removeEventListener("focusin", onFocusIn);
        ring.removeEventListener("focusout", onFocusOut);
      };
    }, sectionRef);

    // Category text is web-font-dependent, so the trigger points can shift once
    // Fraunces/Manrope land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      // gsap.context() reverts tweens and ScrollTriggers, but the ticker
      // callback is outside its bookkeeping and has to come off by hand.
      if (ticker) gsap.ticker.remove(ticker);
      nudgeRef.current = null;
      ctx.revert();
    };
  }, [enable3D, count, step, radius]);

  const heading = (
    <SectionHeading
      eyebrow="Signature highlights"
      title="A menu built for every craving"
      description="Eight verified food groups spanning street-food classics, South Indian, Indo-Chinese and more. Pick one to jump straight to its dishes. Prices and availability are shared on WhatsApp."
    />
  );

  // Static fallback — server-rendered, and what mobile / reduced-motion keep.
  // Every card is the same button doing the same thing as its 3D counterpart.
  if (!enable3D) {
    return (
      <section id="menu" className="section-y scroll-mt-20 bg-cream">
        <div className="container-page">
          {heading}
          <RevealStagger
            as="ul"
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
          >
            {items.map((item, i) => (
              <RevealItem
                as="li"
                key={item.title}
                className={cn("min-w-0", i === 0 && "sm:col-span-2 lg:row-span-2")}
              >
                <HighlightButton item={item} featured={i === 0} />
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
      id="menu"
      className="relative scroll-mt-20 overflow-hidden bg-cream py-24"
    >
      <div className="container-page">{heading}</div>

      {/* 3D stage */}
      <div
        className="relative mt-14 h-[400px]"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Soft floor glow, purely decorative depth cue. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[76%] h-[190px] w-[860px] max-w-[92vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(242,169,59,0.22),rgba(242,169,59,0)_70%)] blur-[2px]"
        />

        <ul
          ref={ringRef}
          aria-label="Signature food groups"
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item) => (
            <li
              key={item.title}
              data-ring-card
              // backfaceVisibility hides cards on the far side of the ring —
              // without it they show through mirrored (text renders backwards).
              // `data-away` additionally stops them swallowing pointer events.
              style={{
                backfaceVisibility: "hidden",
                width: cardWidth,
                height: CARD_HEIGHT,
                marginLeft: -cardWidth / 2,
                marginTop: -CARD_HEIGHT / 2,
              }}
              className="group/card absolute left-0 top-0 data-[away=true]:pointer-events-none"
            >
              <HighlightButton item={item} onRing />
            </li>
          ))}
        </ul>

      </div>

      {/* Pointer affordance for browsing without scrolling. Kept outside the
          perspective stage so it can't be intersected by the turning cards. */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <RingNudgeButton
          direction={1}
          label="Turn the carousel to the previous food group"
          onNudge={() => nudgeRef.current?.(1)}
        />
        <p className="text-center text-sm text-charcoal/55">
          Scroll to turn the ring — or pick a group to see its dishes
        </p>
        <RingNudgeButton
          direction={-1}
          label="Turn the carousel to the next food group"
          onNudge={() => nudgeRef.current?.(-1)}
        />
      </div>
    </section>
  );
}

function RingNudgeButton({
  direction,
  label,
  onNudge,
}: {
  direction: number;
  label: string;
  onNudge: () => void;
}) {
  const Icon = direction > 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onNudge}
      aria-label={label}
      className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-warm-border bg-white text-charcoal shadow-card transition-colors hover:border-charcoal/40 hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

/**
 * One food group. Identical behaviour on the ring and in the fallback grid —
 * the only difference is the surface treatment, so the 3D view never becomes
 * the only way to reach a category.
 */
function HighlightButton({
  item,
  featured = false,
  onRing = false,
}: {
  item: (typeof menuHighlights)[number];
  featured?: boolean;
  onRing?: boolean;
}) {
  const Icon = highlightIcon(item.title);
  const selection = selectionFromHighlight(item);
  const dishCount = countForSelection(selection);

  return (
    <button
      type="button"
      onClick={() => selectMenuGroup(selection)}
      className={cn(
        "group flex h-full w-full flex-col rounded-feature border border-warm-border bg-white p-6 text-left shadow-card transition-[transform,border-color,box-shadow] duration-220 ease-standard hover:-translate-y-0.5 hover:border-saffron/60 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
        featured && "border-saffron/40 bg-saffron/10 lg:justify-between lg:p-8",
        // The frontmost ring card gets the accent, so the ring always has a
        // clear focal point as it turns.
        onRing &&
          "shadow-elevated group-data-[front=true]/card:border-saffron group-data-[front=true]/card:shadow-glow"
      )}
    >
      <span
        className={cn(
          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-card transition-colors",
          featured ? "bg-saffron text-charcoal" : "bg-ivory text-tomato",
          "group-hover:bg-saffron group-hover:text-charcoal"
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>

      <span className={cn("block", featured ? "mt-6 lg:mt-10" : "mt-5")}>
        <span
          className={cn(
            "block font-display font-semibold text-charcoal",
            featured ? "text-2xl lg:text-3xl" : "text-xl"
          )}
        >
          {item.title}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-charcoal/70">
          {item.description}
        </span>
      </span>

      <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-tomato">
        View {dishCount} {dishCount === 1 ? "dish" : "dishes"}
        <ArrowDown
          className="h-4 w-4 transition-transform duration-160 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
