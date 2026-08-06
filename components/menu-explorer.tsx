"use client";

import { AnimatePresence, m } from "motion/react";
import { useCallback, useId, useMemo, useState } from "react";

import { MenuRing } from "@/components/menu/menu-ring";
import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { SearchIcon } from "@/components/ui/icons";
import {
  PRICE_DISCLAIMER,
  filterMenu,
  formatPrice,
  menuCategories,
  menuItems,
  priceByUnit,
  type MenuItem,
} from "@/data/menu";
import { outlet } from "@/data/outlet";
import { duration, ease } from "@/lib/motion";

/**
 * Menu experience: the 3D category ring plus the selected category's menu,
 * revealed inline directly beneath it — never in a modal, popup or drawer.
 *
 * Search is a parallel path rather than a mode switch: typing shows matches
 * across every category so the whole board stays reachable, which the earlier
 * briefs require, while the ring remains the primary way in.
 *
 * Prices are the user-supplied menu-board figures shown with the exact
 * mandated disclaimer. Nothing is inferred: an item shows only the units its
 * board row lists, and a per-kg figure is never converted to a per-plate one.
 * There is no order action, because no ordering destination is verified.
 */
export function MenuExplorer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const reduced = useAccessibleMotion();
  const searchId = useId();
  const panelId = useId();

  const ringCategories = useMemo(
    () =>
      menuCategories.map((entry) => ({
        id: entry.id,
        label: entry.label,
        count: menuItems.filter((item) => item.category === entry.label).length,
      })),
    [],
  );

  const searching = query.trim() !== "";
  const selected = menuCategories[selectedIndex];

  const searchResults = useMemo(
    () => (searching ? filterMenu(menuItems, null, query) : []),
    [searching, query],
  );

  const categoryItems = useMemo(
    () => menuItems.filter((item) => item.category === selected.label),
    [selected.label],
  );

  const shown = searching ? searchResults : categoryItems;

  // Stable identity: the ring calls this from its animation loop.
  const handleSelect = useCallback((index: number) => setSelectedIndex(index), []);

  return (
    <section id="menu" className="veil scroll-mt-28">
      <div className="container-page py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-terracotta uppercase">
            The menu
          </p>
          <h2 className="text-section">What this outlet makes</h2>
          <p className="measure mt-5 text-lg text-secondary">
            Turn through the categories, or search the whole board. Everything here is vegetarian.
          </p>
        </div>

        <div className="mt-12 max-w-md">
          <label htmlFor={searchId} className="mb-2 block text-sm font-semibold text-ink">
            Search the menu
          </label>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
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
      </div>

      {!searching ? (
        <div className="container-page pb-4">
          <MenuRing
            categories={ringCategories}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            panelId={panelId}
          />
        </div>
      ) : null}

      <div className="container-page pb-24 md:pb-32">
        {/* Announce the change only, never the whole price list. */}
        <p role="status" className="sr-only">
          {searching
            ? `${shown.length} items match ${query.trim()}`
            : `${selected.label} selected, ${shown.length} items`}
        </p>

        {/* Persistent inline container: it never disappears between selections. */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={searching ? undefined : `menu-tab-${selected.id}`}
          tabIndex={-1}
          className="min-h-[24rem]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
            <h3 className="text-section font-display">
              {searching ? "Search results" : selected.label}
            </h3>
            <p className="shrink-0 text-sm text-secondary">
              {searching
                ? `${shown.length} of ${menuItems.length} items matching “${query.trim()}”`
                : `${shown.length} ${shown.length === 1 ? "item" : "items"}`}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={searching ? `search:${query.trim()}` : selected.id}
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={
                reduced
                  ? { duration: duration.instant }
                  : { duration: 0.34, ease: ease.standard }
              }
            >
              {searching && shown.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sub font-display">No items match that search.</p>
                  <p className="mx-auto measure mt-3 text-secondary">
                    Try a shorter word, or clear the search to browse by category.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-7 inline-flex min-h-[48px] items-center rounded-lg border border-border-strong bg-surface px-6 font-semibold text-ink"
                  >
                    Clear search
                  </button>
                </div>
              ) : searching ? (
                <ul className="mt-2">
                  {shown.map((item) => (
                    <MenuRow key={item.id} item={item} showCategory />
                  ))}
                </ul>
              ) : (
                /*
                 * Every category is rendered. With scripting on, CSS shows
                 * only the selected group; with it off, all seven remain
                 * visible so the complete board is still readable.
                 */
                menuCategories.map((category) => (
                  <div
                    key={category.id}
                    data-menu-group
                    {...(category.id === selected.id ? { "data-menu-group-selected": "" } : {})}
                  >
                    <h4 className="sr-only">{category.label}</h4>
                    <ul className="mt-2">
                      {menuItems
                        .filter((item) => item.category === category.label)
                        .map((item) => (
                          <MenuRow key={item.id} item={item} />
                        ))}
                    </ul>
                  </div>
                ))
              )}
            </m.div>
          </AnimatePresence>
        </div>

        <p className="measure mt-12 border-t border-border pt-6 text-sm text-secondary">
          {PRICE_DISCLAIMER} Call {outlet.contact.phoneDisplay} to check what is ready before you
          travel.
        </p>
      </div>
    </section>
  );
}

/**
 * One editorial price row. Deliberately not a data table — a unit column only
 * exists when that item's board row actually carries a figure for it.
 */
function MenuRow({ item, showCategory }: { item: MenuItem; showCategory?: boolean }) {
  const kg = priceByUnit(item, "kg");
  const plate = priceByUnit(item, "plate");
  const bottle = priceByUnit(item, "bottle");

  return (
    <li className="grid grid-cols-1 gap-1 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
      <div>
        <p className="font-display text-lg leading-snug text-heading sm:text-xl">{item.name}</p>
        {showCategory ? <p className="mt-1 text-sm text-secondary">{item.category}</p> : null}
      </div>

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
