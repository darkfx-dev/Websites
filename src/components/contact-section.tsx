"use client";

import * as React from "react";
import { Phone, MapPin, Send } from "lucide-react";
import { outlets } from "@/data/outlets";
import {
  ALL_OUTLETS_LABEL,
  ALL_OUTLETS_OPTION,
  ALL_OUTLETS_SCOPE,
  buildContactFormMessage,
  contactEnquiryTypes,
  toWhatsAppUrl,
  type ContactEnquiryType,
} from "@/lib/outlet-enquiry";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import {
  useOutletAction,
  useOutletTrigger,
} from "@/components/outlets/outlet-action-provider";

export function ContactSection() {
  const { selectedOutletId, selectOutlet, start } = useOutletAction();

  // Prefilled from an outlet chosen earlier in the session, but never defaulted
  // to a branch the visitor didn't pick — "" means "not chosen yet".
  const [outletId, setOutletId] = React.useState<string>("");
  const [name, setName] = React.useState("");
  const [enquiryType, setEnquiryType] =
    React.useState<ContactEnquiryType>("General Enquiry");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("");
  const nameRef = React.useRef<HTMLInputElement>(null);
  const outletRef = React.useRef<HTMLSelectElement>(null);

  // Follow a session-wide outlet choice while the field is still untouched.
  React.useEffect(() => {
    if (selectedOutletId) setOutletId((current) => current || selectedOutletId);
  }, [selectedOutletId]);

  const whatsAppTrigger = useOutletTrigger(() => ({ type: "general-whatsapp" }));
  const callTrigger = useOutletTrigger(() => ({ type: "call" }));
  const directionsTrigger = useOutletTrigger(() => ({ type: "directions" }));

  const isAllOutlets = outletId === ALL_OUTLETS_OPTION;
  const chosenOutlet = outlets.find((o) => o.id === outletId) ?? null;

  /**
   * Live WhatsApp deep link, built from the locally-entered details. Nothing is
   * stored or transmitted anywhere except the WhatsApp chat the visitor opens.
   *
   * There is no link at all until a specific outlet is chosen: a message with
   * no destination is exactly the bug this form used to have.
   */
  const waHref = React.useMemo(() => {
    if (!chosenOutlet) return undefined;
    return toWhatsAppUrl(
      chosenOutlet.whatsappNumber,
      buildContactFormMessage({
        outlet: chosenOutlet,
        allOutlets: false,
        enquiryType,
        name,
        message,
      })
    );
  }, [chosenOutlet, enquiryType, name, message]);

  /** Shared validation. Returns whether the enquiry may proceed. */
  const validate = (): boolean => {
    if (!outletId) {
      setError("Please choose which outlet your enquiry is for.");
      outletRef.current?.focus();
      return false;
    }
    if (name.trim().length < 2) {
      setError("Please enter your name so we know who we're chatting with.");
      nameRef.current?.focus();
      return false;
    }
    setError(null);
    return true;
  };

  /**
   * "All Seven Outlets" is a request category, not a destination — no central
   * business number has been supplied, and one WhatsApp link can only ever open
   * one chat. So the enquiry keeps its all-outlets scope and the visitor is
   * asked which branch should receive it; nothing is silently routed anywhere.
   */
  const startAllOutletsEnquiry = () => {
    setStatus("Choose which outlet should receive your enquiry…");
    start({
      type: "contact-form",
      form: {
        allOutlets: true,
        enquiryType,
        name: name.trim(),
        message: message.trim(),
      },
    });
  };

  // The specific-outlet CTA is a REAL anchor (like every other working WhatsApp
  // control on the site) so the browser performs a genuine navigation —
  // reliable in sandboxed iframes and with mobile deep links, unlike
  // window.open().
  const onCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validate()) {
      e.preventDefault();
      return;
    }
    // Truthful state: WhatsApp is being opened — we never claim a message was
    // "sent" or an order was confirmed.
    setStatus("Opening WhatsApp…");
  };

  /** No single destination yet: either nothing is chosen, or it's all-outlets. */
  const onCtaButtonClick = () => {
    if (!validate()) return;
    startAllOutletsEnquiry();
  };

  // Enter-key support: a hidden submit button lets the form submit; if valid we
  // trigger a real anchor click within the same user gesture.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isAllOutlets) {
      startAllOutletsEnquiry();
      return;
    }
    if (!waHref) return;
    setStatus("Opening WhatsApp…");
    const a = document.createElement("a");
    a.href = waHref;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const contactCards = [
    {
      key: "whatsapp",
      trigger: whatsAppTrigger,
      icon: <WhatsAppIcon className="h-5 w-5" />,
      iconClass: "bg-coriander/12 text-coriander",
      title: "WhatsApp",
      detail: "Choose an outlet, then start a chat",
    },
    {
      key: "call",
      trigger: callTrigger,
      icon: (
        <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      ),
      iconClass: "bg-ivory text-tomato",
      title: "Call",
      detail: "Choose an outlet, then see its number",
    },
    {
      key: "directions",
      trigger: directionsTrigger,
      icon: (
        <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      ),
      iconClass: "bg-ivory text-tomato",
      title: "Directions",
      detail: "Choose an outlet, then open the map",
    },
  ];

  return (
    <section id="contact" className="section-y scroll-mt-20 bg-ivory">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Contact Mahesh Pav Bhaji"
            description={`Every outlet has its own number and WhatsApp chat, so we'll ask which of our ${outlets.length} outlets you mean before connecting you. Prefer to send a few details first? Use the quick form.`}
          />

          {/* Direct contact quick actions — each opens the outlet selector. */}
          <ul className="mt-8 flex flex-col gap-3">
            {contactCards.map((card) => (
              <li key={card.key}>
                <button
                  {...card.trigger}
                  className="flex w-full items-center gap-4 rounded-card border border-warm-border bg-white p-4 text-left shadow-card transition-transform duration-220 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                >
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card ${card.iconClass}`}
                  >
                    {card.icon}
                  </span>
                  <span>
                    <span className="block font-semibold text-charcoal">
                      {card.title}
                    </span>
                    <span className="block text-sm text-charcoal/70">
                      {card.detail}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Enquiry form → composes a WhatsApp message for the chosen outlet */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-feature border border-warm-border bg-white p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="contact-outlet"
                className="mb-1.5 block text-sm font-semibold text-charcoal"
              >
                Outlet Name
              </label>
              <select
                id="contact-outlet"
                name="outlet"
                ref={outletRef}
                value={outletId}
                onChange={(e) => {
                  const next = e.target.value;
                  setOutletId(next);
                  setError(null);
                  // Remember a real outlet for later actions; the all-outlets
                  // option is a category, so it never becomes a destination.
                  if (next && next !== ALL_OUTLETS_OPTION) selectOutlet(next);
                }}
                aria-required="true"
                aria-invalid={error && !outletId ? "true" : undefined}
                aria-describedby={
                  error && !outletId ? "contact-form-error" : undefined
                }
                className="w-full rounded-control border border-warm-border bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                <option value="">Select an outlet…</option>
                {outlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name} — {outlet.subtitle}
                  </option>
                ))}
                <option value={ALL_OUTLETS_OPTION}>{ALL_OUTLETS_LABEL}</option>
              </select>
              {isAllOutlets ? (
                <p className="mt-1.5 text-sm text-charcoal/70">
                  A WhatsApp chat reaches one branch at a time, so we&rsquo;ll
                  ask which outlet should receive your enquiry — it will still
                  be marked &ldquo;{ALL_OUTLETS_SCOPE}&rdquo;.
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-semibold text-charcoal"
              >
                Your name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-required="true"
                aria-invalid={error && outletId ? "true" : undefined}
                aria-describedby={
                  error && outletId ? "contact-form-error" : undefined
                }
                className="w-full rounded-control border border-warm-border bg-cream px-4 py-3 text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
                placeholder="e.g. Priya"
              />
            </div>

            <div>
              <label
                htmlFor="contact-inquiry"
                className="mb-1.5 block text-sm font-semibold text-charcoal"
              >
                Enquiry type
              </label>
              <select
                id="contact-inquiry"
                name="inquiry"
                value={enquiryType}
                onChange={(e) =>
                  setEnquiryType(e.target.value as ContactEnquiryType)
                }
                className="w-full rounded-control border border-warm-border bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                {contactEnquiryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-semibold text-charcoal"
              >
                Message{" "}
                <span className="font-normal text-charcoal/50">(optional)</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-y rounded-control border border-warm-border bg-cream px-4 py-3 text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
                placeholder="Tell us what you'd like to know…"
              />
            </div>

            {error ? (
              <p
                id="contact-form-error"
                role="alert"
                className="text-sm font-medium text-tomato"
              >
                {error}
              </p>
            ) : null}

            {/* Real anchor navigation once a specific outlet is chosen; with no
                outlet, or the all-outlets category, there is no single
                destination — so it stays a button that asks. */}
            {waHref ? (
              <Button
                href={waHref}
                external
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={onCtaClick}
              >
                <Send className="h-[18px] w-[18px]" aria-hidden="true" />
                Continue on WhatsApp
              </Button>
            ) : (
              <Button
                type="button"
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={onCtaButtonClick}
                {...(isAllOutlets
                  ? { "aria-haspopup": "dialog" as const }
                  : {})}
              >
                <Send className="h-[18px] w-[18px]" aria-hidden="true" />
                Continue on WhatsApp
              </Button>
            )}
            {/* Enables Enter-to-submit from the fields; hidden from pointer,
                keyboard-tab and screen readers (the visible anchor is the CTA). */}
            <button
              type="submit"
              aria-hidden="true"
              tabIndex={-1}
              className="sr-only"
            >
              Continue on WhatsApp
            </button>

            <p className="text-xs text-charcoal/70">
              This opens WhatsApp with your details prefilled, addressed to the
              outlet you chose. Your information isn&rsquo;t stored or sent
              anywhere else, and no order or table is confirmed until you chat
              with us.
            </p>

            {/* Truthful, screen-reader-announced status. */}
            <p role="status" aria-live="polite" className="sr-only">
              {status}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
