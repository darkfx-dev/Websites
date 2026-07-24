"use client";

import * as React from "react";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { business, menuCategories } from "@/data/business";
import {
  menuItems,
  namedCountForCategory,
  categoryHasUnnamedItems,
} from "@/data/menu";
import { buildCategoryInquiryUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppIcon } from "@/components/icons";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { MenuCategoryTabs, type CategoryValue } from "./menu-category-tabs";
import { MenuSearch } from "./menu-search";
import { DishCard } from "./dish-card";
import { MenuEmptyState } from "./menu-empty-state";

const categoryNameBySlug = new Map(
  menuCategories.map((c) => [c.slug, c.name] as const)
);

export function MenuExplorer() {
  const [active, setActive] = React.useState<CategoryValue>("all");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (active !== "all" && item.categorySlug !== active) return false;
      if (!q) return true;
      const name = item.name.toLowerCase();
      const category = (categoryNameBySlug.get(item.categorySlug) ?? "").toLowerCase();
      return name.includes(q) || category.includes(q);
    });
  }, [active, query]);

  const clearAll = () => {
    setActive("all");
    setQuery("");
  };

  const activeCategoryName =
    active === "all" ? null : categoryNameBySlug.get(active) ?? null;

  // Honest count label for a single active category with unnamed variations.
  const countLabel = (() => {
    if (active === "all") return `${filtered.length} dishes`;
    const named = namedCountForCategory(active);
    const category = menuCategories.find((c) => c.slug === active);
    if (category && categoryHasUnnamedItems(active) && !query) {
      return `${named} of ~${category.count} listed`;
    }
    return `${filtered.length} ${filtered.length === 1 ? "dish" : "dishes"}`;
  })();

  return (
    <section
      id="menu-explorer"
      aria-labelledby="menu-explorer-heading"
      className="section-y scroll-mt-20 bg-ivory"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="The full menu"
          title={
            <span id="menu-explorer-heading">Browse every dish</span>
          }
          description="Filter by category or search by name across roughly 160 dishes and variations. Prices and daily availability are shared on WhatsApp."
        />

        <MotionConfig reducedMotion="user">
          <div className="mt-9 flex flex-col gap-5">
            <MenuSearch
              value={query}
              onChange={setQuery}
              describedById="menu-result-count"
            />
            <MenuCategoryTabs active={active} onChange={setActive} />

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
              {activeCategoryName ? (
                <a
                  href={buildCategoryInquiryUrl(activeCategoryName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-coriander transition-colors hover:text-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Ask about {activeCategoryName}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
            </div>

            {/* Honest note where the business lists more than it named for us. */}
            {active !== "all" && categoryHasUnnamedItems(active) && !query ? (
              <p className="rounded-card border border-warm-border bg-white/70 px-4 py-3 text-sm text-charcoal/70">
                More {activeCategoryName} dishes are available in-store than are
                named here — ask us on WhatsApp for the full list and prices.
              </p>
            ) : null}

            {/* Results */}
            {filtered.length > 0 ? (
              <motion.ul
                layout
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    categoryName={categoryNameBySlug.get(item.categorySlug) ?? ""}
                  />
                ))}
              </motion.ul>
            ) : (
              <MenuEmptyState onClear={clearAll} />
            )}

            {/* General current-menu inquiry (always available) */}
            <div className="mt-4 flex flex-col items-start gap-3 rounded-feature border border-warm-border bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-charcoal/75">
                Looking for prices or something not listed? We&rsquo;ll share the
                current menu on WhatsApp.
              </p>
              <MagneticButton>
                <a
                  href={business.whatsapp.menu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-button bg-coriander px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Request Current Menu on WhatsApp
                  <ArrowRight
                    className="h-[18px] w-[18px] transition-transform duration-160 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}
