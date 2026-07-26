"use client";

import { useEffect } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/**
 * Page-level scroll behaviour: GSAP choreography, and Lenis on the devices
 * that benefit from it.
 *
 * Renders nothing. It is mounted once from the layout so there is exactly one
 * ScrollTrigger registration and one scroll loop for the whole page.
 *
 * Three rules this follows:
 *
 *  1. Nothing here may hide content. Every tween animates an element that is
 *     already fully visible toward another visible state, and every one is
 *     `scrub`-linked so scrolling back restores it. If this module never
 *     loads — old browser, blocked chunk, offline — the page is unchanged.
 *
 *  2. Reduced motion means none of it runs. Not a shortened version: the
 *     imports never even happen, so a visitor who asked for less motion also
 *     downloads less JavaScript.
 *
 *  3. Lenis is an enhancement for precise pointers on large screens. Touch
 *     devices keep their native scrolling, which is smooth already and which
 *     Lenis can only make worse by fighting momentum and overscroll.
 */
export function ScrollChoreography() {
  const reduced = useReducedMotionPreference();
  const { finePointer, ready } = usePerformanceMode();

  useEffect(() => {
    if (!ready || reduced) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const useLenis =
        finePointer && window.matchMedia("(min-width: 1024px)").matches;

      let stopLenis: (() => void) | undefined;

      if (useLenis) {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;

        const lenis = new Lenis({
          duration: 1.05,
          // Slightly quicker than Lenis' default so the page still feels
          // responsive rather than weighted.
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
        });

        // Lenis and CSS smooth scrolling both try to own the same motion.
        const previousBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";

        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // In-page links: Lenis owns scrolling, so the browser's own anchor
        // jump has to be replaced — including the part browsers do silently,
        // which is moving focus to the destination. Without this, keyboard
        // users would be scrolled somewhere their focus had not followed.
        const onAnchorClick = (e: MouseEvent) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
          const anchor = (e.target as HTMLElement | null)?.closest?.(
            'a[href^="#"]'
          ) as HTMLAnchorElement | null;
          if (!anchor) return;

          const id = anchor.getAttribute("href")?.slice(1);
          if (!id) return;
          const target = document.getElementById(id);
          if (!target) return;

          e.preventDefault();
          lenis.scrollTo(target, { offset: -88 });
          history.pushState(null, "", `#${id}`);

          if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
          }
          target.focus({ preventScroll: true });
        };

        document.addEventListener("click", onAnchorClick);

        stopLenis = () => {
          document.removeEventListener("click", onAnchorClick);
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          document.documentElement.style.scrollBehavior = previousBehavior;
          lenis.destroy();
        };
      }

      // ── Choreography ──────────────────────────────────────────────────
      // `gsap.context` scopes every selector and reverts every inline style
      // it wrote when the effect tears down — including React 19's
      // development double-mount.
      const ctx = gsap.context(() => {
        // Hero copy drifts and dims as the visitor leaves it. Scrub-linked,
        // so scrolling back brings it fully forward again.
        const heroCopy = document.querySelector("[data-choreo='hero-copy']");
        const hero = document.getElementById("top");
        if (heroCopy && hero) {
          gsap.to(heroCopy, {
            y: -48,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        }

        // Section dividers draw themselves outward from the centre as they
        // arrive. They start at full width in CSS, so a failed load leaves a
        // perfectly ordinary rule.
        gsap.utils.toArray<HTMLElement>("[data-choreo='rule']").forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            ease: "power2.out",
            duration: 1.1,
            scrollTrigger: { trigger: rule, start: "top 88%", once: true },
          });
        });
      });

      // Font loading changes text height, which moves every trigger point.
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      cleanup = () => {
        ctx.revert();
        stopLenis?.();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [ready, reduced, finePointer]);

  return null;
}
