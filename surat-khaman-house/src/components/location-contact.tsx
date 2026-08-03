import { MapPin, MessageCircle, Phone } from "lucide-react";

import { CopyAddressButton } from "@/components/copy-address-button";
import { Reveal } from "@/components/motion/reveal";
import { ActionLink } from "@/components/ui/action-link";
import { business } from "@/data/business";
import { mapsHref, telHref, whatsappHref } from "@/lib/links";

/**
 * The final substantial section, immediately before the footer.
 *
 * This is the first and only place the site may reveal the outlet qualifier,
 * the complete address, the landmark or directions. Everything above this
 * point is deliberately location-free.
 *
 * The composition is typography-led with a restrained route-line graphic
 * rather than an embedded map: no paid Maps API is used, and the Google Maps
 * link is a plain anchor so location is never locked behind an iframe.
 */
export function LocationContact() {
  const { location } = business;

  return (
    <section
      id="location"
      className="section-y border-b border-[rgba(10,10,10,0.12)] bg-surface-muted"
    >
      <Reveal className="container-page">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          05 — Location &amp; Contact
        </p>

        <div className="mt-3 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em] text-ink">
              Find the Adajan Patiya outlet
            </h2>

            <p className="mt-8 text-lg font-semibold text-ink">
              {business.outletDisplayName}
            </p>

            <address className="mt-3 max-w-measure text-lg not-italic leading-[1.55] text-ink-soft">
              {location.full}
            </address>

            <p className="mt-6 text-sm text-muted">{business.hoursFallback}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink href={mapsHref} external size="lg">
                <MapPin className="h-4 w-4" aria-hidden />
                Open in Google Maps
              </ActionLink>
              <CopyAddressButton address={location.full} />
              <ActionLink href={telHref} variant="secondary" size="lg">
                <Phone className="h-4 w-4" aria-hidden />
                Call {business.telephone.display}
              </ActionLink>
              <ActionLink
                href={whatsappHref}
                external
                variant="secondary"
                size="lg"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Ask on WhatsApp
              </ActionLink>
            </div>
          </div>

          {/* Restrained route-line graphic. Abstract and decorative: every
              piece of location information is available as text above. */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full border border-[rgba(10,10,10,0.12)] bg-surface">
              <svg
                viewBox="0 0 320 240"
                className="h-full w-full"
                aria-hidden
                role="presentation"
                focusable="false"
              >
                <g stroke="#d8d8d2" strokeWidth="1" fill="none">
                  <path d="M0 62h320M0 128h320M0 194h320" />
                  <path d="M74 0v240M168 0v240M252 0v240" />
                </g>
                <path
                  d="M20 210 C 96 210, 96 128, 168 128 S 244 92, 300 44"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="2"
                  strokeDasharray="7 6"
                  strokeLinecap="round"
                />
                <circle cx="168" cy="128" r="9" fill="#a43227" />
                <circle cx="168" cy="128" r="17" fill="none" stroke="#a43227" strokeWidth="1.5" opacity="0.5" />
                <rect x="196" y="104" width="66" height="20" fill="#e9c934" opacity="0.9" />
              </svg>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
