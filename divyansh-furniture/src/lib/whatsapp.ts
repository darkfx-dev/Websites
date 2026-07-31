import { business, isPlaceholder } from "@/data/site";

/**
 * Every booking action on the site goes through here.
 *
 * Returns `null` while the number is still a placeholder, and every button
 * checks for that before rendering. The alternative — shipping buttons that
 * open `wa.me/[WhatsApp number...]` — gives a visitor a broken tab and the
 * owner no way of knowing it is happening.
 *
 * `wa.me` is used rather than `api.whatsapp.com` because it is the link
 * format that hands off cleanly to the installed app on iOS and Android and
 * falls back to WhatsApp Web on desktop, which is the whole requirement.
 */
export function whatsappUrl(message?: string): string | null {
  const raw = business.whatsappNumber;
  if (isPlaceholder(raw)) return null;

  // wa.me accepts digits only — no +, spaces or dashes.
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return null;

  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Whether booking is live. Used to decide between a link and a notice. */
export const bookingEnabled = whatsappUrl() !== null;

/** Prefilled openers, so a visitor never has to compose the first message. */
export const messages = {
  general: `Hi ${business.name}, I would like to book a consultation.`,
  consultation: (subject: string) =>
    `Hi ${business.name}, I would like to book a consultation about ${subject}.`,
  service: (service: string) =>
    `Hi ${business.name}, I am interested in ${service}. Could you share details?`,
  packageEnquiry: (name: string) =>
    `Hi ${business.name}, I would like to know more about the ${name} package.`,
} as const;
