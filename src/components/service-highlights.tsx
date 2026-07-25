import * as React from "react";
import { Check } from "lucide-react";
import { whyVisit } from "@/data/business";
import { SectionHeading } from "@/components/section-heading";
import { RevealStagger, RevealItem } from "@/components/motion-primitives";

export function ServiceHighlights() {
  return (
    <section id="why-visit" className="section-y scroll-mt-20 bg-cream">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        <SectionHeading
          eyebrow="Why visit"
          title="A Surat favourite across seven outlets"
          description="A large vegetarian kitchen serving Surat families, groups and everyday diners from mid-morning through late night, seven days a week."
        />

        <RevealStagger
          as="ul"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {whyVisit.map((point) => (
            <RevealItem
              as="li"
              key={point}
              className="flex items-start gap-3 rounded-card border border-warm-border bg-white p-4 shadow-card"
            >
              <span
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coriander/12 text-coriander"
                aria-hidden="true"
              >
                <Check className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="text-sm font-medium text-charcoal">{point}</span>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
