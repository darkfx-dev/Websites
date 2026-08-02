import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

/** jsdom has no media query engine; default to "no reduced-motion preference". */
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

/** jsdom does not implement scrolling; in-page anchor clicks call it. */
window.scrollTo = vi.fn();

/** jsdom exposes `navigator.clipboard` as a getter-only property. */
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  writable: true,
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
});

/** Framer Motion's `whileInView` and the sticky bar both need this. */
if (!("IntersectionObserver" in window)) {
  class StubIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: StubIntersectionObserver,
  });
}
