"use client";

import { m, useReducedMotion } from "motion/react";
import { MessageCircle, Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { ActionLink } from "@/components/ui/action-link";
import { business } from "@/data/business";
import {
  formatPrice,
  matchesQuery,
  menuCategories,
  menuItemCount,
  menuItems,
  type MenuCategory,
} from "@/data/menu";
import { buildWhatsAppHref } from "@/lib/links";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Filter = "All" | MenuCategory;

const filters: readonly Filter[] = ["All", ...menuCategories] as const;

export function MenuExplorer() {
  const [active, setActive] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();
  const searchId = useId();

  const visible = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          (active === "All" || item.category === active) &&
          matchesQuery(item, query),
      ),
    [active, query],
  );

  // Preserve board order within each category, and skip categories that the
  // current filter and query leave empty.
  const groups = useMemo(
    () =>
      menuCategories
        .map((category) => ({
          category,
          items: visible.filter((item) => item.category === category),
        }))
        .filter((group) => group.items.length > 0),
    [visible],
  );

  const hasQuery = query.trim().length > 0;

  return (
    <section id="menu" className="section-y border-b border-[rgba(10,10,10,0.12)]">
      <div className="container-page">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          01 — Menu
        </p>
        <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em] text-ink">
          The complete menu
        </h2>
        <p className="mt-5 max-w-measure text-lg text-ink-soft">
          Browse all {menuItemCount} listed items. Reference prices come from
          the latest available menu-board photograph and should be confirmed
          with the outlet.
        </p>

        {/* The disclaimer sits with the prices themselves, not in a footnote. */}
        <p className="mt-6 border-l-2 border-khaman bg-surface-muted py-3 pl-4 pr-3 text-sm text-ink-soft">
          {business.priceDisclaimer}
        </p>

        {/* Controls */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Horizontally scrollable on mobile; the trailing fade is the
              affordance that there is more to reach. */}
          <div className="relative -mx-[18px] md:mx-0">
            <div
              role="group"
              aria-label="Filter menu by category"
              className="flex gap-2 overflow-x-auto px-[18px] pb-1 md:flex-wrap md:overflow-visible md:px-0"
            >
              {filters.map((filter) => {
                const isActive = filter === active;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(filter)}
                    className={cn(
                      "min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "border-ink bg-ink text-white"
                        : "border-[rgba(10,10,10,0.16)] bg-surface text-ink-soft hover:bg-surface-muted",
                    )}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas to-transparent md:hidden"
            />
          </div>

          <div className="relative lg:w-72">
            <label htmlFor={searchId} className="sr-only">
              Search the menu
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search items or categories"
              className="min-h-11 w-full rounded-card border border-[rgba(10,10,10,0.16)] bg-surface pl-9 pr-10 text-base text-ink placeholder:text-muted"
            />
            {hasQuery ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-card text-muted hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
                <span className="sr-only">Clear search</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Announced to screen readers on every filter or query change. */}
        <p aria-live="polite" className="mt-4 text-sm text-muted">
          {visible.length === menuItemCount
            ? `Showing all ${menuItemCount} items`
            : `Showing ${visible.length} of ${menuItemCount} items`}
        </p>

        {/* Keyed on the category only: changing filters crossfades, but typing
            does not re-run an animation on every keystroke. */}
        <m.div
          key={active}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : motionTokens.duration.fast }}
          className="mt-8"
        >
          {groups.length === 0 ? (
            <div className="border border-[rgba(10,10,10,0.12)] bg-surface px-6 py-12 text-center">
              <p className="font-display text-2xl text-ink">No items match that search.</p>
              <p className="mx-auto mt-3 max-w-measure text-ink-soft">
                Try a different item name, or clear the search to see the full
                menu again.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActive("All");
                }}
                className="mt-6 inline-flex min-h-11 items-center rounded-card border border-ink px-5 text-sm font-semibold text-ink hover:bg-surface-muted"
              >
                Reset the menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {groups.map((group) => (
                <div
                  key={group.category}
                  className="grid gap-4 lg:grid-cols-12 lg:gap-8"
                >
                  <h3 className="font-display text-2xl leading-tight text-ink lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                    {group.category}
                  </h3>

                  <ul className="lg:col-span-8">
                    {group.items.map((item) => {
                      const price = formatPrice(item);
                      return (
                        <li
                          key={item.id}
                          className="flex items-baseline justify-between gap-4 border-b border-[rgba(10,10,10,0.1)] py-3 transition-colors duration-150 hover:border-[rgba(10,10,10,0.35)]"
                        >
                          <span className="text-base text-ink">{item.name}</span>
                          <span className="tabular flex shrink-0 items-baseline gap-3 text-sm text-ink-soft sm:gap-6">
                            <span className="w-[78px] text-right sm:w-[88px]">
                              {price.kg}
                            </span>
                            <span className="w-[86px] text-right sm:w-[96px]">
                              {price.unit}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </m.div>

        {/* Exactly one inquiry action for the whole menu, aware of the
            category currently being browsed. */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[rgba(10,10,10,0.12)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-measure text-ink-soft">
            Prices and availability change. Confirm what is ready today before
            you set out.
          </p>
          <ActionLink
            href={buildWhatsAppHref(active)}
            external
            size="lg"
            className="shrink-0"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {active === "All"
              ? "Ask about the menu"
              : `Ask about ${active}`}
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
