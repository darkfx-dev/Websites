import * as React from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import { business, navLinks } from "@/data/business";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-deep text-cream">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + address */}
          <div>
            <p className="font-display text-2xl font-semibold">
              {business.name}
            </p>
            <address className="mt-4 flex items-start gap-3 not-italic leading-relaxed text-cream/75">
              <MapPin
                className="mt-1 h-5 w-5 shrink-0 text-saffron"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {business.address.full}
            </address>
            <p className="mt-4 flex items-center gap-3 text-cream/75">
              <Clock
                className="h-5 w-5 shrink-0 text-saffron"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {business.hours.days}, {business.hours.display}
            </p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded text-cream/80 transition-colors hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${business.telephone}`}
                  className="inline-flex items-center gap-2.5 rounded text-cream/80 transition-colors hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                >
                  <Phone className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  {business.displayTelephone}
                </a>
              </li>
              <li>
                <a
                  href={business.whatsapp.primary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded text-cream/80 transition-colors hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={business.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded text-cream/80 transition-colors hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                >
                  <MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  Google Maps
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={business.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded text-cream/80 transition-colors hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                >
                  <InstagramIcon className="h-[18px] w-[18px]" />
                  {business.instagram.handle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {business.name}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            All menu items, availability, prices, opening hours and rating
            information may change.
          </p>
        </div>
      </div>
    </footer>
  );
}
