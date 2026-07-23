import { Phone, Navigation } from "lucide-react";
import { business } from "../config/business";
import { directionsUrl } from "../lib/whatsapp";
import { SectionReveal } from "./SectionReveal";
import { AccessibleButton } from "./AccessibleButton";
import { ChatGlyph } from "./Icons";

export function FinalCTA() {
  return (
    <section className="bg-ivory">
      <div className="container-page py-20 text-center md:py-28">
        <SectionReveal className="mx-auto max-w-[40rem]">
          <h2 className="text-forest" style={{ fontSize: "clamp(2.25rem, 6vw, 4.25rem)" }}>
            Ready to plan your visit?
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[1.08rem] text-muted-ink">
            Message Parth Salon for current services, prices, and available
            appointment times.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <AccessibleButton variant="whatsapp" href={business.whatsappUrl} external>
              <ChatGlyph />
              Book on WhatsApp
            </AccessibleButton>
            <AccessibleButton
              variant="call"
              href={business.telephoneUrl}
              ariaLabel={`Call Parth Salon at ${business.phoneDisplay}`}
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call the Salon
            </AccessibleButton>
            <AccessibleButton variant="directions" href={directionsUrl()} external>
              <Navigation className="h-[18px] w-[18px]" aria-hidden="true" />
              Get Directions
            </AccessibleButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
