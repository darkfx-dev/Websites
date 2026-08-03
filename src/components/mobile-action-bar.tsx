"use client";

import * as React from "react";
import { Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";

const tileClass =
  "flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-medium text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-charcoal";

/**
 * Persistent bottom action bar for mobile: Call, Directions, WhatsApp.
 * Hidden on desktop (lg+), respects the safe-area inset, and keeps every
 * touch target comfortably large.
 *
 * All three go through the same outlet router as their desktop counterparts —
 * there is no separate mobile routing — so the first tap opens the selector
 * rather than leaving the site for a branch the visitor didn't choose.
 */
export function MobileActionBar() {
  const callTrigger = useOutletTrigger(() => ({ type: "call" }));
  const directionsTrigger = useOutletTrigger(() => ({ type: "directions" }));
  const whatsAppTrigger = useOutletTrigger(() => ({
    type: "general-whatsapp",
  }));

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-warm-border bg-cream/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <nav aria-label="Quick actions" className="grid grid-cols-3">
        <button {...callTrigger} className={tileClass}>
          <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Call
        </button>
        <button
          {...directionsTrigger}
          className={`${tileClass} border-x border-warm-border`}
        >
          <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Directions
        </button>
        <button
          {...whatsAppTrigger}
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 bg-coriander text-xs font-semibold text-white transition-colors hover:bg-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </button>
      </nav>
    </div>
  );
}
