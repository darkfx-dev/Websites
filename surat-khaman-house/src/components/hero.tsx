import { Phone, Star } from "lucide-react";

import { HeroEntranceCTAs } from "@/components/hero-ctas";
import { HeroItem } from "@/components/motion/hero-entrance";
import { HeroObject } from "@/components/motion/hero-object";
import { business } from "@/data/business";

/**
 * Server Component. The copy, the rating line and the hours line are all in
 * the initial HTML; only the entrance wrapper and the abstract accent are
 * client-side, so nothing here depends on hydration to be readable.
 *
 * Contains no area name, address, landmark, map, directions CTA or location
 * pin, and no "near you" / "find us" / "visit us" wording.
 */
export function Hero() {
  return (
    <section className="grain relative overflow-hidden border-b border-[rgba(10,10,10,0.12)]">
      <div className="container-page relative grid gap-12 pb-16 pt-12 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <HeroItem index={0}>
            <p
              lang="gu"
              className="font-gujarati-sans text-base text-chutney"
            >
              સુરતી સ્વાદ, સીધી વાત
            </p>
          </HeroItem>

          <HeroItem index={1}>
            <h1 className="mt-4 max-w-[15ch] font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.04] tracking-[-0.015em] text-ink">
              Locho, khaman and farsan—browse the complete menu.
            </h1>
          </HeroItem>

          <HeroItem index={2}>
            <p className="mt-6 max-w-measure text-lg text-ink-soft">
              Explore all listed items, check reference prices and ask about
              today&rsquo;s availability before making an inquiry.
            </p>
          </HeroItem>

          <HeroItem index={3}>
            <HeroEntranceCTAs />
          </HeroItem>

          <HeroItem index={4}>
            <div className="mt-8 flex flex-col gap-2 border-t border-[rgba(10,10,10,0.12)] pt-5 text-sm text-ink-soft sm:flex-row sm:items-center sm:gap-6">
              <span className="inline-flex items-center gap-2">
                <Star
                  className="h-4 w-4 fill-khaman text-khaman"
                  aria-hidden
                />
                {business.rating.line}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted" aria-hidden />
                {business.hoursFallback}
              </span>
            </div>
          </HeroItem>
        </div>

        <div className="lg:col-span-5">
          <HeroObject />
        </div>
      </div>
    </section>
  );
}
