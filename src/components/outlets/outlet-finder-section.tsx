"use client";

import * as React from "react";
import { LocateFixed } from "lucide-react";
import { outlets } from "@/data/outlets";
import { formatApproxKm } from "@/lib/distance";
import { SectionHeading } from "@/components/section-heading";
import { RevealStagger, RevealItem, Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { OutletCard } from "./outlet-card";
import { useOutletAction } from "./outlet-action-provider";

/**
 * "Which Outlet is Nearest to You?" — browse all outlets, optionally use the
 * browser's location to highlight the closest one, then send a structured
 * enquiry to that outlet's WhatsApp.
 *
 * Selecting a card starts a general WhatsApp enquiry with that outlet already
 * chosen, so it opens straight on the enquiry step of the site-wide outlet
 * dialog rather than asking again. Location state lives in the shared router,
 * so a distance measured here is also available to every other outlet action.
 *
 * PRIVACY: coordinates are read once, on an explicit user action, held only in
 * memory for the lifetime of the interaction, and never stored, transmitted,
 * logged, or included in the WhatsApp message.
 *
 * Location is strictly an enhancement — every outlet is selectable without it,
 * and the control is not offered at all while outlet coordinates are unverified
 * (see the note on `Outlet.coordinates`), rather than offering a button that
 * cannot produce an answer.
 */
export function OutletFinderSection() {
  const {
    start,
    pending,
    selectedOutletId,
    canUseLocation,
    location,
    distancesKm,
    nearestId,
    nearestOutlet,
    requestLocation,
  } = useOutletAction();

  // Focus restoration is handled centrally: the router captures whichever
  // control started an action and returns focus to it when the dialog closes.
  return (
    <section
      id="outlets"
      aria-labelledby="outlets-heading"
      className="section-y scroll-mt-20 bg-cream"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Find your outlet"
            title={
              <span id="outlets-heading">Which Outlet is Nearest to You?</span>
            }
            description="Choose your nearest Mahesh Pav Bhaji outlet and tell us what you're looking for. We'll connect you directly with the correct outlet on WhatsApp in just a few taps. The system will intelligently detect your location (if permitted) and suggest the closest branch with approximate distance, ensuring faster ordering and better service."
          />
        </Reveal>

        {/* Location is requested only after a deliberate tap — never on load. */}
        {canUseLocation ? (
          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-col items-start gap-3 rounded-feature border border-warm-border bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-charcoal/75">
                Share your location and we&rsquo;ll point you to the closest
                branch. Your location stays on your device.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={requestLocation}
                disabled={location.status === "locating"}
                className="shrink-0"
              >
                <LocateFixed className="h-[18px] w-[18px]" aria-hidden="true" />
                {location.status === "locating"
                  ? "Finding your location…"
                  : "Find my nearest outlet"}
              </Button>
            </div>
          </Reveal>
        ) : null}

        {/* Status is announced politely rather than interrupting. */}
        <p aria-live="polite" className="sr-only">
          {location.status === "ready" && nearestOutlet
            ? `Nearest outlet: ${nearestOutlet.name}, ${nearestOutlet.subtitle}. ${
                formatApproxKm(distancesKm?.[nearestOutlet.id] ?? null) ?? ""
              }`
            : location.status === "error"
              ? location.message
              : ""}
        </p>

        {location.status === "error" ? (
          <p className="mt-4 rounded-card border border-warm-border bg-white px-4 py-3 text-sm text-charcoal/75">
            {location.message}
          </p>
        ) : null}

        {location.status === "ready" && nearestOutlet ? (
          <p className="mt-4 rounded-card border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-charcoal/80">
            Based on your current location, your nearest outlet is{" "}
            <strong className="font-semibold text-charcoal">
              {nearestOutlet.name}
            </strong>{" "}
            ({nearestOutlet.subtitle}).{" "}
            {formatApproxKm(distancesKm?.[nearestOutlet.id] ?? null)} in a
            straight line.
          </p>
        ) : null}

        {/* Order is stable — the nearest outlet is highlighted in place rather
            than resorted, so cards never jump under the user's finger. */}
        <RevealStagger
          as="ul"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {outlets.map((outlet) => (
            <RevealItem as="li" key={outlet.id} className="min-w-0">
              <OutletCard
                outlet={outlet}
                isSelected={selectedOutletId === outlet.id && pending !== null}
                isNearest={nearestId === outlet.id}
                distanceLabel={formatApproxKm(distancesKm?.[outlet.id] ?? null)}
                onSelect={() =>
                  start({ type: "general-whatsapp" }, { outletId: outlet.id })
                }
              />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
