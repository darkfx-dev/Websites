"use client";

import * as React from "react";
import {
  outlets,
  hasOutletCoordinates,
  type Outlet,
} from "@/data/outlets";
import { haversineKm } from "@/lib/distance";
import type { OutletActionContext } from "@/lib/outlet-action";

type LocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "ready"; distancesKm: Record<string, number | null> }
  | { status: "error"; message: string };

type PendingAction = {
  context: OutletActionContext;
  /** The control that started this, so focus can go back on cancel. */
  trigger: HTMLElement | null;
  /**
   * True when the caller already knows the outlet (an outlet card was clicked),
   * so the dialog opens on the details step instead of asking again.
   */
  startAtDetails: boolean;
  /** Distinguishes repeat activations of the same action. */
  key: number;
};

type OutletActionApi = {
  /** Begin an outlet-dependent action. Opens the selector; never navigates. */
  start: (
    context: OutletActionContext,
    options?: { outletId?: string }
  ) => void;
  /** Cancel or finish, restoring focus to whatever started the action. */
  close: () => void;
  pending: PendingAction | null;

  /** Remembered for this page session only. Never persisted, never a default. */
  selectedOutletId: string | null;
  selectedOutlet: Outlet | null;
  selectOutlet: (id: string | null) => void;

  /** Optional distance enhancement, shared by the finder and the dialog. */
  canUseLocation: boolean;
  location: LocationState;
  distancesKm: Record<string, number | null> | null;
  nearestId: string | null;
  nearestOutlet: Outlet | null;
  requestLocation: () => void;

  /** Politely announce a status change (e.g. an address was copied). */
  announce: (message: string) => void;
};

const OutletActionContextValue = React.createContext<OutletActionApi | null>(
  null
);

/**
 * The one place outlet-dependent actions are routed.
 *
 * Every WhatsApp, call, directions, copy-address, menu-request and contact-form
 * action on the site calls `start()` instead of carrying its own destination,
 * so no control can navigate to a branch the visitor didn't choose. The chosen
 * outlet is remembered in memory for the page session to save re-picking it,
 * but it is always shown and confirmed before anything external happens, and
 * it is never written to storage.
 *
 * PRIVACY: coordinates, when the visitor offers them, are read once on an
 * explicit tap, reduced immediately to per-outlet distances, and never stored,
 * logged, transmitted, or included in any message.
 */
export function OutletActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pending, setPending] = React.useState<PendingAction | null>(null);
  const [selectedOutletId, setSelectedOutletId] = React.useState<string | null>(
    null
  );
  const [location, setLocation] = React.useState<LocationState>({
    status: "idle",
  });
  const [announcement, setAnnouncement] = React.useState("");
  const announceTimer = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (announceTimer.current) window.clearTimeout(announceTimer.current);
    },
    []
  );

  const start = React.useCallback(
    (context: OutletActionContext, options?: { outletId?: string }) => {
      // A second activation while the selector is already open (double tap,
      // impatient click) must not stack a second dialog.
      setPending((current) => {
        if (current) return current;
        return {
          context,
          trigger:
            typeof document !== "undefined"
              ? (document.activeElement as HTMLElement | null)
              : null,
          startAtDetails: Boolean(options?.outletId),
          key: Date.now(),
        };
      });
      if (options?.outletId) setSelectedOutletId(options.outletId);
    },
    []
  );

  const close = React.useCallback(() => {
    setPending((current) => {
      // Focus goes back to the control that opened the dialog, after React has
      // removed it from the tree.
      const trigger = current?.trigger;
      if (trigger) {
        window.requestAnimationFrame(() => {
          if (document.contains(trigger)) trigger.focus();
        });
      }
      return null;
    });
  }, []);

  const announce = React.useCallback((message: string) => {
    setAnnouncement(message);
    if (announceTimer.current) window.clearTimeout(announceTimer.current);
    // Clear afterwards so repeating the same action announces again.
    announceTimer.current = window.setTimeout(() => setAnnouncement(""), 4000);
  }, []);

  const requestLocation = React.useCallback(() => {
    // Check the API is usable rather than merely present: in an insecure or
    // otherwise unsupported context `navigator.geolocation` can exist as a key
    // while being undefined or lacking the method.
    const geo =
      typeof navigator !== "undefined" ? navigator.geolocation : undefined;
    if (!geo || typeof geo.getCurrentPosition !== "function") {
      setLocation({
        status: "error",
        message:
          "Your browser doesn't support location sharing. You can still select any outlet manually.",
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
          if (!Object.values(next).some((km) => km !== null)) {
            setLocation({
              status: "error",
              message:
                "We couldn't work out distances just now. You can still select any outlet manually.",
            });
            return;
          }
          setLocation({ status: "ready", distancesKm: next });
        },
        (err) => {
          const message =
            err.code === err.PERMISSION_DENIED
              ? "No problem — location wasn't shared. You can still select any outlet manually."
              : err.code === err.TIMEOUT
                ? "Finding your location took too long. You can still select any outlet manually."
                : "We couldn't get your location. You can still select any outlet manually.";
          setLocation({ status: "error", message });
        },
        // One-shot, no watching, no background access, modest timeout.
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
      );
    } catch {
      // Some browsers throw synchronously in a disallowed context rather than
      // calling the error callback. A recoverable failure must never take the
      // page down with it.
      setLocation({
        status: "error",
        message:
          "We couldn't get your location. You can still select any outlet manually.",
      });
    }
  }, []);

  const distancesKm =
    location.status === "ready" ? location.distancesKm : null;

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

  const value = React.useMemo<OutletActionApi>(
    () => ({
      start,
      close,
      pending,
      selectedOutletId,
      selectedOutlet:
        outlets.find((o) => o.id === selectedOutletId) ?? null,
      selectOutlet: setSelectedOutletId,
      canUseLocation: hasOutletCoordinates,
      location,
      distancesKm,
      nearestId,
      nearestOutlet: outlets.find((o) => o.id === nearestId) ?? null,
      requestLocation,
      announce,
    }),
    [
      start,
      close,
      pending,
      selectedOutletId,
      location,
      distancesKm,
      nearestId,
      requestLocation,
      announce,
    ]
  );

  return (
    <OutletActionContextValue.Provider value={value}>
      {children}
      {/* One page-level status region, so a message outlives the dialog that
          produced it (e.g. "address copied" after the dialog closes). */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </OutletActionContextValue.Provider>
  );
}

export function useOutletAction(): OutletActionApi {
  const context = React.useContext(OutletActionContextValue);
  if (!context) {
    throw new Error(
      "useOutletAction must be used inside <OutletActionProvider>."
    );
  }
  return context;
}

/**
 * Props for a control that opens the outlet selector.
 *
 * Every intercepted control goes through this, which is what guarantees the
 * two things §34 of the brief asks for: a control that now opens a dialog is a
 * real `<button>` (never a link left pointing at `wa.me`, `tel:` or Maps), and
 * it advertises the dialog with `aria-haspopup`.
 */
export function useOutletTrigger(
  buildContext: () => OutletActionContext,
  options?: { outletId?: string }
) {
  const { start } = useOutletAction();
  return {
    type: "button" as const,
    "aria-haspopup": "dialog" as const,
    onClick: () => start(buildContext(), options),
  };
}
