import * as React from "react";
import { ArrowRight } from "lucide-react";
import { menuCategories, business } from "@/data/business";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion-primitives";

export function MenuCategoryGrid() {
  return (
    <section aria-labelledby="menu-explorer-heading" className="section-y bg-ivory">
      <div className="container-page">
        <SectionHeading
          eyebrow="Explore the full menu"
          title={<span id="menu-explorer-heading">Every category, at a glance</span>}
          description="Fourteen categories across roughly 160 dishes and variations. Counts reflect the delivery menu and can change — message us on WhatsApp for the current list and prices."
        />

        <RevealStagger
          as="ul"
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {menuCategories.map((cat) => (
            <RevealItem
              as="li"
              key={cat.name}
              className="group flex min-w-0 items-center justify-between gap-3 rounded-card border border-warm-border bg-white p-4 shadow-card transition-transform duration-220 ease-standard hover:-translate-y-0.5 sm:p-5"
            >
              <span className="min-w-0 font-medium text-charcoal">
                {cat.name}
              </span>
              <span
                className="inline-flex min-w-9 shrink-0 items-center justify-center rounded-full bg-ivory px-2 py-1 font-display text-sm font-semibold text-tomato"
                aria-label={`${cat.count} items`}
              >
                {cat.count}
              </span>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-col items-start gap-3 rounded-feature border border-warm-border bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal/75">
              Want the current menu with prices and today&rsquo;s availability?
            </p>
            <Button href={business.whatsapp.menu} external variant="whatsapp">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Request Current Menu on WhatsApp
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-160 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
