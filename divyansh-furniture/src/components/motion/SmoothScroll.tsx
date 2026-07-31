"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling and the GSAP ScrollTrigger that drives the depth
 * background. Renders nothing.
 *
 * Three rules this follows:
 *
 *  1. Both libraries are imported dynamically, so a visitor who never gets
 *     them — reduced motion, an old browser, a blocked chunk — also never
 *     downloads them. The page is complete without either.
 *  2. Reduced motion means none of it runs. Not a shortened version.
 *  3. Nothing here may hide content. The only properties touched are
 *     `transform` and `opacity` on decorative layers that are already
 *     visible, and every one is scrub-linked so scrolling back restores it.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Mark the document as script-capable so the CSS reveals arm themselves.
    document.documentElement.classList.add("js");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        touchMultiplier: 1.6,
      });

      // Lenis and CSS smooth scrolling both try to own the same motion.
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Lenis owns scrolling, so the browser's anchor jump has to be
      // replaced — including the part browsers do silently, which is moving
      // focus to the destination. Without this, keyboard users would be
      // scrolled somewhere their focus had not followed.
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
        lenis.scrollTo(target, { offset: -84 });
        history.pushState(null, "", `#${id}`);
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      document.addEventListener("click", onAnchorClick);

      // The depth background: three layers moving at different rates through
      // real 3D space. `gsap.context` scopes every selector and reverts every
      // inline style it wrote when this tears down — including React's
      // development double-mount.
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((layer) => {
          const depth = Number(layer.dataset.depth ?? 1);
          gsap.to(layer, {
            yPercent: -12 * depth,
            z: 40 * depth,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // Font loading changes text height, which moves every trigger point.
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      cleanup = () => {
        document.removeEventListener("click", onAnchorClick);
        ctx.revert();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        document.documentElement.style.scrollBehavior = previousBehavior;
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
