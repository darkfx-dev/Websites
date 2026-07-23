"use client";

import * as React from "react";
import { Phone, MapPin } from "lucide-react";
import { business } from "@/data/business";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Persistent bottom action bar for mobile: Call, Directions, WhatsApp.
 * Hidden on desktop (lg+), respects the safe-area inset, and keeps every
 * touch target comfortably large.
 */
export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-warm-border bg-cream/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <nav aria-label="Quick actions" className="grid grid-cols-3">
        <a
          href={`tel:${business.telephone}`}
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-medium text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-charcoal"
        >
          <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Call
        </a>
        <a
          href={business.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 border-x border-warm-border text-xs font-medium text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-charcoal"
        >
          <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a
          href={business.whatsapp.primary}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 bg-coriander text-xs font-semibold text-white transition-colors hover:bg-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </nav>
    </div>
  );
}
