import * as React from "react";
import {
  CookingPot,
  Leaf,
  Utensils,
  Flame,
  Soup,
  Pizza,
  Cookie,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { menuHighlights } from "@/data/business";
import { SectionHeading } from "@/components/section-heading";
import { RevealStagger, RevealItem } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

// Icons paired to the verified highlight groups (decorative).
const icons: Record<string, LucideIcon> = {
  "Classic Pav Bhaji": CookingPot,
  "Jain & Paneer Bhaji": Leaf,
  "South Indian Dosa": Utensils,
  "Indo-Chinese": Flame,
  "Rice & Noodles": Soup,
  "Pizza & Sandwiches": Pizza,
  "Chaats & Snacks": Cookie,
  Combos: Boxes,
};

export function MenuHighlights() {
  return (
    <section id="menu" className="section-y scroll-mt-20 bg-cream">
      <div className="container-page">
        <SectionHeading
          eyebrow="Signature highlights"
          title="A menu built for every craving"
          description="Eight verified food groups spanning street-food classics, South Indian, Indo-Chinese and more. Prices and availability are shared on WhatsApp."
        />

        <RevealStagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {menuHighlights.map((item, i) => {
            const Icon = icons[item.title] ?? Utensils;
            // Feature the first card as a larger bento tile on wide screens.
            const featured = i === 0;
            return (
              <RevealItem
                key={item.title}
                className={cn(
                  featured && "sm:col-span-2 lg:row-span-2"
                )}
              >
                <article
                  className={cn(
                    "flex h-full flex-col rounded-feature border border-warm-border bg-white p-6 shadow-card transition-transform duration-220 ease-standard hover:-translate-y-0.5",
                    featured &&
                      "bg-charcoal text-cream lg:justify-between lg:p-8"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-card",
                      featured
                        ? "bg-saffron/15 text-saffron"
                        : "bg-ivory text-tomato"
                    )}
                  >
                    <Icon
                      className="h-6 w-6"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div className={cn(featured ? "mt-6 lg:mt-10" : "mt-5")}>
                    <h3
                      className={cn(
                        "font-display font-semibold",
                        featured
                          ? "text-2xl lg:text-3xl"
                          : "text-xl text-charcoal"
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed",
                        featured ? "text-cream/80" : "text-charcoal/70"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
