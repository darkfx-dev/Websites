"use client";

import { useEffect, useRef, useState } from "react";

import { MobileNav } from "@/components/mobile-nav";
import { PhoneIcon } from "@/components/ui/icons";
import { outlet } from "@/data/outlet";
import { anchors, telHref } from "@/lib/links";

/**
 * Sticky navigation with two states (V2 §19).
 *
 * Over the cinematic hero it is transparent with light text so it reads as
 * part of the footage; once the hero is behind the visitor it becomes a
 * warm-white bar with black text, a hairline border and a light blur.
 *
 * The state flips on one IntersectionObserver callback rather than a scroll
 * listener, so nothing runs per scroll frame. The swap is deliberately
 * instant: cross-fading the bar's background while the text colour changes
 * leaves a brief window of dark text on dark footage.
 */
const navItems = [
  { href: anchors.menu, label: "Menu" },
  { href: anchors.about, label: "Our story" },
  { href: anchors.location, label: "Visit us" },
  { href: anchors.faq, label: "FAQ" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setSolid(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/*
        Sits at the very top of the document. While it is on screen the header
        is over the hero; once it leaves, the header goes solid.
      */}
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-[70svh] w-px" />

      <header
        data-navbar
        data-solid={solid || undefined}
        className={[
          "fixed inset-x-0 top-0 z-40",
          solid
            ? "border-b border-border bg-canvas"
            : "border-b border-transparent bg-gradient-to-b from-black/45 to-transparent",
        ].join(" ")}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <a
            href="#top"
            className={[
              "flex min-h-[44px] items-center font-display text-[1.0625rem] font-semibold no-underline sm:text-xl",
              solid ? "text-heading" : "text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]",
            ].join(" ")}
          >
            {outlet.name}
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((entry) => (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    className={[
                      "inline-flex min-h-[44px] items-center rounded-md px-3 text-[0.9375rem] font-medium no-underline transition-colors duration-200",
                      solid
                        ? "text-ink hover:bg-surface-subtle"
                        : "text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] hover:bg-white/15",
                    ].join(" ")}
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={telHref}
              className={[
                "hidden min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 text-[0.9375rem] font-semibold no-underline transition-colors duration-200 md:inline-flex",
                solid
                  ? "bg-ink text-white hover:bg-black"
                  : "bg-white/95 text-ink hover:bg-white",
              ].join(" ")}
            >
              <PhoneIcon />
              <span>Call</span>
              <span className="sr-only"> the outlet on {outlet.contact.phoneDisplay}</span>
            </a>
            <MobileNav overHero={!solid} />
          </div>
        </div>
      </header>
    </>
  );
}
