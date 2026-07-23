import { CalendarClock, MapPin, Clock, Star } from "lucide-react";
import { business } from "../config/business";

/* Confirmed facts only. The rating item renders solely when an exact rating,
   an exact count, a source, and showRating are all present — never a range. */
export function TrustStrip() {
  const items = [
    { icon: CalendarClock, label: "Since 2003" },
    { icon: MapPin, label: "Katargam, Surat" },
    { icon: Clock, label: "Open seven days" },
  ];

  const showRating =
    business.showRating &&
    business.rating != null &&
    business.reviewCount != null &&
    business.ratingSource != null;

  return (
    <section aria-label="At a glance" className="border-b border-silver-line bg-ivory">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-[0.9rem] text-muted-ink">
        {items.map((it) => (
          <span key={it.label} className="inline-flex items-center gap-2">
            <it.icon className="h-4 w-4 text-forest-rich" aria-hidden="true" />
            {it.label}
          </span>
        ))}
        {showRating && (
          <span className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 fill-forest-rich text-forest-rich" aria-hidden="true" />
            {business.rating} · {business.reviewCount} reviews
            <span className="sr-only"> (source: {business.ratingSource})</span>
          </span>
        )}
      </div>
    </section>
  );
}
