import { site } from "@/lib/site";

/**
 * Deliberately light: wordmark, two anchors, click-to-call. No JS, no
 * hamburger — the page is one scroll and the call button is the point.
 */
export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8"
      >
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-cream"
        >
          The Quality Baker
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#order"
            className="hidden text-sm font-medium text-cream/80 transition-colors duration-150 hover:text-caramel sm:block"
          >
            Order
          </a>
          <a
            href="#visit"
            className="hidden text-sm font-medium text-cream/80 transition-colors duration-150 hover:text-caramel sm:block"
          >
            Visit us
          </a>
          <a
            href={site.phoneHref}
            className="glow-btn inline-flex min-h-11 items-center rounded-full border border-caramel/50 px-5 py-2 text-sm font-semibold text-caramel"
          >
            <span aria-hidden className="icing-swipe" />
            Call the shop
          </a>
        </div>
      </nav>
    </header>
  );
}
