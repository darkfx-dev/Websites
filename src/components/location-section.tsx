"use client";

import * as React from "react";
import { Clock, MapPin, Phone, Copy, Check } from "lucide-react";
import { business } from "@/data/business";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";

export function LocationSection() {
  const [copied, setCopied] = React.useState(false);
  const resetRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(business.address.full);
      setCopied(true);
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable — the address stays visible and selectable above.
      setCopied(false);
    }
  };

  React.useEffect(
    () => () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    },
    []
  );

  return (
    <section id="location" className="section-y scroll-mt-20 bg-cream">
      <div className="container-page">
        <SectionHeading
          eyebrow="Find us"
          title="Opening hours & location"
          description="Open every day from mid-morning to midnight, at Sunday Hub in Katargam, Surat."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Hours card */}
          <div className="flex flex-col rounded-feature border border-warm-border bg-white p-6 shadow-card sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-card bg-ivory text-tomato">
              <Clock className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
              Opening hours
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-warm-border pt-4">
              <span className="text-charcoal/75">{business.hours.days}</span>
              <span className="font-semibold text-charcoal">
                {business.hours.display}
              </span>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-coriander/12 px-3 py-1 text-sm font-medium text-coriander">
              <span
                className="h-2 w-2 rounded-full bg-coriander"
                aria-hidden="true"
              />
              Open seven days a week
            </p>
          </div>

          {/* Address + actions card */}
          <div className="flex flex-col rounded-feature border border-warm-border bg-white p-6 shadow-card sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-card bg-ivory text-tomato">
              <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
              Address
            </h3>
            <address className="mt-3 not-italic leading-relaxed text-charcoal/80">
              {business.address.full}
            </address>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={business.googleMaps} external variant="primary">
                <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                Get Directions
              </Button>
              <Button href={`tel:${business.telephone}`} variant="secondary">
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                Call Now
              </Button>
              <Button
                href={business.whatsapp.primary}
                external
                variant="whatsapp"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </Button>
              <button
                type="button"
                onClick={copyAddress}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-button border border-warm-border bg-cream px-5 text-[0.9375rem] font-semibold text-charcoal transition-colors duration-160 hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 sm:text-base"
              >
                {copied ? (
                  <Check className="h-[18px] w-[18px] text-coriander" aria-hidden="true" />
                ) : (
                  <Copy className="h-[18px] w-[18px]" aria-hidden="true" />
                )}
                {copied ? "Address copied" : "Copy Address"}
              </button>
            </div>

            {/* Accessible confirmation for screen readers. */}
            <p role="status" aria-live="polite" className="sr-only">
              {copied ? "Address copied to clipboard" : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
