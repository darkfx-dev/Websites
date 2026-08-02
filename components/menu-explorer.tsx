"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useMemo, useState } from "react";

import { useAccessibleMotion } from "@/components/motion/use-accessible-motion";
import { SearchIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { filterMenu, menuCategories, menuItems, unitSummary, type MenuCategory } from "@/data/menu";
import { outlet } from "@/data/outlet";
import { categoryInquiryMessage, whatsappHref } from "@/lib/links";
import { menuCardPresence } from "@/lib/motion";

/**
 * Menu explorer.
 *
 * `MENU_PRICES_VERIFIED` is false, so no price reaches this component: the
 * reference snapshot lives in `docs/price-reference.md`, which nothing
 * imports. Cards state the sale format and "Price on request" instead, and
 * each category carries one WhatsApp inquiry action rather than repeating a
 * button on all 29 cards.
 *
 * 101 — changing category crossfades the results in 180ms. Search filters
 * without a transition so typing stays immediate.
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

  return (
    <section id="menu" className="container-page scroll-mt-24 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-copper uppercase">
          The board
        </p>
        <h2 className="text-section text-ink">What this outlet makes</h2>
        <p className="measure mt-4 text-muted">
          Every item on the Adajan Patiya board, grouped the way it is sold. Everything here is
          vegetarian. Prices change, so they are not published — ask for today&rsquo;s price on
          WhatsApp or by phone.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-10 flex flex-col gap-5">
        <div className="relative max-w-md">
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
              className="h-12 w-full rounded-md border border-border-strong bg-surface pr-4 pl-11 text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <p id="menu-filter-label" className="mb-2 text-sm font-semibold text-ink">
            Filter by category
          </p>
          <div
            role="group"
            aria-labelledby="menu-filter-label"
            className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
          >
            <CategoryChip
              active={category === null}
              onClick={() => setCategory(null)}
              label="All items"
            />
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

        <p role="status" className="text-sm text-muted">
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
          className="mt-8"
        >
          {grouped.length === 0 ? (
            <div className="rounded-[1.25rem] border border-border bg-surface/70 px-6 py-12 text-center">
              <p className="font-display text-xl text-ink">No items match that search.</p>
              <p className="mx-auto measure mt-2 text-muted">
                Try a shorter word, or clear the filters to see the whole board.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
                className="mt-6 inline-flex min-h-[44px] items-center rounded-md border border-border-strong bg-surface px-5 font-semibold text-ink"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {grouped.map((group) => (
                <div key={group.id}>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <h3 className="font-display text-xl text-ink sm:text-2xl">{group.label}</h3>
                    <WhatsAppLink
                      href={whatsappHref(categoryInquiryMessage(group.label))}
                      variant="secondary"
                      className="text-sm"
                    >
                      Ask current price on WhatsApp
                    </WhatsAppLink>
                  </div>

                  <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((menuItem) => (
                      <li key={menuItem.id}>
                        <div className="menu-card h-full rounded-[1.25rem] border border-border bg-surface p-5">
                          <p className="font-display text-lg leading-snug text-ink">
                            {menuItem.name}
                          </p>
                          <p className="mt-2 text-sm text-muted">{unitSummary(menuItem)}</p>
                          <p className="mt-4 border-t border-border pt-3 text-sm text-copper">
                            Price on request
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {isFiltered && grouped.length > 0 ? (
        <p className="mt-8 text-sm text-muted">
          Filters are on.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
            className="min-h-[44px] font-semibold text-ink underline decoration-border-strong underline-offset-4 hover:text-brand"
          >
            Show the whole board
          </button>
        </p>
      ) : null}

      <p className="mt-10 max-w-2xl text-sm text-muted">
        Availability changes through the day. Message the outlet on WhatsApp or call{" "}
        {outlet.contact.phoneDisplay} to check what is ready before you travel.
      </p>
    </section>
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
        "inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-[160ms]",
        active
          ? "border-ink bg-ink text-canvas"
          : "border-border-strong bg-surface text-ink hover:bg-surface-subtle",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
