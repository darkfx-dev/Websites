import * as React from "react";
import { Phone, MapPin, ArrowRight, Star } from "lucide-react";
import { business } from "@/data/business";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { HeroArtwork } from "@/components/hero-artwork";
import { Reveal } from "@/components/motion-primitives";

const trust = [
  { label: "Google Rating", value: `${business.rating}` },
  { label: "Reviews", value: business.reviewCount.toLocaleString("en-IN") },
  { label: "Open", value: "Daily" },
  { label: "Hours", value: business.hours.display },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="grain relative isolate overflow-hidden bg-charcoal text-cream"
    >
      {/* Ambient spice-tone glows (decorative). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-saffron/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-tomato/10 blur-3xl"
      />

      <div className="container-page relative grid gap-10 pb-16 pt-28 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-36">
        {/* Copy column */}
        <div className="max-w-xl">
          <Reveal as="div">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-saffron">
              {business.tagline}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[1.02]">
              Pav Bhaji, Dosa, Chinese &amp; More
              <span className="block text-saffron">
                Served Fresh Every Day
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-base text-cream/80 sm:text-lg">
              Explore Mahesh Pav Bhaji&rsquo;s extensive vegetarian menu, from
              classic pav bhaji and South Indian favourites to Chinese dishes,
              rice, pizza, sandwiches and chaats.
            </p>
          </Reveal>

          {/* Primary + secondary CTAs */}
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#menu" variant="primary" size="lg">
                Explore the Menu
                <ArrowRight
                  className="h-[18px] w-[18px] transition-transform duration-160 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
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
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                href={`tel:${business.telephone}`}
                variant="dark"
                aria-label={`Call Mahesh Pav Bhaji at ${business.displayTelephone}`}
              >
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                Call Now
              </Button>
              <Button href={business.googleMaps} external variant="dark">
                <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                Get Directions
              </Button>
            </div>
          </Reveal>

          {/* Trust row */}
          <Reveal delay={0.38}>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
              {trust.map((t) => (
                <div key={t.label} className="flex flex-col">
                  <dt className="order-2 text-xs uppercase tracking-wide text-cream/60">
                    {t.label}
                  </dt>
                  <dd className="order-1 flex items-center gap-1 font-display text-xl font-semibold text-cream">
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

        {/* Artwork column */}
        <Reveal delay={0.2} className="order-first lg:order-none">
          <div className="relative mx-auto w-full max-w-[440px]">
            <HeroArtwork className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
