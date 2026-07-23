/** Keyboard/screen-reader shortcut to jump straight to the main content. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-charcoal focus:px-4 focus:py-3 focus:text-cream focus:shadow-elevated"
    >
      Skip to main content
    </a>
  );
}
