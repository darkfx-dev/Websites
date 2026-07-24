"use client";

import * as React from "react";
import { scrollToElement } from "@/lib/scroll";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/**
 * Eased in-page navigation. Intercepts same-page anchor clicks and animates the
 * scroll with a real easing curve instead of the browser's linear-ish default.
 *
 * Renders nothing. Behaviour notes:
 * - The URL hash is still updated (via pushState) so deep links, the back
 *   button, and "copy link" all keep working exactly as before.
 * - Focus is moved to the target section afterwards, so keyboard and screen
 *   reader users land where sighted users do rather than staying at the top.
 * - Under prefers-reduced-motion it does nothing at all and lets the browser
 *   perform an ordinary instant jump.
 * - Modified clicks (new tab/window, middle-click) are left alone.
 */
export function SmoothAnchorScroll() {
  const reduced = useReducedMotionPreference();

  React.useEffect(() => {
    if (reduced) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      scrollToElement(target, {
        onComplete: () => {
          history.pushState(null, "", href);
          // Send focus to the section without re-triggering a jump.
          const hadTabIndex = target.hasAttribute("tabindex");
          if (!hadTabIndex) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.removeAttribute("tabindex");
        },
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);

  return null;
}
