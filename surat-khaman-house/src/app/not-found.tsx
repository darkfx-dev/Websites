import { MessageCircle, Phone } from "lucide-react";

import { ActionLink } from "@/components/ui/action-link";
import { business } from "@/data/business";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * A 404 that still does the site's job: it points back to the menu and offers
 * the two contact actions, rather than being a dead end.
 *
 * It carries no address or directions — this page can be reached from
 * anywhere, so it is bound by the same placement rule as the page opening.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-screen items-center border-b border-[rgba(10,10,10,0.12)]"
    >
      <div className="container-page py-20">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          404
        </p>

        <h1 className="mt-3 max-w-[16ch] font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.06] tracking-[-0.015em] text-ink">
          That page isn&rsquo;t on the menu.
        </h1>

        <p className="mt-6 max-w-measure text-lg text-ink-soft">
          The link may be out of date. Browse the complete menu instead, or ask
          about today&rsquo;s prices and availability directly.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ActionLink href="/#menu" size="lg">
            View the Menu
          </ActionLink>
          <ActionLink href={whatsappHref} external variant="secondary" size="lg">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Ask on WhatsApp
          </ActionLink>
          <ActionLink href={telHref} variant="quiet" size="lg">
            <Phone className="h-4 w-4" aria-hidden />
            Call the Outlet
          </ActionLink>
        </div>

        <p className="mt-8 text-sm text-muted">{business.hoursFallback}</p>
      </div>
    </main>
  );
}
