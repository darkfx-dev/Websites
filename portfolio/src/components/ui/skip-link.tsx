/**
 * Skip link.
 *
 * Present in the DOM from the first byte and visually hidden until focused,
 * so the first Tab press on the page always offers a way past the navigation.
 * It is sized like a real control when visible — a 1×1 clipped box that only
 * becomes usable on focus still has to be a proper target once it is.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="
        sr-only
        focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4
        focus-visible:z-[100] focus-visible:inline-flex focus-visible:min-h-[48px]
        focus-visible:items-center focus-visible:rounded-sm focus-visible:border
        focus-visible:border-line-strong focus-visible:bg-surface focus-visible:px-5
        focus-visible:text-sm focus-visible:text-ink
      "
    >
      Skip to main content
    </a>
  );
}
