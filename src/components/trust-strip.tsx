import * as React from "react";
import { Star, MessageSquareText, Store, CalendarDays, MapPin, UtensilsCrossed } from "lucide-react";
import { business } from "@/data/business";
import { outlets } from "@/data/outlets";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion-primitives";

const stats = [
  {
    icon: Star,
    value: `${business.rating}`,
    label: "Google Rating",
  },
  {
    icon: MessageSquareText,
    value: business.reviewCount.toLocaleString("en-IN"),
    label: "Reviews",
  },
  {
    icon: Store,
    value: business.fiveStarReviews.toLocaleString("en-IN"),
    label: "Five-Star Reviews",
  },
  {
    icon: CalendarDays,
    value: "7 Days",
    label: "Open Every Week",
  },
  {
    icon: MapPin,
    value: `${outlets.length} Outlets`,
    label: "Across Surat",
  },
  {
    icon: UtensilsCrossed,
    value: `~${business.approxMenuVariations}`,
    label: "Menu Variations",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Business highlights" className="bg-ivory">
      <div className="container-page py-10 sm:py-12">
        <RevealStagger className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <RevealItem
              key={label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <Icon
                className="mb-1 h-5 w-5 text-tomato"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="font-display text-2xl font-semibold text-charcoal">
                {value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
                {label}
              </span>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-charcoal/70">
            Rating and menu figures last verified on{" "}
            {business.lastVerifiedDisplay} and may change.{" "}
            {business.reviews.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
