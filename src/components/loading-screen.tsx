import Image from "next/image";

/**
 * Brief branded splash shown before the page settles. Deliberately NOT a
 * client component: it's pure CSS-timed (see globals.css `#loading-screen`),
 * so it appears in the server-rendered HTML with the real page already
 * underneath, and is guaranteed to self-clear via a CSS animation — no JS
 * required, so it can never stay stuck for a no-JS visitor. `aria-hidden`
 * because it's purely decorative; the real content is already in the a11y
 * tree beneath it.
 */
export function LoadingScreen() {
  return (
    <div id="loading-screen" aria-hidden="true">
      <Image
        src="/images/mpb-logo.png"
        alt=""
        width={110}
        height={63}
        priority
        className="h-16 w-auto sm:h-20"
      />
      <span>Mahesh Pav Bhaji</span>
    </div>
  );
}
