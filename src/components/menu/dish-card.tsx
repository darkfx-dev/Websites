"use client";

import * as React from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import { TiltCard } from "@/components/motion/tilt-card";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";

/**
 * A single dish. Shows ONLY the verified name + its category and one action —
 * a dish-specific WhatsApp enquiry. No price/description/photo/tag, because
 * none is verified. `layout` gives a smooth reflow as the filtered set changes
 * (position interpolation per card, not a whole-grid fade per keystroke).
 *
 * Availability differs by outlet, so the enquiry asks which branch first. The
 * exact dish name from this card is carried through that step unchanged.
 */
export function DishCard({
  item,
  categoryName,
}: {
  item: MenuItem;
  categoryName: string;
}) {
  const trigger = useOutletTrigger(() => ({
    type: "dish-whatsapp",
    dishName: item.name,
  }));

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
        <button
          {...trigger}
          aria-label={`Ask an outlet about ${item.name} on WhatsApp`}
          className="relative z-10 inline-flex min-h-[24px] items-center gap-2 self-start rounded-control text-sm font-semibold text-coriander transition-colors hover:text-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Ask on WhatsApp
        </button>
      </TiltCard>
    </motion.li>
  );
}
