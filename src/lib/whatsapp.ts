import { business } from "@/data/business";

/**
 * Centralized WhatsApp inquiry-link builders. Every link reuses the single
 * verified `business.whatsappNumber` (no phone literal is repeated anywhere)
 * and encodes the message with `encodeURIComponent` — never manual string
 * concatenation into a URL.
 *
 * These start an inquiry only. They never claim an order, price, or table is
 * confirmed — the business replies with current details on WhatsApp.
 */

function waUrl(text: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    text
  )}`;
}

/** "I found [dish] on your website. Please share its price and availability." */
export function buildDishInquiryUrl(dishName: string): string {
  return waUrl(
    `Hi ${business.name}, I found ${dishName} on your website. Please share its current price and availability.`
  );
}

/** "I'm interested in your [category] menu. Please share items and prices." */
export function buildCategoryInquiryUrl(categoryName: string): string {
  return waUrl(
    `Hi ${business.name}, I am interested in your ${categoryName} menu. Please share the current items, prices, and availability.`
  );
}
