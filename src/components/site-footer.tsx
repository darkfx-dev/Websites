"use client";

import * as React from "react";
import Image from "next/image";
import { Phone, MapPin, Clock, Store } from "lucide-react";
import { business, navLinks } from "@/data/business";
import { outlets } from "@/data/outlets";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";

const footerLinkClass =
  "inline-flex items-center gap-2.5 rounded text-charcoal/75 transition-colors hover:text-tomato focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal";

/**
 * The footer used to print one branch's address, phone number, WhatsApp link
 * and map as the company's universal contact details. It now names the number
 * of outlets, points at the finder, and routes each action through the shared
 * outlet selector — the layout, type, spacing and colours are unchanged.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const callTrigger = useOutletTrigger(() => ({ type: "call" }));
  const whatsAppTrigger = useOutletTrigger(() => ({
    type: "general-whatsapp",
  }));
  const directionsTrigger = useOutletTrigger(() => ({ type: "directions" }));

  return (
    <footer className="border-t border-warm-border bg-ivory text-charcoal">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + address */}
          <div>
            <p className="flex items-center gap-3 font-display text-2xl font-semibold">
              <Image
                src="/images/mpb-logo.png"
                alt=""
                width={44}
                height={25}
                className="h-8 w-auto shrink-0"
              />
              {business.name}
            </p>
            <p className="mt-4 flex items-start gap-3 leading-relaxed text-charcoal/70">
              <Store
                className="mt-1 h-5 w-5 shrink-0 text-tomato"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>
                {outlets.length} outlets across Surat.{" "}
                <a
                  href="#outlets"
                  className="rounded font-semibold text-charcoal underline underline-offset-2 transition-colors hover:text-tomato focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                >
                  View all outlets
                </a>
              </span>
            </p>
            <p className="mt-4 flex items-start gap-3 text-charcoal/70">
              <Clock
                className="mt-1 h-5 w-5 shrink-0 text-tomato"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>
                {business.hours.days}, {business.hours.display}
                <span className="mt-1 block text-sm text-charcoal/55">
                  {business.hours.note}
                </span>
              </span>
            </p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal/55">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded text-charcoal/75 transition-colors hover:text-tomato focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal/55">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <button {...callTrigger} className={footerLinkClass}>
                  <Phone className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  Call an Outlet
                </button>
              </li>
              <li>
                <button {...whatsAppTrigger} className={footerLinkClass}>
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  WhatsApp an Outlet
                </button>
              </li>
              <li>
                <button {...directionsTrigger} className={footerLinkClass}>
                  <MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  Get Outlet Directions
                </button>
              </li>
              <li>
                <a
                  href={business.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  <InstagramIcon className="h-[18px] w-[18px]" />
                  {business.instagram.handle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-warm-border pt-6 text-sm text-charcoal/55 sm:flex-row sm:items-center sm:justify-between">
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
