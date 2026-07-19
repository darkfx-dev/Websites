/**
 * GSAP scroll choreography. Loaded lazily (after idle) and only when the
 * visitor has not requested reduced motion. Owns scroll-linked animation
 * only — Motion for React owns interface state transitions.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialised = false;

export function initReveals(): void {
  if (initialised) return;
  initialised = true;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Batched section reveals: transform + opacity only.
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      batchMax: 6,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            overwrite: true,
          }
        ),
    });

    // The Guided Ascent line: drawn as the academic pathway scrolls through.
    const path = document.querySelector<SVGPathElement>("[data-ascent-path]");
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: path.closest("[data-ascent-scope]") ?? path,
          start: "top 80%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });
}
