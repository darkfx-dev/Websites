import { MessageCircle, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ActionLink } from "@/components/ui/action-link";
import { business } from "@/data/business";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * Final push toward the primary conversion. Carries no directions or address
 * information — the section that follows is the first place either appears.
 */
export function InquiryCta() {
  return (
    <section className="border-b border-[rgba(10,10,10,0.12)] bg-ink text-white">
      <Reveal className="container-page section-y">
        <h2 className="max-w-[18ch] font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em]">
          Checking today&rsquo;s menu? Ask the outlet directly.
        </h2>

        <p className="mt-5 max-w-measure text-lg text-white/75">
          Confirm current prices and availability through WhatsApp before
          making your selection.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ActionLink
            href={whatsappHref}
            external
            size="lg"
            className="border-white bg-white text-ink hover:bg-white/90"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Ask on WhatsApp
          </ActionLink>
          <ActionLink
            href={telHref}
            size="lg"
            className="border-white/35 bg-transparent text-white hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Call the Outlet
          </ActionLink>
        </div>

        <p className="mt-6 text-sm text-white/60">{business.hoursFallback}</p>
      </Reveal>
    </section>
  );
}
