import { siteConfig, type Plan } from "@/config/siteConfig";

/** Join class names, skipping falsey values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Build a wa.me link with a prefilled (not auto-sent) message. */
export function whatsappUrl(text: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    text
  )}`;
}

/** General "Join Now" WhatsApp inquiry. */
export function generalWhatsappUrl(): string {
  return whatsappUrl(siteConfig.whatsappGeneralText);
}

/** Plan-specific WhatsApp inquiry containing the selected plan name. */
export function planWhatsappUrl(plan: Plan): string {
  return whatsappUrl(
    `Hi F Z Gym & Fitness, I'd like to know more about the "${plan.name}" membership plan — pricing, benefits, and how to join.`
  );
}

/** Format an INR price, or the fallback copy when price is unknown. */
export function formatPrice(price: number | null): string {
  if (price === null) return "Contact for latest price";
  return `₹${price.toLocaleString("en-IN")}`;
}
