"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Scroll-controlled 3D category ring.
 *
 * One DOM list, three presentations. The buttons are always the same seven
 * semantic controls in document order; CSS lays them out as a horizontal
 * snap rail (mobile) or a grid (reduced motion), and JavaScript positions
 * them on an ellipse only when the viewport and motion preference allow. That
 * avoids the duplicate decorative controls the brief warns about — a keyboard
 * user meets each category exactly once in every mode.
 *
 * Geometry: each card sits at an angle around an ellipse. Horizontal position
 * is the sine of that angle, depth the cosine; scale, opacity and stacking
 * follow depth. Cards are never rotated about Y, so a card's face always
 * points at the camera and its text can never appear mirrored or upside down
 * — the ring moves the cards, it does not spin them.
 *
 * Rotation is written straight to `transform` in a rAF loop. Scroll never
 * drives React state; the only state change is the selected index, and only
 * when it actually crosses to a new card.
 */

export type RingCategory = {
  id: string;
  label: string;
  count: number;
};

const TWO_PI = Math.PI * 2;

type Props = {
  categories: readonly RingCategory[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  panelId: string;
};

export function MenuRing({ categories, selectedIndex, onSelect, panelId }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const selectedRef = useRef(selectedIndex);
  /**
   * Who is steering the ring. Scroll takes over the moment the page moves;
   * an explicit click or arrow-key choice holds until it does. Without this
   * the rAF loop re-derives selection from the scroll offset every frame and
   * silently undoes the user's choice.
   */
  const steerRef = useRef<"scroll" | "manual">("scroll");
  /**
   * Scroll position where the last manual choice was made. Control returns to
   * scroll only after the page has genuinely moved past a threshold from
   * there — a time-based grace period is not enough, because sub-pixel
   * jitter and a click's own scroll-into-view both expire it immediately.
   */
  const manualAnchorRef = useRef(0);
  const count = categories.length;

  useEffect(() => {
    selectedRef.current = selectedIndex;
  }, [selectedIndex]);

  /** Shortest signed distance from `from` to `to` around the circle. */
  const shortestDelta = useCallback((from: number, to: number) => {
    let delta = (to - from) % TWO_PI;
    if (delta > Math.PI) delta -= TWO_PI;
    if (delta < -Math.PI) delta += TWO_PI;
    return delta;
  }, []);

  // Clicking a card brings it to the front by the shorter way round.
  const rotateTo = useCallback(
    (index: number) => {
      const step = TWO_PI / count;
      const desired = -index * step;
      steerRef.current = "manual";
      manualAnchorRef.current = window.scrollY;
      targetRef.current = angleRef.current + shortestDelta(angleRef.current, desired);
    },
    [count, shortestDelta],
  );

  useEffect(() => {
    const list = listRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!list || !stage || !track) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideQuery = window.matchMedia("(min-width: 1024px)");

    let raf = 0;
    let lastTime = performance.now();
    let active = false;
    let visible = true;
    // Scroll may only steer the ring while the page is actually moving.
    // Otherwise a click or arrow-key selection is overwritten on the very
    // next frame by whatever angle the current scroll offset implies.
    let lastScrollY = window.scrollY;

    const step = TWO_PI / count;

    const clearRing = () => {
      list.removeAttribute("data-ring");
      for (const button of buttonsRef.current) {
        if (!button) continue;
        button.style.transform = "";
        button.style.opacity = "";
        button.style.pointerEvents = "";
      }
    };

    const layout = () => {
      const width = stage.clientWidth;
      // Ellipse wide enough to spread seven cards without clipping the edges.
      const radiusX = Math.min(width * 0.42, 460);
      const radiusZ = 320;

      for (const [index, button] of buttonsRef.current.entries()) {
        if (!button) continue;
        const a = index * step + angleRef.current;
        const cos = Math.cos(a);
        const depth = (cos + 1) / 2; // 1 at the front, 0 at the back

        const x = radiusX * Math.sin(a);
        const z = radiusZ * (cos - 1);
        const scale = 0.74 + 0.26 * depth;
        const opacity = 0.58 + 0.42 * depth;

        button.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        button.style.opacity = opacity.toFixed(3);
        /*
         * No explicit z-index. Inside a `preserve-3d` stage the translateZ
         * above already decides both paint order and hit-test order, and
         * setting z-index as well flattens the child — which made cards paint
         * in front while `elementFromPoint` still returned the container, so
         * the cards were not reliably clickable.
         */
        // Rear cards must not be reachable as invisible click targets.
        button.style.pointerEvents = depth < 0.25 ? "none" : "auto";
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!active || !visible) return;

      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      // A deliberate scroll hands the ring back to scroll steering; anything
      // smaller leaves the user's explicit choice standing.
      if (steerRef.current === "manual") {
        if (Math.abs(window.scrollY - manualAnchorRef.current) > 24) steerRef.current = "scroll";
      } else if (Math.abs(window.scrollY - lastScrollY) > 0.5) {
        steerRef.current = "scroll";
      }
      lastScrollY = window.scrollY;

      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (steerRef.current === "scroll" && span > 0) {
        const progress = Math.min(1, Math.max(0, -rect.top / span));
        // Enough rotation that every category reaches the front exactly once.
        targetRef.current = -progress * step * (count - 1);
      }

      const alpha = 1 - Math.exp(-delta / 90);
      angleRef.current += shortestDelta(angleRef.current, targetRef.current) * alpha;
      layout();

      // Under scroll steering the front-most card is the selected one. Under
      // manual steering the user's choice stands and is never second-guessed.
      if (steerRef.current === "scroll") {
        let nearest = 0;
        let best = -Infinity;
        for (let index = 0; index < count; index += 1) {
          const cos = Math.cos(index * step + angleRef.current);
          if (cos > best) {
            best = cos;
            nearest = index;
          }
        }
        if (nearest !== selectedRef.current) onSelect(nearest);
      }
    };

    const sync = () => {
      const shouldRun = wideQuery.matches && !motionQuery.matches;
      if (shouldRun === active) return;
      active = shouldRun;

      if (active) {
        list.setAttribute("data-ring", "on");
        layout();
      } else {
        clearRing();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(track);

    const onResize = () => {
      if (active) layout();
    };

    sync();
    raf = requestAnimationFrame(tick);
    motionQuery.addEventListener("change", sync);
    wideQuery.addEventListener("change", sync);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      motionQuery.removeEventListener("change", sync);
      wideQuery.removeEventListener("change", sync);
      window.removeEventListener("resize", onResize);
      clearRing();
    };
  }, [count, onSelect, shortestDelta]);

  /**
   * Resolves a click on the ring by geometry rather than trusting the
   * browser's hit test.
   *
   * Inside a `perspective` + `preserve-3d` stage Chromium paints the cards at
   * their projected positions but `elementFromPoint` there returns the stage,
   * not the card — so clicks never reached the buttons even though they were
   * plainly visible and had `pointer-events: auto`. This walks the cards
   * front-to-back and picks the first whose projected rect contains the
   * point, which is exactly what the user sees.
   *
   * Only used while the ring is active; the flat rail and grid rely on
   * ordinary button clicks.
   */
  const onStageClick = (event: React.MouseEvent) => {
    const list = listRef.current;
    if (!list || list.getAttribute("data-ring") !== "on") return;
    if ((event.target as HTMLElement).closest(".menu-ring-card")) return;

    const step = TWO_PI / count;
    const ordered = buttonsRef.current
      .map((button, index) => ({ button, index, depth: Math.cos(index * step + angleRef.current) }))
      .filter((entry) => entry.button && entry.depth > -0.5)
      .sort((a, b) => b.depth - a.depth);

    for (const entry of ordered) {
      const rect = entry.button!.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        onSelect(entry.index);
        rotateTo(entry.index);
        entry.button!.focus();
        return;
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;

    if (event.key in moves) next = (selectedIndex + moves[event.key] + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;

    event.preventDefault();
    onSelect(next);
    rotateTo(next);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div
      ref={trackRef}
      className="relative lg:h-[190svh] lg:motion-reduce:h-auto"
      data-menu-ring-track
    >
      <div className="lg:sticky lg:top-[4.5rem] lg:flex lg:h-[calc(100svh-4.5rem)] lg:items-center lg:motion-reduce:static lg:motion-reduce:h-auto lg:motion-reduce:block">
        <div ref={stageRef} className="w-full">
          <div
            ref={listRef}
            role="tablist"
            aria-label="Menu categories"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            onClick={onStageClick}
            className="menu-ring -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:justify-items-center lg:gap-6 lg:overflow-visible lg:pb-0"
          >
            {categories.map((category, index) => {
              const selected = index === selectedIndex;
              return (
                <button
                  key={category.id}
                  ref={(node) => {
                    buttonsRef.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`menu-tab-${category.id}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    onSelect(index);
                    rotateTo(index);
                  }}
                  className={[
                    "menu-ring-card group relative flex aspect-square shrink-0 snap-center flex-col justify-end",
                    "w-[150px] rounded-2xl border p-4 text-left sm:w-[180px] lg:w-[230px] lg:p-6",
                    "transition-[border-color,background-color,box-shadow] duration-200",
                    selected
                      ? "border-forest bg-white/85 shadow-[0_20px_60px_rgba(17,17,17,0.16)]"
                      : "border-ink/12 bg-white/70 shadow-[0_20px_60px_rgba(17,17,17,0.12)] hover:border-ink/25",
                  ].join(" ")}
                >
                  {/* Restrained brass inner line on the selected card. */}
                  {selected ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[5px] rounded-[0.875rem] border border-brass/45"
                    />
                  ) : null}

                  <span className="relative font-display text-lg leading-tight text-heading lg:text-xl">
                    {category.label}
                  </span>
                  <span className="relative mt-1.5 text-sm text-secondary">
                    {category.count} {category.count === 1 ? "item" : "items"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
