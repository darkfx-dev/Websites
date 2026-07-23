import { Phone, Navigation } from "lucide-react";
import { business } from "../config/business";
import { directionsUrl } from "../lib/whatsapp";
import { ChatGlyph } from "./Icons";

/* Sticky bottom action bar for small screens. Respects the iOS home-indicator
   safe area so controls are never clipped, and only renders below `lg` so it
   never duplicates the desktop floating stack. */
export function MobileActionBar() {
  const cell =
    "tap flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.72rem] font-semibold";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-90 border-t border-silver-line bg-ivory/98 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3">
        <a
          href={business.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cell} text-whatsapp-ink`}
          aria-label="Message Parth Salon on WhatsApp"
        >
          <ChatGlyph className="h-6 w-6" />
          WhatsApp
        </a>
        <a
          href={business.telephoneUrl}
          className={`${cell} border-x border-silver-line text-forest`}
          aria-label={`Call Parth Salon at ${business.phoneDisplay}`}
        >
          <Phone className="h-[22px] w-[22px]" aria-hidden="true" />
          Call
        </a>
        <a
          href={directionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cell} text-map-blue`}
          aria-label="Get directions to Parth Salon"
        >
          <Navigation className="h-[22px] w-[22px]" aria-hidden="true" />
          Directions
        </a>
      </div>
    </nav>
  );
}
