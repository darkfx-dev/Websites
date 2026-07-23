import { m } from "framer-motion";
import { Phone, Navigation } from "lucide-react";
import { business } from "../config/business";
import { directionsUrl } from "../lib/whatsapp";
import { getOpenState } from "../lib/hours";
import { staggerParent, staggerChild } from "../motion/variants";
import { AccessibleButton } from "./AccessibleButton";
import { ArchMotif } from "./ArchMotif";
import { ChatGlyph } from "./Icons";

export function Hero() {
  const open = getOpenState();

  return (
    <section
      id="top"
      className="on-dark relative flex min-h-[100svh] items-center overflow-hidden bg-forest-deep text-ivory"
    >
      {/* Ambient arch motif echoing the salon interior — decorative */}
      <ArchMotif
        className="pointer-events-none absolute -right-6 bottom-0 h-[78%] w-[46%] max-w-[420px] opacity-70 sm:right-[4%]"
        opacity={0.45}
      />
      {/* Soft forest gradient for depth without hiding any content */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 20%, rgba(20,92,69,0.35), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="container-page relative w-full pb-16 pt-28">
        <m.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="max-w-[46rem]"
        >
          <m.p
            variants={staggerChild}
            className="eyebrow text-silver"
          >
            Est. 2003 · Katargam, Surat
          </m.p>

          <m.h1
            variants={staggerChild}
            className="mt-5 text-ivory"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1.02 }}
          >
            Grooming with
            <br />
            quiet confidence.
          </m.h1>

          <m.p
            variants={staggerChild}
            className="mt-6 max-w-[34rem] text-[1.05rem] text-ivory/80"
          >
            Parth Salon has served Katargam since 2003. Contact us for current
            services, prices, and available appointment times.
          </m.p>

          <m.div
            variants={staggerChild}
            className="mt-8 flex flex-wrap gap-3"
          >
            <AccessibleButton
              variant="whatsapp"
              href={business.whatsappUrl}
              external
              ariaLabel="Book on WhatsApp — opens WhatsApp chat with Parth Salon"
            >
              <ChatGlyph />
              Book on WhatsApp
            </AccessibleButton>
            <AccessibleButton
              variant="call"
              href={business.telephoneUrl}
              ariaLabel={`Call Parth Salon at ${business.phoneDisplay}`}
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call Now
            </AccessibleButton>
            <AccessibleButton
              variant="ghost"
              href={directionsUrl()}
              external
              className="!text-ivory hover:!bg-white/10"
              ariaLabel="Get directions to Parth Salon (opens Google Maps)"
            >
              <Navigation className="h-[18px] w-[18px]" aria-hidden="true" />
              Get Directions
            </AccessibleButton>
          </m.div>

          <m.div
            variants={staggerChild}
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] text-silver"
          >
            <span className="inline-flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  open.isOpen ? "bg-whatsapp" : "bg-silver"
                }`}
                aria-hidden="true"
              />
              {open.isOpen ? "Open now" : "Closed"} · {open.detail}
            </span>
            <span className="hidden h-3 w-px bg-silver/40 sm:inline-block" aria-hidden="true" />
            <span>Established in 2003</span>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
