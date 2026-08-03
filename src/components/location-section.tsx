"use client";

import * as React from "react";
import { Clock, MapPin, Phone, Copy, ArrowRight } from "lucide-react";
import { business } from "@/data/business";
import { outlets } from "@/data/outlets";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import {
  useOutletAction,
  useOutletTrigger,
} from "@/components/outlets/outlet-action-provider";

/**
 * "Opening hours & Choose an Outlet".
 *
 * This used to print one branch's address as though it were the company's only
 * destination. It is now a gateway: it says how many outlets there are, links
 * to the finder that lists them, and routes directions/call/WhatsApp/copy
 * through the shared outlet selector. No address is shown here, because there
 * is no single address to show.
 */
export function LocationSection() {
  const { selectedOutlet } = useOutletAction();

  const directionsTrigger = useOutletTrigger(() => ({ type: "directions" }));
  const callTrigger = useOutletTrigger(() => ({ type: "call" }));
  const whatsAppTrigger = useOutletTrigger(() => ({
    type: "general-whatsapp",
  }));
  const copyTrigger = useOutletTrigger(() => ({ type: "copy-address" }));

  return (
    <section id="location" className="section-y scroll-mt-20 bg-cream">
      <div className="container-page">
        <SectionHeading
          eyebrow="Find us"
          title="Opening hours & Choose an Outlet"
          description={`Select the Mahesh Pav Bhaji outlet you would like to visit, call, message, or get directions to. There are ${outlets.length} outlets across Surat.`}
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
            {/* Hours were confirmed for one listing, so they aren't claimed for
                all seven outlets. */}
            <p className="mt-4 text-sm text-charcoal/60">
              {business.hours.note}
            </p>
          </div>

          {/* Outlet gateway card */}
          <div className="flex flex-col rounded-feature border border-warm-border bg-white p-6 shadow-card sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-card bg-ivory text-tomato">
              <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">
              Choose an Outlet
            </h3>
            <p className="mt-3 leading-relaxed text-charcoal/80">
              {selectedOutlet ? (
                <>
                  You last chose{" "}
                  <strong className="font-semibold text-charcoal">
                    {selectedOutlet.name}
                  </strong>{" "}
                  ({selectedOutlet.subtitle}). You can change outlet at any
                  point — every action below asks first.
                </>
              ) : (
                <>
                  Each outlet has its own address, phone number and WhatsApp
                  chat, so pick the one you mean and we&rsquo;ll take you
                  straight there.
                </>
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#outlets" variant="primary">
                View All Outlets
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </Button>
              <Button {...directionsTrigger} variant="secondary">
                <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                Get Directions
              </Button>
              <Button {...callTrigger} variant="secondary">
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                Call Outlet
              </Button>
              <Button {...whatsAppTrigger} variant="whatsapp">
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp Outlet
              </Button>
              <button
                {...copyTrigger}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-button border border-warm-border bg-cream px-5 text-[0.9375rem] font-semibold text-charcoal transition-colors duration-160 hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 sm:text-base"
              >
                <Copy className="h-[18px] w-[18px]" aria-hidden="true" />
                Copy Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
