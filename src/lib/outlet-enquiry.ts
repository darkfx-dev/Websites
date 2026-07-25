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

/**
 * Enquiry types offered by the contact form. Owner-supplied wording and order.
 *
 * "Enquiry for All Seven Outlets" is a REQUEST CATEGORY, not a destination —
 * a WhatsApp link can only ever open one conversation, so the message still
 * has to be delivered to one outlet the user picks (see `ALL_OUTLETS_OPTION`).
 */
export const contactEnquiryTypes = [
  "General Enquiry",
  "Dish Availability",
  "Current Menu",
  "Parcel / Takeaway",
  "Home Delivery",
  "Dine In",
  "Table Reservation",
  "Party Order",
  "Birthday Catering",
  "Corporate Catering",
  "Bulk Orders",
  "Franchise Enquiry",
  "Enquiry for All Seven Outlets",
  "Other",
] as const;

export type ContactEnquiryType = (typeof contactEnquiryTypes)[number];

/**
 * Sentinel value for the contact form's "Outlet Name" field meaning "this is
 * about the business as a whole". It is deliberately NOT an outlet id, so it
 * can never be mistaken for one and routed somewhere by accident.
 */
export const ALL_OUTLETS_OPTION = "all-seven";
export const ALL_OUTLETS_LABEL =
  "All Seven Outlets / General Business Enquiry";
export const ALL_OUTLETS_SCOPE = "Enquiry for All Seven Outlets";

/** Minimum an outlet must provide to be messaged — keeps this testable. */
export type EnquiryOutlet = Pick<
  Outlet,
  "name" | "subtitle" | "whatsappNumber"
>;

/** "Name (Subtitle)" — the one way an outlet is named inside a message. */
function outletLine(outlet: EnquiryOutlet): string {
  return `${outlet.name} (${outlet.subtitle})`;
}

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
    outletLine(outlet),
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
 * Dish enquiry. The dish name is passed through exactly as it appears on the
 * card — never generalised to its category — and the message only ever ASKS
 * about availability, it never states that the dish is available.
 */
export function buildDishEnquiryMessage({
  outlet,
  dishName,
  additionalMessage,
}: {
  outlet: EnquiryOutlet;
  dishName: string;
  additionalMessage?: string;
}): string {
  const lines: string[] = [
    "Hello Mahesh Pav Bhaji Team,",
    "",
    "I would like to ask about the following item.",
    "",
    "Outlet:",
    outletLine(outlet),
    "",
    "Dish:",
    dishName,
    "",
    "Enquiry:",
    "Please confirm its current availability and details.",
  ];

  const trimmedMessage = additionalMessage?.trim();
  if (trimmedMessage) {
    lines.push("", "Additional Message:", trimmedMessage);
  }

  lines.push("", "Thank you.");
  return lines.join("\n");
}

/**
 * Current-menu request. `menuSection` narrows it to one category when the user
 * asked from a filtered view; the menu is never claimed to be identical across
 * outlets, which is exactly why the outlet has to be chosen first.
 */
export function buildMenuRequestMessage({
  outlet,
  menuSection,
}: {
  outlet: EnquiryOutlet;
  menuSection?: string;
}): string {
  const lines: string[] = [
    "Hello Mahesh Pav Bhaji Team,",
    "",
    "I would like to request the current menu and availability details.",
    "",
    "Outlet:",
    outletLine(outlet),
  ];

  if (menuSection?.trim()) {
    lines.push("", "Menu Section:", menuSection.trim());
  }

  lines.push("", "Thank you.");
  return lines.join("\n");
}

/**
 * Contact-form enquiry.
 *
 * When the user picked "All Seven Outlets / General Business Enquiry" the scope
 * is stated explicitly and the outlet they chose to receive it is named
 * separately, so nobody reading the message mistakes the receiving branch for
 * the subject of the enquiry.
 */
export function buildContactFormMessage({
  outlet,
  allOutlets,
  enquiryType,
  name,
  message,
}: {
  outlet: EnquiryOutlet;
  allOutlets: boolean;
  enquiryType: string;
  name?: string;
  message?: string;
}): string {
  const lines: string[] = ["Hello Mahesh Pav Bhaji Team,", ""];

  if (allOutlets) {
    lines.push(
      "I would like to make a general business enquiry.",
      "",
      "Scope:",
      ALL_OUTLETS_SCOPE,
      "",
      "Receiving Outlet:",
      outletLine(outlet)
    );
  } else {
    lines.push(
      "I would like to make an enquiry.",
      "",
      "Outlet:",
      outletLine(outlet)
    );
  }

  lines.push("", "Enquiry Type:", enquiryType);

  // Empty sections are omitted rather than left as bare headings.
  const trimmedName = name?.trim();
  if (trimmedName) lines.push("", "Name:", trimmedName);

  const trimmedMessage = message?.trim();
  if (trimmedMessage) lines.push("", "Message:", trimmedMessage);

  lines.push("", "Thank you.");
  return lines.join("\n");
}

/**
 * Compose a wa.me link.
 *
 * The scheme, host and path are fixed and the number comes from an outlet
 * record, so nothing a user types can influence the destination or introduce a
 * different URL scheme — free text is confined to the encoded query value, and
 * is encoded exactly once.
 */
export function toWhatsAppUrl(whatsappNumber: string, text: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** Build the wa.me link for a general outlet enquiry. */
export function buildOutletEnquiryUrl(args: {
  outlet: EnquiryOutlet;
  categories: readonly string[];
  additionalMessage?: string;
}): string {
  return toWhatsAppUrl(
    args.outlet.whatsappNumber,
    buildOutletEnquiryMessage(args)
  );
}
