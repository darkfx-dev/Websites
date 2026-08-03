"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navSections, profile, real, testimonials, writing } from "@/data/portfolio";
import { MobileNavigation } from "./mobile-navigation";
import { cn } from "@/lib/utils";

/**
 * Sticky navigation.
 *
 * Two behaviours worth noting:
 *  - the bar is transparent over the hero and gains its glass background once
 *    the visitor leaves it, so the hero composition is never boxed in;
 *  - the active section is marked with `aria-current` as well as colour, so
 *    the state is not carried by colour alone.
 */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Only the sections that actually render. Optional sections disappear when
  // their content is empty, so the nav can never point at a missing anchor.
  const sections = useMemo(
    () =>
      navSections.filter((s) => {
        if (s.id === "notes") return writing.length > 0;
        if (s.id === "testimonials") return testimonials.length > 0;
        return true;
      }),
    []
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy. The observer is built once, because `sections` is memoised —
  // rebuilding it on every render would tear down and re-create an observer
  // on each scroll tick.
  useEffect(() => {
    const observed = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (observed.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const realName = real(profile.name);
  const name = realName ?? profile.name;
  const initials = name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled || open
            ? "border-b border-line bg-[rgba(7,9,13,0.72)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-[68px] items-center justify-between gap-4"
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5 rounded-sm"
            aria-label={`${name} — back to top`}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid h-8 w-8 place-items-center rounded-sm border border-line-strong",
                "mono text-xs tracking-tight text-ink transition-colors group-hover:border-accent"
              )}
            >
              {initials || "—"}
            </span>
            {/* Marked when the name is still a placeholder, so the wordmark
                is not the one spot on the page that presents one as fact. */}
            <span
              {...(realName ? {} : { "data-placeholder": "true" })}
              className={cn(
                "hidden text-sm font-medium tracking-tight sm:block",
                !realName &&
                  "rounded-sm border border-dashed border-accent/45 bg-accent-soft/40 px-1.5 text-ink-soft"
              )}
            >
              {name}
              {realName ? null : (
                <span className="sr-only">
                  {" "}
                  (placeholder — content not yet supplied)
                </span>
              )}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative flex min-h-[44px] items-center rounded-sm px-3 text-sm transition-colors",
                      isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                    )}
                  >
                    {s.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-1.5 h-px bg-accent"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#contact" className="btn btn-ghost hidden sm:inline-flex">
              Get in touch
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-sm border border-line-strong",
                "text-ink transition-colors hover:border-accent md:hidden"
              )}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      <MobileNavigation
        open={open}
        onClose={close}
        sections={sections}
        active={active}
        triggerRef={toggleRef}
      />
    </header>
  );
}
