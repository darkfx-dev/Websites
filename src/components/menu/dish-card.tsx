"use client";

import * as React from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import { buildDishInquiryUrl } from "@/lib/whatsapp";
import { TiltCard } from "@/components/motion/tilt-card";

/**
 * A single dish. Shows ONLY the verified name + its category and one action —
 * a dish-specific WhatsApp inquiry. No price/description/photo/tag, because
 * none is verified. `layout` gives a smooth reflow as the filtered set changes
 * (position interpolation per card, not a whole-grid fade per keystroke).
 */
export function DishCard({
  item,
  categoryName,
}: {
  item: MenuItem;
  categoryName: string;
}) {
  return (
    <motion.li
      layout="position"
      className="h-full [perspective:1000px]"
    >
      <TiltCard className="flex h-full flex-col justify-between gap-4 rounded-card border border-warm-border bg-white p-5 shadow-card">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-charcoal">
            {item.name}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-charcoal/55">
            {categoryName}
          </p>
        </div>
        <a
          href={buildDishInquiryUrl(item.name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ask about ${item.name} on WhatsApp`}
          className="relative z-10 inline-flex items-center gap-2 self-start rounded-control text-sm font-semibold text-coriander transition-colors hover:text-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Ask on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </TiltCard>
    </motion.li>
  );
}
