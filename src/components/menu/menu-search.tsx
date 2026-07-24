"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

/**
 * Controlled search box for the menu explorer. Native <input type="search">
 * with a real associated <label> (not placeholder-only) and an explicit clear
 * button. Wired to the result-count live region via `aria-describedby`.
 */
export function MenuSearch({
  value,
  onChange,
  describedById,
}: {
  value: string;
  onChange: (next: string) => void;
  describedById: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <label htmlFor="menu-search" className="sr-only">
        Search dishes by name
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/45"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        id="menu-search"
        ref={inputRef}
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedById}
        placeholder="Search dishes, e.g. dosa, paneer, noodles…"
        className="w-full rounded-button border border-warm-border bg-white py-3 pl-12 pr-11 text-charcoal shadow-card outline-none transition-colors placeholder:text-charcoal/40 focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-ivory hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
