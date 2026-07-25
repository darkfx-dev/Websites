"use client";

import * as React from "react";
import { Check, MapPin, Navigation, Phone } from "lucide-react";
import type { Outlet } from "@/data/outlets";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * One outlet in the finder grid.
 *
 * The whole card is a single <button>: it is one action (choose this outlet),
 * so it stays one control rather than a clickable <div> wrapping other
 * controls. Selection and "nearest" are both conveyed by text/icon as well as
 * colour, never colour alone.
 */
export function OutletCard({
  outlet,
  isSelected,
  isNearest,
  distanceLabel,
  onSelect,
  buttonRef,
}: {
  outlet: Outlet;
  isSelected: boolean;
  isNearest: boolean;
  distanceLabel: string | null;
  onSelect: () => void;
  buttonRef?: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      // Identifies which outlet a card is without relying on its rendered text
      // (the "nearest" badge renders above the name, and addresses share place
      // names). No visual effect.
      data-outlet-id={outlet.id}
      className={cn(
        "group relative flex h-full w-full flex-col rounded-feature border bg-white p-6 text-left",
        "shadow-card transition-[transform,border-color,box-shadow] duration-220 ease-standard",
        "hover:-translate-y-1 hover:shadow-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
        isSelected
          ? "border-tomato shadow-elevated"
          : isNearest
            ? "border-saffron"
            : "border-warm-border hover:border-saffron/60"
      )}
    >
      {/* Nearest badge. Only ever rendered when a real distance backs it up. */}
      {isNearest ? (
        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-saffron/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#8a5a10]">
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
          Nearest to you
        </span>
      ) : null}

      <span className="flex items-start justify-between gap-3">
        <span className="block">
          <span className="block font-display text-xl font-semibold text-charcoal">
            {outlet.name}
          </span>
          <span className="mt-1 block text-sm font-medium text-tomato">
            {outlet.subtitle}
          </span>
        </span>
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-card transition-colors",
            isSelected ? "bg-tomato text-white" : "bg-ivory text-tomato"
          )}
        >
          {isSelected ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </span>
      </span>

      <address className="mt-4 not-italic text-sm leading-relaxed text-charcoal/70">
        {outlet.addressLines.map((line) => (
          <React.Fragment key={line}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </address>

      {/*
        Shown as text, not a tel: link — the card is itself a <button>, and a
        link inside a button is invalid. It is here so this outlet's own number
        is readable (and dialable by hand) even if the scripted flow never runs.
      */}
      <span className="mt-3 flex items-center gap-2 text-sm font-medium text-charcoal/75">
        <Phone className="h-4 w-4 shrink-0 text-tomato" strokeWidth={1.75} aria-hidden="true" />
        {outlet.phone}
      </span>

      {distanceLabel ? (
        <span className="mt-3 block text-sm font-medium text-charcoal/60">
          {distanceLabel}
        </span>
      ) : null}

      <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-coriander">
        <WhatsAppIcon className="h-[18px] w-[18px]" />
        {isSelected ? "Selected — opening options" : "Select Outlet"}
      </span>
    </button>
  );
}
