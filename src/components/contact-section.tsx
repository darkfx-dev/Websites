"use client";

import * as React from "react";
import { Phone, MapPin, Send } from "lucide-react";
import { business } from "@/data/business";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";

const inquiryTypes = [
  "Current menu",
  "Order inquiry",
  "Table availability",
  "General question",
] as const;

type Inquiry = (typeof inquiryTypes)[number];

export function ContactSection() {
  const [name, setName] = React.useState("");
  const [inquiry, setInquiry] = React.useState<Inquiry>("General question");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your name so we know who we're chatting with.");
      return;
    }
    setError(null);

    // Compose a WhatsApp message from the locally-entered details. Nothing is
    // stored or transmitted anywhere except the WhatsApp chat the user opens.
    const parts = [
      `Hi ${business.name}, my name is ${name.trim()}.`,
      `Inquiry: ${inquiry}.`,
    ];
    if (message.trim()) parts.push(`Message: ${message.trim()}`);
    const url = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
      parts.join(" ")
    )}`;

    // Truthful state: WhatsApp is being opened — we never claim a message was
    // "sent" or an order was confirmed.
    setStatus("Opening WhatsApp…");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="section-y scroll-mt-20 bg-ivory">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Contact Mahesh Pav Bhaji"
            description="Reach us directly on WhatsApp or by phone. Prefer to send a few details first? Use the quick form — it opens WhatsApp with your message ready to go."
          />

          {/* Direct contact quick links */}
          <ul className="mt-8 flex flex-col gap-3">
            <li>
              <a
                href={business.whatsapp.primary}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-card border border-warm-border bg-white p-4 shadow-card transition-transform duration-220 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-coriander/12 text-coriander">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-charcoal">
                    WhatsApp
                  </span>
                  <span className="block text-sm text-charcoal/70">
                    Start a chat with us
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${business.telephone}`}
                className="flex items-center gap-4 rounded-card border border-warm-border bg-white p-4 shadow-card transition-transform duration-220 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-ivory text-tomato">
                  <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-charcoal">Call</span>
                  <span className="block text-sm text-charcoal/70">
                    {business.displayTelephone}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={business.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-card border border-warm-border bg-white p-4 shadow-card transition-transform duration-220 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-ivory text-tomato">
                  <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-charcoal">
                    Directions
                  </span>
                  <span className="block text-sm text-charcoal/70">
                    Open in Google Maps
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Inquiry form → composes a WhatsApp message */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-feature border border-warm-border bg-white p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-col gap-5">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-required="true"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "contact-name-error" : undefined}
                className="w-full rounded-control border border-warm-border bg-cream px-4 py-3 text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
                placeholder="e.g. Priya"
              />
              {error ? (
                <p
                  id="contact-name-error"
                  className="mt-1.5 text-sm font-medium text-tomato"
                >
                  {error}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="contact-inquiry"
                className="mb-1.5 block text-sm font-semibold text-charcoal"
              >
                Inquiry type
              </label>
              <select
                id="contact-inquiry"
                name="inquiry"
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value as Inquiry)}
                className="w-full rounded-control border border-warm-border bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus-visible:border-charcoal focus-visible:ring-2 focus-visible:ring-charcoal"
              >
                {inquiryTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
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

            <Button variant="whatsapp" size="lg" type="submit" className="w-full">
              <Send className="h-[18px] w-[18px]" aria-hidden="true" />
              Continue on WhatsApp
            </Button>

            <p className="text-xs text-charcoal/70">
              This opens WhatsApp with your details prefilled. Your information
              isn&rsquo;t stored or sent anywhere else, and no order or table is
              confirmed until you chat with us.
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
