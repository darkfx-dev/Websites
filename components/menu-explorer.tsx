"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useMemo, useState } from "react";

import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { SearchIcon } from "@/components/ui/icons";
import {
  PRICE_DISCLAIMER,
  filterMenu,
  formatPrice,
  menuCategories,
  menuItems,
  priceByUnit,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { outlet } from "@/data/outlet";
import { menuCardPresence } from "@/lib/motion";

/**
 * Menu explorer.
 *
 * Prices are the user-supplied menu-board figures, rendered with the exact
 * disclaimer required by the brief. Nothing is inferred: an item shows only
 * the units its board row actually lists, and a per-kg figure is never
 * converted into a per-plate one.
 *
 * There is no order action. No ordering destination has been verified for
 * this outlet, and the brief is explicit that a button which does nothing
 * must not be rendered.
 */
export function MenuExplorer() {
  const [category, setCategory] = useState<MenuCategory | null>(null);
  const [query, setQuery] = useState("");
  const reduced = useAccessibleMotion();
  const searchId = useId();

  const results = useMemo(() => filterMenu(menuItems, category, query), [category, query]);

  const grouped = useMemo(
    () =>
      menuCategories
        .map((entry) => ({
          ...entry,
          items: results.filter((menuItem) => menuItem.category === entry.label),
        }))
        .filter((group) => group.items.length > 0),
    [results],
  );

  const isFiltered = category !== null || query.trim() !== "";

  const reset = () => {
    setQuery("");
    setCategory(null);
  };

  return (
    <section id="menu" className="container-page scroll-mt-28 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-terracotta uppercase">
          The menu
        </p>
        <h2 className="text-section">What this outlet makes</h2>
        <p className="measure mt-5 text-lg text-secondary">
          Every item on the Adajan board, grouped the way it is sold. Everything here is
          vegetarian.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-12 flex flex-col gap-6">
        <div className="max-w-md">
          <label htmlFor={searchId} className="mb-2 block text-sm font-semibold text-ink">
            Search the menu
          </label>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-secondary"
              width={18}
              height={18}
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Locho, khaman, samosa…"
              autoComplete="off"
              className="h-12 w-full rounded-lg border border-border-strong bg-surface pr-4 pl-11 text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <p id="menu-filter-label" className="mb-3 text-sm font-semibold text-ink">
            Filter by category
          </p>
          <div
            role="group"
            aria-labelledby="menu-filter-label"
            className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
          >
            <CategoryChip active={category === null} onClick={reset} label="All items" />
            {menuCategories.map((entry) => (
              <CategoryChip
                key={entry.id}
                active={category === entry.label}
                onClick={() => setCategory(entry.label)}
                label={entry.label}
              />
            ))}
          </div>
        </div>

        <p role="status" className="text-sm text-secondary">
          Showing {results.length} of {menuItems.length} items
          {category ? ` in ${category}` : ""}
          {query.trim() ? ` matching “${query.trim()}”` : ""}.
        </p>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={category ?? "all"}
          variants={menuCardPresence(reduced)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mt-10"
        >
          {grouped.length === 0 ? (
            <div className="rounded-[1.25rem] border border-border bg-surface px-6 py-14 text-center">
              <p className="text-sub font-display text-heading">No items match that search.</p>
              <p className="mx-auto measure mt-3 text-secondary">
                Try a shorter word, or clear the filters to see the whole board.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 inline-flex min-h-[48px] items-center rounded-lg border border-border-strong bg-surface px-6 font-semibold text-ink"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-14">
              {grouped.map((group) => (
                <div key={group.id}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
                    <h3 className="text-sub font-display text-heading">{group.label}</h3>
                    <p className="shrink-0 text-sm text-secondary">
                      {group.items.length} {group.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <ul className="mt-2">
                    {group.items.map((menuItem) => (
                      <MenuRow key={menuItem.id} item={menuItem} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {isFiltered && grouped.length > 0 ? (
        <p className="mt-10 text-sm text-secondary">
          Filters are on.{" "}
          <button
            type="button"
            onClick={reset}
            className="min-h-[44px] font-semibold text-ink underline decoration-border-strong underline-offset-4 hover:decoration-ink"
          >
            Show the whole board
          </button>
        </p>
      ) : null}

      {/* Mandatory price qualification, adjacent to every price presentation. */}
      <p className="measure mt-12 border-t border-border pt-6 text-sm text-secondary">
        {PRICE_DISCLAIMER} Call {outlet.contact.phoneDisplay} to check what is ready before you
        travel.
      </p>
    </section>
  );
}

/**
 * One editorial price row: name on the left, the units the board lists on the
 * right. Deliberately not a data table — no column exists unless the item has
 * a figure for it.
 */
function MenuRow({ item }: { item: MenuItem }) {
  const kg = priceByUnit(item, "kg");
  const plate = priceByUnit(item, "plate");
  const bottle = priceByUnit(item, "bottle");

  return (
    <li className="menu-row grid grid-cols-1 gap-1 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
      <p className="font-display text-lg leading-snug text-heading sm:text-xl">{item.name}</p>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 tabular-nums sm:justify-end">
        {kg ? <PriceTag price={formatPrice(kg)} label={kg.label} /> : null}
        {plate ? <PriceTag price={formatPrice(plate)} label={plate.label} /> : null}
        {bottle ? <PriceTag price={formatPrice(bottle)} label={bottle.label} /> : null}
      </div>
    </li>
  );
}

function PriceTag({ price, label }: { price: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-base font-semibold text-ink sm:text-lg">{price}</span>
      <span className="text-sm text-secondary">{label}</span>
    </span>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200",
        active
          ? "border-ink bg-ink text-white"
          : "border-border-strong bg-surface text-ink hover:bg-surface-subtle",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
