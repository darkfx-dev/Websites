import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ActionLink } from "@/components/ui/action-link";
import { MapPinIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { outlet } from "@/data/outlet";
import { anchors, directionsHref, whatsappHref } from "@/lib/links";

export const metadata: Metadata = {
  title: `Page not found | ${outlet.name}`,
  robots: { index: false, follow: true },
};

/**
 * Next.js serves this with a 404 status. The global header and footer stay in
 * place, so the outlet's phone number, address and actions remain one tap
 * away, and nothing here animates an error.
 */
export default function NotFound() {
  return (
    <>
      <Header />

      <main id="main" className="container-page flex min-h-[60vh] flex-col justify-center py-20">
        <p className="text-xs font-semibold tracking-[0.18em] text-copper uppercase">
          {outlet.displayName}
        </p>
        <h1 className="text-section mt-4 text-ink">This page does not exist.</h1>
        <p className="measure mt-4 text-lg text-muted">
          The link may be out of date. Everything about this outlet — the board, the address and
          how to reach it — is on the home page.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ActionLink href="/" size="lg">
            Go to the home page
          </ActionLink>
          <ActionLink href={anchors.menu} variant="secondary" size="lg">
            {outlet.cta.menu}
          </ActionLink>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <WhatsAppLink href={whatsappHref()} variant="secondary">
            {outlet.cta.whatsapp}
          </WhatsAppLink>
          <ActionLink
            href={directionsHref}
            variant="secondary"
            external
            externalLabel="(opens Google Maps)"
            icon={<MapPinIcon />}
          >
            Open in Google Maps
          </ActionLink>
        </div>
      </main>

      <Footer />
    </>
  );
}
