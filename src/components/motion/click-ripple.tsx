"use client";

import * as React from "react";

/**
 * Global click-transition effect: a ripple that expands from the pointer on any
 * button / link-button press, plus a brief press-scale on the element itself.
 *
 * Implemented as one delegated document listener rather than per-component
 * state, so every current and future button gets the interaction for free and
 * no component has to opt in. Renders nothing.
 *
 * Skipped entirely under prefers-reduced-motion. Ripple nodes are absolutely
 * positioned, `aria-hidden`, pointer-events:none, and remove themselves when
 * their animation ends, so they never accumulate or intercept input.
 */
export function ClickRipple() {
  React.useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.<HTMLElement>(
        "button, a.group, [data-ripple]"
      );
      if (!el) return;
      // Skip tiny icon-only controls where a ripple would overwhelm the target.
      const rect = el.getBoundingClientRect();
      if (rect.width < 32 || rect.height < 24) return;

      // The ripple is positioned against the control, so it needs a
      // positioning context. Only set one if the element doesn't have one.
      const computed = getComputedStyle(el);
      if (computed.position === "static") el.style.position = "relative";
      if (computed.overflow === "visible") el.style.overflow = "hidden";

      const ripple = document.createElement("span");
      ripple.setAttribute("aria-hidden", "true");
      const size = Math.max(rect.width, rect.height) * 2;
      Object.assign(ripple.style, {
        position: "absolute",
        left: `${e.clientX - rect.left - size / 2}px`,
        top: `${e.clientY - rect.top - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "9999px",
        background: "currentColor",
        opacity: "0.22",
        pointerEvents: "none",
        transform: "scale(0)",
        zIndex: "0",
      });
      ripple.className = "mpb-ripple";
      el.appendChild(ripple);

      const anim = ripple.animate(
        [
          { transform: "scale(0)", opacity: 0.22 },
          { transform: "scale(1)", opacity: 0 },
        ],
        { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
      anim.onfinish = () => ripple.remove();
      anim.oncancel = () => ripple.remove();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
