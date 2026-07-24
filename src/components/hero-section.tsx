import * as React from "react";
import { Phone, MapPin, ArrowRight, Star } from "lucide-react";
import { business } from "@/data/business";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Reveal } from "@/components/motion-primitives";

const trust = [
  { label: "Google Rating", value: `${business.rating}` },
  { label: "Reviews", value: business.reviewCount.toLocaleString("en-IN") },
  { label: "Open", value: "Daily" },
  { label: "Hours", value: business.hours.display },
];

/**
 * White-theme hero. Purely typographic — the illustrated tawa mark was removed,
 * so the headline itself is the focal point and the page opens on clean white.
 * Accent colour (saffron/tomato) carries the brand against the white ground.
 */
export function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-cream">
      {/* Very soft accent washes — kept faint so the ground still reads white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 -z-10 h-[520px] w-[520px] rounded-full bg-saffron/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-tomato/[0.05] blur-3xl"
      />

      <div className="container-page relative flex flex-col items-center pb-20 pt-32 text-center sm:pt-36 lg:pb-28 lg:pt-44">
        <Reveal as="div">
          <span className="inline-flex items-center gap-2 rounded-full border border-warm-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-tomato shadow-card">
            {business.tagline}
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[1.02] text-charcoal">
            Pav Bhaji, Dosa, Chinese &amp; More
            <span className="block text-saffron">Served Fresh Every Day</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base text-charcoal/70 sm:text-lg">
            Explore Mahesh Pav Bhaji&rsquo;s extensive vegetarian menu, from
            classic pav bhaji and South Indian favourites to Chinese dishes,
            rice, pizza, sandwiches and chaats.
          </p>
        </Reveal>

        {/* Primary + secondary CTAs */}
        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <MagneticButton>
              <Button href="#menu" variant="primary" size="lg">
                Explore the Menu
                <ArrowRight
                  className="h-[18px] w-[18px] transition-transform duration-160 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </MagneticButton>
            <Button
              href={business.whatsapp.primary}
              external
              variant="whatsapp"
              size="lg"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              WhatsApp Us
            </Button>
          </div>
        </Reveal>

        {/* Additional quick actions */}
        <Reveal delay={0.3}>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Button
              href={`tel:${business.telephone}`}
              variant="secondary"
              aria-label={`Call Mahesh Pav Bhaji at ${business.displayTelephone}`}
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call Now
            </Button>
            <Button href={business.googleMaps} external variant="secondary">
              <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
              Get Directions
            </Button>
          </div>
        </Reveal>

        {/* Trust row */}
        <Reveal delay={0.38}>
          <dl className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-5 border-t border-warm-border pt-8">
            {trust.map((t) => (
              <div key={t.label} className="flex flex-col">
                <dt className="order-2 text-xs uppercase tracking-wide text-charcoal/55">
                  {t.label}
                </dt>
                <dd className="order-1 flex items-center justify-center gap-1 font-display text-xl font-semibold text-charcoal">
                  {t.label === "Google Rating" ? (
                    <Star
                      className="h-4 w-4 fill-saffron text-saffron"
                      aria-hidden="true"
                    />
                  ) : null}
                  {t.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
