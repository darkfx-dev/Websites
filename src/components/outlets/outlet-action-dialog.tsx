"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Copy,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  X,
} from "lucide-react";
import { outlets, outletMapsAreSearchBased, type Outlet } from "@/data/outlets";
import { formatApproxKm } from "@/lib/distance";
import { enquiryCategories } from "@/lib/outlet-enquiry";
import {
  hasEnquiryStep,
  isWhatsAppAction,
  outletActionConfirmLabel,
  outletActionDescription,
  outletActionTitle,
  resolveOutletActionUrl,
  showsEnquiryChips,
} from "@/lib/outlet-action";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useOutletAction } from "./outlet-action-provider";

type Step = "outlet" | "details";

/**
 * The single outlet dialog for the whole site.
 *
 * Step 1 asks which of the seven outlets the action is for; step 2 confirms it
 * and collects only what that particular action needs — enquiry chips and a
 * message for a WhatsApp enquiry, nothing but a confirmation for a call, a map
 * or an address copy. There is deliberately one dialog rather than one per
 * entry point, so every route through the site looks and behaves the same.
 *
 * Focus handling, scroll lock and Escape mirror the mobile-menu dialog in
 * `site-header.tsx`. It is portalled to <body> so a transformed ancestor can
 * never become the containing block for its fixed positioning.
 */
export function OutletActionDialog() {
  const {
    pending,
    close,
    selectedOutletId,
    selectOutlet,
    canUseLocation,
    location,
    distancesKm,
    nearestId,
    requestLocation,
    announce,
  } = useOutletAction();

  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [step, setStep] = React.useState<Step>("outlet");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const resetTimer = React.useRef<number | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    []
  );

  const open = pending !== null;
  const context = pending?.context ?? null;
  const actionType = context?.type ?? "general-whatsapp";
  const openKey = pending?.key ?? 0;

  // Each activation starts from a clean slate. Carrying an old enquiry into a
  // different branch — or a different action — would send the wrong thing.
  React.useEffect(() => {
    if (!pending) return;
    setStep(pending.startAtDetails ? "details" : "outlet");
    setCategories([]);
    setMessage("");
    setError(null);
    setSubmitting(false);
  }, [pending]);

  // Scroll lock + Escape + cyclic focus trap, for as long as the dialog is open.
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      const index = list.indexOf(document.activeElement as HTMLElement);
      // Index -1 means focus is on the panel itself, which is where it goes
      // when a step has no controls of its own (a call or directions
      // confirmation). Wrap from there too, or Tab would leave the dialog.
      if (e.shiftKey && (index === 0 || index === -1)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (index === list.length - 1 || index === -1)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Move focus into the dialog, and again whenever the step changes, so a
  // keyboard user always lands on the content that just appeared.
  //
  // A confirmation step for a call, a map or an address copy has no controls of
  // its own, so there is nothing in the body to focus. Focus goes to the panel
  // in that case — which announces the dialog's current title — rather than
  // being left on a button that is about to unmount, which would drop focus to
  // <body> and out of the dialog entirely.
  React.useEffect(() => {
    if (!open) return;
    const target = bodyRef.current?.querySelector<HTMLElement>(
      'button, a[href], textarea, [tabindex]:not([tabindex="-1"])'
    );
    (target ?? panelRef.current)?.focus();
  }, [open, step, openKey]);

  const selectedOutlet: Outlet | null =
    outlets.find((o) => o.id === selectedOutletId) ?? null;

  const toggleCategory = (category: string) => {
    setCategories((prev) => {
      const next = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      if (next.length > 0) setError(null);
      return next;
    });
  };

  // Live destination, so the confirmation control is a real link the browser
  // navigates natively — window.open() is unreliable behind popup blockers and
  // for app deep links (tel:, WhatsApp).
  const href =
    context && selectedOutlet
      ? resolveOutletActionUrl({
          context,
          outlet: selectedOutlet,
          categories,
          additionalMessage: message,
        })
      : null;

  /** Hand-off shared by every link-based action. */
  const finishAfterHandoff = () => {
    setSubmitting(true);
    resetTimer.current = window.setTimeout(() => {
      setSubmitting(false);
      close();
    }, 900);
  };

  const onConfirmLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (submitting) {
      // Second activation while the first is still handing off.
      e.preventDefault();
      return;
    }
    if (showsEnquiryChips(actionType) && categories.length === 0) {
      e.preventDefault();
      setError(
        "Please select at least one option so we know what you're asking about."
      );
      return;
    }
    setError(null);
    finishAfterHandoff();
  };

  const onCopyAddress = async () => {
    if (!selectedOutlet || submitting) return;
    setSubmitting(true);
    try {
      await navigator.clipboard.writeText(selectedOutlet.addressText);
      announce(`${selectedOutlet.name} outlet address copied.`);
      close();
    } catch {
      // Clipboard blocked or unavailable — never a dead end: the address stays
      // on screen above, selectable by hand.
      setSubmitting(false);
      setError(
        "We couldn't copy the address automatically. You can select and copy the address shown above."
      );
    }
  };

  if (!mounted) return null;

  const outletCount = outlets.length;

  return createPortal(
    <AnimatePresence>
      {open && context ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close outlet options"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-charcoal/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="outlet-action-title"
            aria-describedby="outlet-action-subtitle"
            // Programmatically focusable (never in the Tab order) so focus has
            // somewhere inside the dialog to land on a step with no controls.
            tabIndex={-1}
            initial={reduce ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 28, mass: 0.85 }}
            className={cn(
              "relative flex max-h-[92dvh] w-full flex-col overflow-hidden border border-warm-border bg-cream shadow-elevated",
              "rounded-t-feature sm:max-w-lg sm:rounded-feature",
              "pb-[env(safe-area-inset-bottom)] sm:pb-0"
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-warm-border p-6 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/55">
                  {step === "outlet" ? "Step 1 of 2" : "Step 2 of 2"}
                </p>
                <h2
                  id="outlet-action-title"
                  className="mt-1.5 font-display text-xl font-semibold text-charcoal"
                >
                  {step === "outlet"
                    ? outletActionTitle(context)
                    : detailsTitle(actionType)}
                </h2>
                <p
                  id="outlet-action-subtitle"
                  className="mt-2 text-sm leading-relaxed text-charcoal/70"
                >
                  {step === "outlet"
                    ? outletActionDescription(context)
                    : detailsDescription(actionType)}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-warm-border bg-white text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Scrolls internally so the dialog never exceeds the viewport. */}
            <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto p-6 pt-5">
              {step === "outlet" ? (
                <div>
                  {/* Location is requested only on a deliberate tap, and only
                      when outlet coordinates exist to compare against. */}
                  {canUseLocation ? (
                    <div className="mb-5 flex flex-col gap-3 rounded-card border border-warm-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-charcoal/75">
                        Prefer the closest branch? Your location stays on your
                        device.
                      </p>
                      <button
                        type="button"
                        onClick={requestLocation}
                        disabled={location.status === "locating"}
                        className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-button border border-warm-border bg-cream px-4 text-sm font-semibold text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 disabled:opacity-60"
                      >
                        <LocateFixed className="h-4 w-4" aria-hidden="true" />
                        {location.status === "locating"
                          ? "Finding…"
                          : "Use my location"}
                      </button>
                    </div>
                  ) : null}

                  {location.status === "error" ? (
                    <p className="mb-5 rounded-card border border-warm-border bg-white px-4 py-3 text-sm text-charcoal/75">
                      {location.message}
                    </p>
                  ) : null}

                  <ul className="flex flex-col gap-2.5">
                    {outlets.map((outlet) => {
                      const isSelected = selectedOutletId === outlet.id;
                      const isNearest = nearestId === outlet.id;
                      const distance = formatApproxKm(
                        distancesKm?.[outlet.id] ?? null
                      );
                      return (
                        <li key={outlet.id}>
                          <button
                            type="button"
                            data-outlet-option={outlet.id}
                            aria-pressed={isSelected}
                            onClick={() => {
                              selectOutlet(outlet.id);
                              setError(null);
                            }}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-card border p-4 text-left",
                              "transition-[background-color,border-color,transform] duration-160 ease-standard active:scale-[0.99]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
                              isSelected
                                ? "border-tomato bg-white"
                                : "border-warm-border bg-white/70 hover:border-charcoal/30 hover:bg-white"
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                                isSelected
                                  ? "border-tomato bg-tomato text-white"
                                  : "border-warm-border bg-cream text-transparent"
                              )}
                              aria-hidden="true"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="font-display text-base font-semibold text-charcoal">
                                  {outlet.name}
                                </span>
                                <span className="text-sm font-medium text-tomato">
                                  {outlet.subtitle}
                                </span>
                                {isNearest ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-saffron/15 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-[#8a5a10]">
                                    <Navigation
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                    Nearest
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-1 block text-sm leading-relaxed text-charcoal/65">
                                {outlet.addressText}
                              </span>
                              {distance ? (
                                <span className="mt-1 block text-sm font-medium text-charcoal/55">
                                  {distance}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div>
                  {selectedOutlet ? (
                    <div className="rounded-card border border-warm-border bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/55">
                        {confirmationLabel(actionType)}
                      </p>
                      <p className="mt-1.5 font-display text-lg font-semibold text-charcoal">
                        {selectedOutlet.name}
                      </p>
                      <p className="text-sm font-medium text-tomato">
                        {selectedOutlet.subtitle}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                        {selectedOutlet.addressText}
                      </p>
                      {actionType === "call" ? (
                        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-charcoal">
                          <Phone
                            className="h-4 w-4 text-tomato"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          {selectedOutlet.phone}
                        </p>
                      ) : null}
                      {actionType === "directions" && outletMapsAreSearchBased ? (
                        <p className="mt-3 text-xs leading-relaxed text-charcoal/55">
                          Opens a Google Maps search for this outlet&rsquo;s
                          address.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {context.dishName ? (
                    <div className="mt-5 rounded-card border border-warm-border bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/55">
                        Asking about
                      </p>
                      <p className="mt-1.5 font-display text-lg font-semibold text-charcoal">
                        {context.dishName}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                        We&rsquo;ll ask this outlet to confirm its current
                        availability and details.
                      </p>
                    </div>
                  ) : null}

                  {context.categoryName && !context.dishName ? (
                    <div className="mt-5 rounded-card border border-warm-border bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/55">
                        Menu section
                      </p>
                      <p className="mt-1.5 font-display text-lg font-semibold text-charcoal">
                        {context.categoryName}
                      </p>
                    </div>
                  ) : null}

                  {context.form ? (
                    <dl className="mt-5 rounded-card border border-warm-border bg-white p-4 text-sm">
                      {context.form.allOutlets ? (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="font-semibold text-charcoal">Scope:</dt>
                          <dd className="text-charcoal/70">
                            Enquiry for all {outletCount} outlets
                          </dd>
                        </div>
                      ) : null}
                      <div className="mt-1 flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-charcoal">
                          Enquiry type:
                        </dt>
                        <dd className="text-charcoal/70">
                          {context.form.enquiryType}
                        </dd>
                      </div>
                    </dl>
                  ) : null}

                  {showsEnquiryChips(actionType) ? (
                    <fieldset className="mt-6">
                      <legend className="text-sm font-semibold text-charcoal">
                        What is your enquiry about?
                      </legend>
                      <div
                        className="mt-3 flex flex-wrap gap-2"
                        aria-describedby={error ? "outlet-action-error" : undefined}
                      >
                        {enquiryCategories.map((category) => {
                          const isOn = categories.includes(category);
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              aria-pressed={isOn}
                              className={cn(
                                "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 text-sm font-medium",
                                "transition-[background-color,border-color,color,transform] duration-160 ease-standard active:scale-[0.97]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
                                isOn
                                  ? "border-charcoal bg-charcoal text-cream"
                                  : "border-warm-border bg-white text-charcoal/80 hover:border-charcoal/40 hover:text-charcoal"
                              )}
                            >
                              {isOn ? (
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : null}
                              {category}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : null}

                  {hasEnquiryStep(actionType) ? (
                    <div className="mt-6">
                      <label
                        htmlFor="outlet-action-message"
                        className="text-sm font-semibold text-charcoal"
                      >
                        Additional message{" "}
                        <span className="font-normal text-charcoal/55">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="outlet-action-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        maxLength={600}
                        placeholder="Write any additional details here... (e.g., spice level, quantity, timing preferences)"
                        className="mt-2 w-full resize-y rounded-control border border-warm-border bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
                      />
                    </div>
                  ) : null}

                  {error ? (
                    <p
                      id="outlet-action-error"
                      role="alert"
                      className="mt-4 text-sm font-medium text-tomato"
                    >
                      {error}
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-warm-border bg-cream p-6 pt-4">
              {step === "details" && !pending?.startAtDetails ? (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep("outlet");
                  }}
                  className="inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-button border border-warm-border bg-white px-4 text-sm font-semibold text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
                  Back
                </button>
              ) : null}

              {step === "outlet" ? (
                <button
                  type="button"
                  disabled={!selectedOutlet}
                  onClick={() => setStep("details")}
                  className={cn(
                    "group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-button bg-charcoal px-6 text-base font-semibold text-cream",
                    "transition-[background-color,transform,box-shadow] duration-220 ease-standard",
                    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50"
                  )}
                >
                  {selectedOutlet
                    ? `Continue with ${selectedOutlet.name}`
                    : "Select an outlet to continue"}
                </button>
              ) : actionType === "copy-address" ? (
                <button
                  type="button"
                  onClick={onCopyAddress}
                  disabled={!selectedOutlet || submitting}
                  className={cn(
                    "group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-button bg-charcoal px-6 text-base font-semibold text-cream",
                    "transition-[background-color,transform,box-shadow] duration-220 ease-standard",
                    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-60"
                  )}
                >
                  <Copy className="h-[18px] w-[18px]" aria-hidden="true" />
                  {selectedOutlet
                    ? outletActionConfirmLabel(context, selectedOutlet)
                    : "Copy address"}
                </button>
              ) : (
                <a
                  href={href ?? undefined}
                  // A phone call replaces the current page by design; WhatsApp
                  // and Maps open alongside it so the visitor keeps their place.
                  {...(actionType === "call"
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  onClick={onConfirmLink}
                  aria-disabled={submitting || undefined}
                  className={cn(
                    "group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-button px-6 text-base font-semibold text-white",
                    "transition-[background-color,transform,box-shadow] duration-220 ease-standard",
                    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isWhatsAppAction(actionType)
                      ? "bg-coriander hover:bg-[#27563c] focus-visible:ring-coriander"
                      : "bg-charcoal text-cream hover:bg-charcoal-deep focus-visible:ring-charcoal",
                    submitting && "pointer-events-none opacity-70"
                  )}
                >
                  {submitting ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      Preparing your message...
                    </>
                  ) : (
                    <>
                      <ConfirmIcon type={actionType} />
                      {selectedOutlet
                        ? outletActionConfirmLabel(context, selectedOutlet)
                        : "Continue"}
                    </>
                  )}
                  {actionType === "call" ? null : (
                    <span className="sr-only"> (opens in a new tab)</span>
                  )}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function ConfirmIcon({ type }: { type: string }) {
  if (type === "call")
    return <Phone className="h-[18px] w-[18px]" aria-hidden="true" />;
  if (type === "directions")
    return <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />;
  return <WhatsAppIcon className="h-[18px] w-[18px]" />;
}

/** Eyebrow above the chosen outlet, naming what is about to happen to it. */
function confirmationLabel(type: string): string {
  switch (type) {
    case "call":
      return "Calling outlet";
    case "directions":
      return "Directions to";
    case "copy-address":
      return "Copying address for";
    case "request-menu":
      return "Requesting menu from";
    default:
      return "Messaging outlet";
  }
}

function detailsTitle(type: string): string {
  switch (type) {
    case "call":
      return "Confirm the outlet you're calling";
    case "directions":
      return "Confirm your directions";
    case "copy-address":
      return "Confirm the address to copy";
    case "request-menu":
      return "Confirm your menu request";
    case "contact-form":
      return "Confirm and send your enquiry";
    case "dish-whatsapp":
      return "Confirm your dish enquiry";
    default:
      return "Tell us what you're looking for";
  }
}

function detailsDescription(type: string): string {
  switch (type) {
    case "call":
      return "Check the number below, then start the call.";
    case "directions":
      return "Check the address below, then open directions.";
    case "copy-address":
      return "Check the address below, then copy it.";
    case "request-menu":
      return "We'll ask this outlet for its current menu and availability.";
    case "contact-form":
      return "Your details are already filled in — this just confirms who receives them.";
    case "dish-whatsapp":
      return "Add anything else you'd like to ask before continuing to WhatsApp.";
    default:
      return "Select one or more options before continuing to WhatsApp. This helps us prepare your order or enquiry in advance for faster response.";
  }
}
