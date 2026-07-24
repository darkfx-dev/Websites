import { gsap } from "@/lib/gsap";

/**
 * Matches `scroll-padding-top` in globals.css so the fixed header never covers
 * whatever we scroll to.
 */
export const HEADER_OFFSET = 84;

/** Where the page must land for `target` to sit just below the fixed header. */
export function scrollDestinationFor(target: HTMLElement): number {
  return Math.max(
    0,
    Math.min(
      target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      document.documentElement.scrollHeight - window.innerHeight
    )
  );
}

/**
 * Eased scroll to an element. Under prefers-reduced-motion it jumps instantly
 * instead — the destination is identical either way, only the travel differs.
 *
 * CSS `scroll-behavior` is pinned to `auto` for the duration so a global smooth
 * scroll can't fight the tween, then restored.
 */
export function scrollToElement(
  target: HTMLElement,
  options: { duration?: number; onComplete?: () => void } = {}
) {
  const { duration = 0.9, onComplete } = options;
  const destination = scrollDestinationFor(target);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, destination);
    onComplete?.();
    return;
  }

  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const proxy = { y: window.scrollY };
  gsap.to(proxy, {
    y: destination,
    duration,
    ease: "power3.inOut",
    overwrite: true,
    onUpdate: () => window.scrollTo(0, proxy.y),
    onComplete: () => {
      root.style.scrollBehavior = previousBehavior;
      onComplete?.();
    },
  });
}
