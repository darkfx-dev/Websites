import { useState } from "react";
import { m } from "framer-motion";
import { Phone, Navigation, Copy, Check } from "lucide-react";
import { business } from "../config/business";
import { directionsUrl } from "../lib/whatsapp";
import { sectionReveal, viewportOnce } from "../motion/variants";
import { AccessibleButton } from "./AccessibleButton";
import { ArchMotif } from "./ArchMotif";
import { ChatGlyph } from "./Icons";

export function LocationSection() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(business.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="location" className="relative overflow-hidden bg-forest text-ivory">
      <ArchMotif
        className="pointer-events-none absolute -left-10 bottom-0 h-[70%] w-[40%] max-w-[360px] opacity-40"
        opacity={0.4}
      />
      <div className="on-dark container-page relative grid gap-10 py-20 md:grid-cols-2 md:gap-14 md:py-28">
        <m.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <p className="eyebrow text-silver">Find us</p>
          <h2 className="mt-4 text-ivory" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Location &amp; contact
          </h2>
          <address className="mt-6 not-italic text-[1.05rem] leading-relaxed text-ivory/85">
            {business.addressLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </address>

          <div className="mt-6 flex flex-col gap-1 text-[0.95rem] text-silver">
            <a href={business.telephoneUrl} className="inline-flex w-fit items-center gap-2 hover:text-ivory">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {business.phoneDisplay}
            </a>
          </div>
        </m.div>

        <m.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col justify-center gap-3"
        >
          <AccessibleButton
            variant="directions"
            href={directionsUrl()}
            external
            className="w-full"
            ariaLabel="Get directions to Parth Salon (opens Google Maps)"
          >
            <Navigation className="h-[18px] w-[18px]" aria-hidden="true" />
            Get Directions
          </AccessibleButton>
          <div className="grid grid-cols-2 gap-3">
            <AccessibleButton variant="whatsapp" href={business.whatsappUrl} external>
              <ChatGlyph />
              WhatsApp
            </AccessibleButton>
            <AccessibleButton
              variant="call"
              href={business.telephoneUrl}
              ariaLabel={`Call Parth Salon at ${business.phoneDisplay}`}
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call
            </AccessibleButton>
          </div>
          <button
            type="button"
            onClick={copyAddress}
            className="tap inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-5 font-semibold text-ivory transition-colors hover:bg-white/10"
          >
            {copied ? (
              <Check className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Copy className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
            {copied ? "Address copied" : "Copy address"}
          </button>
          <p role="status" aria-live="polite" className="sr-only">
            {copied ? "Address copied to clipboard" : ""}
          </p>
        </m.div>
      </div>
    </section>
  );
}
