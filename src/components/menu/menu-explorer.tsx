"use client";

import * as React from "react";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { menuCategories } from "@/data/business";
import {
  menuItems,
  namedCountForCategory,
  categoryHasUnnamedItems,
} from "@/data/menu";
import {
  MENU_EXPLORER_ID,
  matchesSelection,
  subscribeToMenuSelection,
  type MenuSelection,
} from "@/lib/menu-selection";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppIcon } from "@/components/icons";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";
import { MenuCategoryTabs, type CategoryValue } from "./menu-category-tabs";
import { MenuSearch } from "./menu-search";
import { DishCard } from "./dish-card";
import { MenuEmptyState } from "./menu-empty-state";

const categoryNameBySlug = new Map(
  menuCategories.map((c) => [c.slug, c.name] as const)
);

export function MenuExplorer() {
  /**
   * One selection drives the whole explorer. A category chip sets a
   * single-slug selection; the 3D highlight ring above can set a multi-slug
   * (and optionally keyword-narrowed) one — e.g. "Rice & Noodles" spans two
   * categories, "Jain & Paneer Bhaji" is a slice of one. `null` means "All".
   */
  const [selection, setSelection] = React.useState<MenuSelection | null>(null);
  const [query, setQuery] = React.useState("");

  // Selections arriving from the highlight ring. It handles scrolling us into
  // view; we only have to show the right dishes by the time it lands.
  React.useEffect(
    () =>
      subscribeToMenuSelection((next) => {
        setSelection(next);
        setQuery("");
      }),
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (!matchesSelection(item, selection)) return false;
      if (!q) return true;
      const name = item.name.toLowerCase();
      const category = (
        categoryNameBySlug.get(item.categorySlug) ?? ""
      ).toLowerCase();
      return name.includes(q) || category.includes(q);
    });
  }, [selection, query]);

  const clearAll = () => {
    setSelection(null);
    setQuery("");
  };

  /**
   * The one slug a selection reduces to, when it reduces to exactly one whole
   * category. Multi-category groups and keyword-narrowed slices have no single
   * slug, and neither does "All".
   */
  const singleCategorySlug: string | null =
    selection && selection.slugs.length === 1 && !selection.keywords
      ? (selection.slugs[0] ?? null)
      : null;

  /** Which chip (if any) is pressed: only a plain single-category selection. */
  const activeChip: CategoryValue | null =
    selection === null ? "all" : singleCategorySlug;

  const onChipChange = (next: CategoryValue) => {
    if (next === "all") {
      setSelection(null);
      return;
    }
    setSelection({
      label: categoryNameBySlug.get(next) ?? next,
      slugs: [next],
    });
  };

  /** A selection resolving to exactly one whole category can be asked about. */
  const inquiryCategoryName = singleCategorySlug
    ? (categoryNameBySlug.get(singleCategorySlug) ?? null)
    : null;

  // Honest count label. Where the business lists more variations than it named
  // for us, say so rather than implying the named list is complete.
  const partialCategory = menuCategories.find(
    (c) => c.slug === singleCategorySlug && categoryHasUnnamedItems(c.slug)
  );

  const countLabel =
    partialCategory && !query
      ? `${namedCountForCategory(partialCategory.slug)} of ~${partialCategory.count} listed`
      : `${filtered.length} ${filtered.length === 1 ? "dish" : "dishes"}`;

  // Menus and availability can differ by branch, so both menu requests ask
  // which outlet before opening WhatsApp. The category one carries the section
  // the user is currently looking at.
  const categoryEnquiryTrigger = useOutletTrigger(() => ({
    type: "request-menu",
    categoryName: inquiryCategoryName ?? undefined,
  }));
  const currentMenuTrigger = useOutletTrigger(() => ({ type: "request-menu" }));

  return (
    <section
      id={MENU_EXPLORER_ID}
      aria-labelledby="menu-explorer-heading"
      className="section-y scroll-mt-20 bg-ivory"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="The full menu"
          title={<span id="menu-explorer-heading">Browse every dish</span>}
          description="Filter by category or search by name across roughly 160 dishes and variations. Prices and daily availability are shared on WhatsApp."
        />

        <MotionConfig reducedMotion="user">
          <div className="mt-9 flex flex-col gap-5">
            <MenuSearch
              value={query}
              onChange={setQuery}
              describedById="menu-result-count"
            />
            <MenuCategoryTabs active={activeChip} onChange={onChipChange} />

            {/* Groups spanning more than one category can't light up a single
                chip, so they get an explicit removable label instead. */}
            {selection && activeChip === null ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-charcoal/60">Showing</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-charcoal py-1.5 pl-4 pr-1.5 text-sm font-semibold text-cream">
                  {selection.label}
                  <button
                    type="button"
                    onClick={clearAll}
                    aria-label={`Clear the ${selection.label} filter`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cream/15 transition-colors hover:bg-cream/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              </div>
            ) : null}

            {/* Result count + category inquiry */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                id="menu-result-count"
                aria-live="polite"
                aria-atomic="true"
                className="text-sm font-medium text-charcoal/70"
              >
                {countLabel}
              </p>
              {inquiryCategoryName ? (
                <button
                  {...categoryEnquiryTrigger}
                  className="inline-flex min-h-[24px] items-center gap-1.5 text-sm font-semibold text-coriander transition-colors hover:text-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Ask about {inquiryCategoryName}
                </button>
              ) : null}
            </div>

            {/* Honest note where the business lists more than it named for us. */}
            {partialCategory && !query ? (
              <p className="rounded-card border border-warm-border bg-white/70 px-4 py-3 text-sm text-charcoal/70">
                More {partialCategory.name} dishes are available in-store than
                are named here — ask us on WhatsApp for the full list and prices.
              </p>
            ) : null}

            {/* Results */}
            <div>
              {filtered.length > 0 ? (
                <motion.ul
                  layout
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((item) => (
                    <DishCard
                      key={item.id}
                      item={item}
                      categoryName={
                        categoryNameBySlug.get(item.categorySlug) ?? ""
                      }
                    />
                  ))}
                </motion.ul>
              ) : (
                <MenuEmptyState onClear={clearAll} />
              )}
            </div>

            {/* General current-menu inquiry (always available) */}
            <div className="mt-4 flex flex-col items-start gap-3 rounded-feature border border-warm-border bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-charcoal/75">
                Looking for prices or something not listed? We&rsquo;ll share the
                current menu on WhatsApp.
              </p>
              <MagneticButton>
                <button
                  {...currentMenuTrigger}
                  className="group inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-button bg-coriander px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Request Current Menu on WhatsApp
                  <ArrowRight
                    className="h-[18px] w-[18px] transition-transform duration-160 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </MagneticButton>
            </div>
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}
