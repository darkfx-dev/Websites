import type { Outlet } from "@/data/outlets";

/**
 * Enquiry categories offered in the outlet modal, in the order they are shown.
 * Owner-supplied wording — do not reword or reorder.
 */
export const enquiryCategories = [
  "Pav Bhaji",
  "Cheese Pav Bhaji",
  "Jain Pav Bhaji",
  "Pulav",
  "Tawa Pulav",
  "Extra Butter",
  "Parcel / Takeaway",
  "Home Delivery",
  "Dine In",
  "Table Reservation",
  "Party Order",
  "Birthday Catering",
  "Corporate Catering",
  "Bulk Orders",
  "Franchise Enquiry",
  "Other",
] as const;

export type EnquiryCategory = (typeof enquiryCategories)[number];

/** Minimum an outlet must provide to be messaged — keeps this testable. */
export type EnquiryOutlet = Pick<
  Outlet,
  "name" | "subtitle" | "whatsappNumber"
>;

/**
 * Compose the plain-text WhatsApp message.
 *
 * The "Additional Message" block is omitted entirely when the user didn't
 * write one, rather than left as an empty heading. Selected categories keep
 * the on-screen order.
 */
export function buildOutletEnquiryMessage({
  outlet,
  categories,
  additionalMessage,
}: {
  outlet: EnquiryOutlet;
  categories: readonly string[];
  additionalMessage?: string;
}): string {
  const lines: string[] = [
    "Hello Mahesh Pav Bhaji Team,",
    "",
    "I would like to enquire about the following.",
    "",
    "Outlet:",
    `${outlet.name} (${outlet.subtitle})`,
    "",
    "Selected Enquiries:",
    ...categories.map((category) => `• ${category}`),
  ];

  const trimmedMessage = additionalMessage?.trim();
  if (trimmedMessage) {
    lines.push("", "Additional Message:", trimmedMessage);
  }

  lines.push("", "Thank you.");
  return lines.join("\n");
}

/**
 * Build the wa.me link for an outlet enquiry.
 *
 * The host and path are fixed and the number comes from the outlet record, so
 * no part of the URL scheme or destination can be influenced by user input —
 * the free-text message is confined to the encoded query value.
 */
export function buildOutletEnquiryUrl(args: {
  outlet: EnquiryOutlet;
  categories: readonly string[];
  additionalMessage?: string;
}): string {
  const text = buildOutletEnquiryMessage(args);
  return `https://wa.me/${args.outlet.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
