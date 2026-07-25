"use client";

import * as React from "react";
import { LocateFixed } from "lucide-react";
import { outlets, hasOutletCoordinates, type Outlet } from "@/data/outlets";
import { haversineKm, formatApproxKm } from "@/lib/distance";
import { SectionHeading } from "@/components/section-heading";
import { RevealStagger, RevealItem, Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { OutletCard } from "./outlet-card";
import { OutletEnquiryModal } from "./outlet-enquiry-modal";

type LocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "ready"; distancesKm: Record<string, number | null> }
  | { status: "error"; message: string };

/**
 * "Which Outlet is Nearest to You?" — browse all outlets, optionally use the
 * browser's location to highlight the closest one, then send a structured
 * enquiry to that outlet's WhatsApp.
 *
 * PRIVACY: coordinates are read once, on an explicit user action, held only in
 * this component's state for the lifetime of the interaction, and never stored,
 * transmitted, logged, or included in the WhatsApp message.
 *
 * Location is strictly an enhancement — every outlet is selectable without it,
 * and the control is not offered at all while outlet coordinates are unverified
 * (see the note on `Outlet.coordinates`), rather than offering a button that
 * cannot produce an answer.
 */
export function OutletFinderSection() {
  const [location, setLocation] = React.useState<LocationState>({
    status: "idle",
  });
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  // Keyed by outlet id so focus can be returned to the exact card that opened
  // the dialog, per WCAG focus-restoration expectations.
  const cardRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const distancesKm =
    location.status === "ready" ? location.distancesKm : null;

  /** Nearest outlet id, or null when no usable distance exists. */
  const nearestId = React.useMemo(() => {
    if (!distancesKm) return null;
    let bestId: string | null = null;
    let bestKm = Infinity;
    for (const outlet of outlets) {
      const km = distancesKm[outlet.id];
      // Compared as raw numbers — never as formatted strings.
      if (typeof km === "number" && Number.isFinite(km) && km < bestKm) {
        bestKm = km;
        bestId = outlet.id;
      }
    }
    return bestId;
  }, [distancesKm]);

  const nearestOutlet = nearestId
    ? outlets.find((o) => o.id === nearestId) ?? null
    : null;

  const requestLocation = () => {
    // Check the API is actually usable rather than merely present: in an
    // insecure or otherwise unsupported context `navigator.geolocation` can
    // exist as a key while being undefined or lacking the method.
    const geo =
      typeof navigator !== "undefined" ? navigator.geolocation : undefined;
    if (!geo || typeof geo.getCurrentPosition !== "function") {
      setLocation({
        status: "error",
        message:
          "Your browser doesn't support location sharing. You can still select any outlet manually below.",
      });
      return;
    }

    setLocation({ status: "locating" });
    try {
      geo.getCurrentPosition(
      (position) => {
        const from = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const next: Record<string, number | null> = {};
        for (const outlet of outlets) {
          next[outlet.id] = haversineKm(from, outlet.coordinates);
        }
        const anyDistance = Object.values(next).some((km) => km !== null);
        if (!anyDistance) {
          setLocation({
            status: "error",
            message:
              "We couldn't work out distances just now. You can still select any outlet manually below.",
          });
          return;
        }
        setLocation({ status: "ready", distancesKm: next });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? "No problem — location wasn't shared. You can still select any outlet manually below."
            : err.code === err.TIMEOUT
              ? "Finding your location took too long. You can still select any outlet manually below."
              : "We couldn't get your location. You can still select any outlet manually below.";
        setLocation({ status: "error", message });
        },
        // One-shot, no watching, no background access, modest timeout.
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
      );
    } catch {
      // Some browsers throw synchronously in a disallowed context rather than
      // calling the error callback. A recoverable failure must never take the
      // section down with it.
      setLocation({
        status: "error",
        message:
          "We couldn't get your location. You can still select any outlet manually below.",
      });
    }
  };

  const openFor = (outlet: Outlet) => {
    setSelectedId(outlet.id);
    setModalOpen(true);
  };

  const closeModal = React.useCallback(() => {
    setModalOpen(false);
    // Return focus to the card that opened the dialog.
    const id = selectedId;
    if (id) {
      window.requestAnimationFrame(() => cardRefs.current[id]?.focus());
    }
  }, [selectedId]);

  const selectedOutlet = selectedId
    ? outlets.find((o) => o.id === selectedId) ?? null
    : null;

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
        {hasOutletCoordinates ? (
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
                isSelected={selectedId === outlet.id && modalOpen}
                isNearest={nearestId === outlet.id}
                distanceLabel={formatApproxKm(distancesKm?.[outlet.id] ?? null)}
                onSelect={() => openFor(outlet)}
                buttonRef={(node) => {
                  cardRefs.current[outlet.id] = node;
                }}
              />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>

      <OutletEnquiryModal
        outlet={selectedOutlet}
        open={modalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
