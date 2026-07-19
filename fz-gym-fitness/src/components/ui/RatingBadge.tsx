import { Star } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/lib/utils";

/**
 * Genuine rating badge (4.9 ★ · 505 Reviews). Links to the real Google Maps
 * listing so visitors can verify the reviews themselves.
 */
export function RatingBadge({ className }: { className?: string }) {
  return (
    <a
      href={siteConfig.links.googleMaps}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Rated ${siteConfig.rating} out of 5 from ${siteConfig.reviewCount} reviews on Google Maps`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-4 py-2 text-sm font-semibold text-ink transition-all hover:border-lime hover:shadow-neon-lime",
        className
      )}
    >
      <Star className="h-4 w-4 fill-lime text-lime" aria-hidden="true" />
      <span>
        {siteConfig.rating} <span className="text-lime">★</span> ·{" "}
        {siteConfig.reviewCount} Reviews
      </span>
    </a>
  );
}
