"use client";

import * as React from "react";
import { motion } from "motion/react";
import { menuCategories } from "@/data/business";
import { cn } from "@/lib/utils";

export type CategoryValue = "all" | string;

/**
 * Category filter as a toggle-button group (NOT ARIA tabs): filtering is
 * additive with search and all results render into one shared list, so the
 * WAI-ARIA filter-button pattern (`aria-pressed`) is the correct semantics.
 * Native <button>s give full keyboard support with no custom key handling.
 * The active pill slides between buttons via a shared `layoutId`; state is also
 * conveyed by colour + `aria-pressed`, never by motion/position alone.
 */
export function MenuCategoryTabs({
  active,
  onChange,
}: {
  active: CategoryValue;
  onChange: (next: CategoryValue) => void;
}) {
  const activeRef = React.useRef<HTMLButtonElement>(null);

  // Keep the active chip in view within the mobile horizontal strip.
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [active]);

  const options: { value: CategoryValue; label: string }[] = [
    { value: "all", label: "All" },
    ...menuCategories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <div
      role="group"
      aria-label="Filter dishes by category"
      className="-mx-gutter flex snap-x snap-proximity gap-2 overflow-x-auto px-gutter pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            ref={isActive ? activeRef : undefined}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              "relative shrink-0 snap-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
              isActive
                ? "border-charcoal text-cream"
                : "border-warm-border bg-white text-charcoal/80 hover:border-charcoal/40 hover:text-charcoal"
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="category-active-pill"
                className="absolute inset-0 -z-10 rounded-full bg-charcoal"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            ) : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
