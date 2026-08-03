"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";

/**
 * Shown when a filter/search combination matches no named dishes. Never a dead
 * end — offers a reset and a real WhatsApp enquiry (the dish may exist in-store
 * even if it isn't in the named list, e.g. the unnamed South Indian variations),
 * routed to whichever outlet the visitor picks.
 */
export function MenuEmptyState({ onClear }: { onClear: () => void }) {
  const trigger = useOutletTrigger(() => ({ type: "request-menu" }));

  return (
    <div className="flex flex-col items-center gap-4 rounded-feature border border-dashed border-warm-border bg-white/60 px-6 py-14 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-card bg-ivory text-tomato">
        <SearchX className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-charcoal">
          No dishes match that search
        </p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-charcoal/70">
          Try a different name or clear the filters. Our full range is larger
          than the names listed here — just ask us for anything you don&rsquo;t
          see.
        </p>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-[44px] items-center rounded-button border border-warm-border bg-cream px-4 text-sm font-semibold text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
        >
          Clear filters
        </button>
        <button
          {...trigger}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-button bg-coriander px-4 text-sm font-semibold text-white transition-colors hover:bg-[#27563c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coriander focus-visible:ring-offset-2"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Ask on WhatsApp
        </button>
      </div>
    </div>
  );
}
