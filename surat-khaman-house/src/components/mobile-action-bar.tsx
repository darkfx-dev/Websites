import { MessageCircle, Phone } from "lucide-react";

import { business } from "@/data/business";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * Sticky bar for small screens. It carries Call and WhatsApp and nothing else
 * — no maps, directions, address or location pin.
 *
 * The page reserves matching bottom spacing (see `page.tsx`) so the bar never
 * covers the end of the footer.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(10,10,10,0.12)] bg-surface/95 backdrop-blur md:hidden">
      <div
        className="grid grid-cols-2 gap-3 px-4 py-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <a
          href={telHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-card border border-[rgba(10,10,10,0.16)] bg-surface text-sm font-semibold text-ink"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-card border border-ink bg-ink text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <span className="sr-only">
        Quick actions for {business.name}: call or message on WhatsApp.
      </span>
    </div>
  );
}
