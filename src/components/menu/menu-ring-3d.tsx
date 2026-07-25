"use client";

import * as React from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
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

type RingMetrics = {
  cardWidth: number;
  cardHeight: number;
  stageHeight: number;
  /** Smaller viewports get a shorter perspective so the depth still reads. */
  perspective: number;
};

/**
 * Ring dimensions by viewport, so the carousel works on a phone as well as a
 * full desktop. Radius follows from the card width: circumference ≈ count ×
 * card width keeps the cards shoulder-to-shoulder around the ring.
 */
function metricsFor(viewportWidth: number): RingMetrics {
  // Card height stays generous at every size: the content is a fixed stack
  // (icon, title, blurb, link) that needs ~232px however narrow the card is.
  // Narrow viewports get a *longer* perspective instead, because the front
  // card is magnified by perspective/(perspective - radius) — too short a
  // perspective and the magnified card runs off both edges of a phone screen.
  if (viewportWidth >= 1200)
    return { cardWidth: 300, cardHeight: 248, stageHeight: 404, perspective: 1500 };
  if (viewportWidth >= 900)
    return { cardWidth: 268, cardHeight: 248, stageHeight: 404, perspective: 1400 };
  if (viewportWidth >= 640)
    return { cardWidth: 236, cardHeight: 244, stageHeight: 392, perspective: 1300 };
  if (viewportWidth >= 430)
    return { cardWidth: 204, cardHeight: 240, stageHeight: 360, perspective: 1400 };
  if (viewportWidth >= 360)
    return { cardWidth: 184, cardHeight: 240, stageHeight: 352, perspective: 1300 };
  return { cardWidth: 164, cardHeight: 240, stageHeight: 344, perspective: 1200 };
}
const RADIUS_RATIO = 1.43;
/**
 * Seconds for one full ambient revolution. The ring always turns under its own
 * power and scroll adds to that, rather than scroll being the only driver —
 * so the carousel still visibly rotates while the page is sitting still.
 */
const DRIFT_SECONDS = 30;

/**
 * The signature food groups arranged on a vertical cylinder you turn directly:
 * drag it, swipe it, scroll it sideways, or use the arrow keys / prev-next
 * controls. It loops endlessly in both directions, and idles with a slow
 * ambient spin that steps aside as soon as you take hold of it.
 *
 * Deliberately NOT driven by vertical page scroll — turning the ring is its own
 * gesture, so it also works in contexts where the document doesn't scroll.
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
  const [metrics, setMetrics] = React.useState<RingMetrics>(() => metricsFor(1280));
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLUListElement>(null);
  /** Nudge the ring by ±1 card; assigned once the 3D effect is live. */
  const nudgeRef = React.useRef<((direction: number) => void) | null>(null);

  const items = menuHighlights;
  const count = items.length;
  const step = 360 / count;
  const radius = Math.round(metrics.cardWidth * RADIUS_RATIO);

  // Enabled at every width — the ring is sized down for phones rather than
  // withheld from them. Only reduced-motion (and no-JS) keep the flat grid.
  React.useEffect(() => {
    if (reduced) {
      setEnable3D(false);
      return;
    }
    const update = () => {
      setEnable3D(true);
      setMetrics(metricsFor(window.innerWidth));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduced]);

  React.useEffect(() => {
    if (!enable3D) return;
    const section = sectionRef.current;
    const ring = ringRef.current;
    if (!section || !ring) return;

    let ticker: (() => void) | null = null;
    /** True while a pointer rests on the ring or a card holds focus. */
    let pointerOrFocusHeld = false;
    /** True between pointerdown and pointerup while turning the ring by hand. */
    let dragging = false;

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
      // anything else: `drag` is the user turning the ring by hand (pointer
      // drag, swipe or horizontal wheel), `drift` is the ambient spin, `focus`
      // is the offset added by keyboard focus and the prev/next controls.
      const state = { drag: 0, drift: 0, focus: 0 };

      const setRotation = gsap.quickSetter(ring, "rotationY", "deg");
      const setOpacity = cards.map((card) => gsap.quickSetter(card, "opacity"));
      // Tracked so `data-*` attributes are only written when they change,
      // rather than on every frame.
      const facingAway = cards.map(() => false);
      let frontIndex = -1;

      const render = () => {
        const rotation = state.drag + state.drift + state.focus;
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
        const current = state.drag + state.drift + state.focus;
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
        // Never hand the ring back to the ambient spin mid-drag — the pointer
        // can leave the stage while still captured.
        if (dragging) return;
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

      const stage = ring.parentElement as HTMLElement | null;

      // ---- Turning the ring by hand: drag / swipe / horizontal wheel ----
      //
      // Rotation tracks the pointer roughly 1:1 with the front of the ring:
      // moving `radius` pixels sweeps one radian, so this is deg-per-pixel.
      const DEG_PER_PX = 180 / Math.PI / radius;
      let pointerId: number | null = null;
      let lastX = 0;
      let lastMoveTime = 0;
      let velocity = 0; // deg per ms, for the flick that follows release
      let movedBy = 0;

      const onPointerDown = (event: PointerEvent) => {
        // Left button / touch / pen only, and never start a drag on the
        // prev/next controls, which do their own thing.
        if (event.button !== 0) return;
        dragging = true;
        pointerId = event.pointerId;
        lastX = event.clientX;
        lastMoveTime = event.timeStamp;
        velocity = 0;
        movedBy = 0;
        hold();
        gsap.killTweensOf(state);
        stage?.setPointerCapture(event.pointerId);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        const dx = event.clientX - lastX;
        const dt = Math.max(1, event.timeStamp - lastMoveTime);
        lastX = event.clientX;
        lastMoveTime = event.timeStamp;
        movedBy += Math.abs(dx);
        const deltaDeg = dx * DEG_PER_PX;
        state.drag += deltaDeg;
        // Smoothed so one jittery sample can't throw the release flick.
        velocity = velocity * 0.7 + (deltaDeg / dt) * 0.3;
      };

      const endDrag = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        dragging = false;
        pointerId = null;
        if (stage?.hasPointerCapture(event.pointerId)) {
          stage.releasePointerCapture(event.pointerId);
        }
        // Carry the flick on with a decaying glide.
        const throwDeg = gsap.utils.clamp(-540, 540, velocity * 260);
        if (Math.abs(throwDeg) > 1) {
          gsap.to(state, {
            drag: state.drag + throwDeg,
            duration: 1.4,
            ease: "power3.out",
            overwrite: true,
          });
        }
        scheduleRelease();
        // A drag that travelled a real distance shouldn't also count as a click
        // on whichever card happened to be under the pointer.
        if (movedBy > 8) {
          const swallowClick = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          };
          stage?.addEventListener("click", swallowClick, {
            capture: true,
            once: true,
          });
          window.setTimeout(
            () => stage?.removeEventListener("click", swallowClick, true),
            0
          );
        }
      };

      // Horizontal wheel / trackpad swipe. Vertical wheel is deliberately left
      // alone so the page still scrolls normally over the ring; shift+wheel is
      // honoured because that is how a mouse without a tilt wheel scrolls
      // horizontally.
      const onWheel = (event: WheelEvent) => {
        const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
        if (!horizontal && !event.shiftKey) return;
        const delta = horizontal ? event.deltaX : event.deltaY;
        if (!delta) return;
        event.preventDefault();
        hold();
        gsap.killTweensOf(state);
        state.drag -= delta * DEG_PER_PX;
        scheduleRelease();
      };

      // Hand control back to the ambient spin a moment after the user stops.
      let releaseTimer = 0;
      const scheduleRelease = () => {
        window.clearTimeout(releaseTimer);
        releaseTimer = window.setTimeout(() => {
          if (!dragging) release();
        }, 2000);
      };

      // Arrow keys turn the ring when the stage itself holds focus.
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        nudgeRef.current?.(event.key === "ArrowLeft" ? 1 : -1);
      };

      stage?.addEventListener("pointerdown", onPointerDown);
      stage?.addEventListener("pointermove", onPointerMove);
      stage?.addEventListener("pointerup", endDrag);
      stage?.addEventListener("pointercancel", endDrag);
      stage?.addEventListener("wheel", onWheel, { passive: false });
      stage?.addEventListener("keydown", onKeyDown);
      stage?.addEventListener("pointerenter", hold);
      stage?.addEventListener("pointerleave", release);
      ring.addEventListener("focusin", onFocusIn);
      ring.addEventListener("focusout", onFocusOut);

      return () => {
        window.clearTimeout(releaseTimer);
        visibility.disconnect();
        stage?.removeEventListener("pointerdown", onPointerDown);
        stage?.removeEventListener("pointermove", onPointerMove);
        stage?.removeEventListener("pointerup", endDrag);
        stage?.removeEventListener("pointercancel", endDrag);
        stage?.removeEventListener("wheel", onWheel);
        stage?.removeEventListener("keydown", onKeyDown);
        stage?.removeEventListener("pointerenter", hold);
        stage?.removeEventListener("pointerleave", release);
        ring.removeEventListener("focusin", onFocusIn);
        ring.removeEventListener("focusout", onFocusOut);
      };
    }, sectionRef);

    return () => {
      // gsap.context() reverts its tweens, but the ticker callback is outside
      // its bookkeeping and has to come off by hand.
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

      {/* 3D stage. Focusable and labelled because it is a real control: you
          turn the ring by dragging it, swiping, or scrolling it sideways.
          `touch-action: pan-y` keeps vertical page scrolling working on touch
          while horizontal drags come to us instead of the browser. */}
      <div
        role="group"
        aria-label="Food group carousel — drag sideways or use the arrow keys to turn it"
        tabIndex={0}
        className="relative mt-12 cursor-grab select-none touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-charcoal active:cursor-grabbing sm:mt-14"
        style={{
          height: metrics.stageHeight,
          perspective: `${metrics.perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
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
                width: metrics.cardWidth,
                height: metrics.cardHeight,
                marginLeft: -metrics.cardWidth / 2,
                marginTop: -metrics.cardHeight / 2,
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
      {/* On a narrow screen the hint is too long to sit between the buttons, so
          it drops to its own line underneath them rather than wrapping into
          the middle of the row. */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <RingNudgeButton
          className="order-1"
          direction={1}
          label="Turn the carousel to the previous food group"
          onNudge={() => nudgeRef.current?.(1)}
        />
        <RingNudgeButton
          className="order-2 sm:order-3"
          direction={-1}
          label="Turn the carousel to the next food group"
          onNudge={() => nudgeRef.current?.(-1)}
        />
        <p className="order-3 w-full text-center text-sm text-charcoal/55 sm:order-2 sm:w-auto">
          Drag or swipe sideways to turn the ring — pick a group to see its dishes
        </p>
      </div>
    </section>
  );
}

function RingNudgeButton({
  direction,
  label,
  onNudge,
  className,
}: {
  direction: number;
  label: string;
  onNudge: () => void;
  className?: string;
}) {
  const Icon = direction > 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onNudge}
      aria-label={label}
      className={cn(
        "pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-warm-border bg-white text-charcoal shadow-card transition-colors hover:border-charcoal/40 hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
        className
      )}
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
        "group flex h-full w-full flex-col overflow-hidden rounded-feature border border-warm-border bg-white text-left shadow-card transition-[transform,border-color,box-shadow] duration-220 ease-standard hover:-translate-y-0.5 hover:border-saffron/60 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
        onRing ? "p-5" : "p-6",
        featured && "border-saffron/40 bg-saffron/10 lg:justify-between lg:p-8",
        // The frontmost ring card gets the accent, so the ring always has a
        // clear focal point as it turns.
        onRing &&
          "shadow-elevated group-data-[front=true]/card:border-saffron group-data-[front=true]/card:shadow-glow"
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-card transition-colors",
          onRing ? "h-10 w-10" : "h-12 w-12",
          featured ? "bg-saffron text-charcoal" : "bg-ivory text-tomato",
          "group-hover:bg-saffron group-hover:text-charcoal"
        )}
      >
        <Icon
          className={cn(onRing ? "h-5 w-5" : "h-6 w-6")}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </span>

      {/* overflow-hidden matters: this block is allowed to shrink inside the
          card's fixed height, and without it the clamped lines spill out and
          render on top of the "View N dishes" link below. */}
      <span
        className={cn(
          "block min-h-0 overflow-hidden",
          featured ? "mt-6 lg:mt-10" : onRing ? "mt-4" : "mt-5"
        )}
      >
        {/* NOTE: no `block` alongside `line-clamp-*`. Tailwind's line-clamp
            needs `display: -webkit-box`, and `block` overrides it in the
            generated stylesheet — the clamp then silently does nothing. */}
        <span
          className={cn(
            "font-display font-semibold text-charcoal",
            featured
              ? "block text-2xl lg:text-3xl"
              : onRing
                ? "line-clamp-2 text-lg leading-tight"
                : "block text-xl"
          )}
        >
          {item.title}
        </span>
        <span
          className={cn(
            "text-charcoal/70",
            onRing
              // Two lines, not three: on a narrow card the title already wraps
              // to two lines, and a third blurb line pushes the stack past the
              // card's fixed height and over the link below.
              ? "mt-1.5 line-clamp-2 text-xs leading-snug"
              : "mt-2 block text-sm leading-relaxed"
          )}
        >
          {item.description}
        </span>
      </span>

      <span
        className={cn(
          "mt-auto flex shrink-0 items-center gap-1.5 font-semibold text-tomato",
          onRing ? "pt-3 text-xs" : "pt-4 text-sm"
        )}
      >
        View {dishCount} {dishCount === 1 ? "dish" : "dishes"}
        <ArrowDown
          className="h-4 w-4 transition-transform duration-160 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
