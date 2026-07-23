import { m } from "framer-motion";
import { Navigation } from "lucide-react";
import { business } from "../config/business";
import { directionsUrl } from "../lib/whatsapp";
import { duration, easeHeritage } from "../motion/variants";
import { ChatGlyph } from "./Icons";

/* Desktop-only floating actions (the mobile bar covers small screens). Each
   control has a text tooltip that also appears on keyboard focus. */
function Fab({
  href,
  label,
  tooltip,
  bg,
  children,
  ring,
}: {
  href: string;
  label: string;
  tooltip: string;
  bg: string;
  ring?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative inline-flex h-13 w-13 items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(6,26,20,0.28)] outline-offset-4 transition-transform hover:scale-105"
      style={{ background: bg, boxShadow: ring, height: 52, width: 52 }}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-[6px] bg-graphite px-2.5 py-1.5 text-[0.8rem] font-medium text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {tooltip}
      </span>
    </a>
  );
}

export function FloatingActions() {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: duration.reveal, ease: easeHeritage }}
      className="fixed bottom-6 right-6 z-90 hidden flex-col gap-3 lg:flex"
    >
      <Fab
        href={business.whatsappUrl}
        label="Message Parth Salon on WhatsApp"
        tooltip="Message on WhatsApp"
        bg="var(--color-whatsapp)"
      >
        <ChatGlyph className="h-6 w-6" />
      </Fab>
      <Fab
        href={directionsUrl()}
        label="Get directions to Parth Salon"
        tooltip="Get directions"
        bg="var(--color-map-blue)"
        ring="0 0 0 2px rgba(255,255,255,0.85), 0 6px 20px rgba(6,26,20,0.28)"
      >
        <Navigation className="h-6 w-6" aria-hidden="true" />
      </Fab>
    </m.div>
  );
}
