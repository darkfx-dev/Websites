import type { Outlet } from "@/data/outlets";
import {
  ALL_OUTLETS_SCOPE,
  buildContactFormMessage,
  buildDishEnquiryMessage,
  buildMenuRequestMessage,
  buildOutletEnquiryMessage,
  toWhatsAppUrl,
} from "@/lib/outlet-enquiry";

/**
 * Every outlet-dependent thing the site can do.
 *
 * The business has seven outlets, so none of these has a correct destination
 * until the visitor says which branch they mean. Each action therefore names
 * its *intent* here, and the destination is resolved from the chosen outlet's
 * record — there is no default outlet anywhere in the codebase.
 */
export type OutletActionType =
  | "general-whatsapp"
  | "dish-whatsapp"
  | "request-menu"
  | "call"
  | "directions"
  | "copy-address"
  | "contact-form";

/** What the user was doing when they triggered the action. */
export type OutletActionContext = {
  type: OutletActionType;
  /** Exact dish name from the card that was clicked. Never generalised. */
  dishName?: string;
  /** Menu category the request came from, when it came from a filtered view. */
  categoryName?: string;
  /** Already-entered contact-form details, carried through the outlet step. */
  form?: {
    allOutlets: boolean;
    enquiryType: string;
    name?: string;
    message?: string;
  };
};

/** Step-1 heading, phrased for the action the user actually started. */
export function outletActionTitle(context: OutletActionContext): string {
  switch (context.type) {
    case "call":
      return "Which outlet would you like to call?";
    case "directions":
      return "Which outlet do you need directions to?";
    case "copy-address":
      return "Which outlet address would you like to copy?";
    case "dish-whatsapp":
      return "Which outlet would you like to ask about this dish?";
    case "request-menu":
      return "Which outlet's current menu would you like?";
    case "contact-form":
      return "Which outlet should receive this enquiry?";
    case "general-whatsapp":
    default:
      return "Which outlet would you like to contact?";
  }
}

/** Short supporting line under the step-1 heading. */
export function outletActionDescription(context: OutletActionContext): string {
  switch (context.type) {
    case "call":
      return "Choose a branch and we'll show its number before dialling.";
    case "directions":
      return "Choose a branch and we'll open directions to that address.";
    case "copy-address":
      return "Choose a branch and we'll copy that outlet's full address.";
    case "dish-whatsapp":
      return "Availability can differ by outlet, so pick the branch you'd like to ask.";
    case "request-menu":
      return "Menus can differ by outlet, so pick the branch you'd like the menu from.";
    case "contact-form":
      return `A WhatsApp chat reaches one branch at a time. Choose which outlet should receive your ${ALL_OUTLETS_SCOPE.toLowerCase()}.`;
    case "general-whatsapp":
    default:
      return "Pick a branch and we'll start a WhatsApp chat with that outlet.";
  }
}

/**
 * Whether step 2 asks what the enquiry is about (chips + optional message), or
 * is just a confirmation. A call must not show enquiry chips and a directions
 * action must not show a message box — §30 of the brief, and simply the right
 * thing: neither would ever be sent anywhere.
 */
export function hasEnquiryStep(type: OutletActionType): boolean {
  return type === "general-whatsapp" || type === "dish-whatsapp";
}

/**
 * Whether step 2 offers the enquiry-category chips. A dish enquiry doesn't:
 * its subject is the dish, and the message states the question outright, so
 * chips would only add noise that never reaches the outlet.
 */
export function showsEnquiryChips(type: OutletActionType): boolean {
  return type === "general-whatsapp";
}

/** Whether step 2 leaves for WhatsApp (as opposed to a call, map or copy). */
export function isWhatsAppAction(type: OutletActionType): boolean {
  return hasEnquiryStep(type) || type === "request-menu" || type === "contact-form";
}

/**
 * Confirmation-button label. Direct actions name the outlet, so nobody calls or
 * navigates to a branch without having read which one it is.
 */
export function outletActionConfirmLabel(
  context: OutletActionContext,
  outlet: Outlet
): string {
  switch (context.type) {
    case "call":
      return `Call ${outlet.name} Outlet`;
    case "directions":
      return `Open Directions to ${outlet.name}`;
    case "copy-address":
      return `Copy ${outlet.name} Address`;
    default:
      return "Continue to WhatsApp";
  }
}

/**
 * The destination for a completed action, or `null` for copy-address (which
 * has no URL — it writes to the clipboard).
 *
 * Every branch reads its destination out of the passed outlet record, so a
 * WhatsApp message, a call and a map can never disagree about which outlet the
 * user chose, and no destination can be influenced by user input.
 */
export function resolveOutletActionUrl({
  context,
  outlet,
  categories = [],
  additionalMessage,
}: {
  context: OutletActionContext;
  outlet: Outlet;
  categories?: readonly string[];
  additionalMessage?: string;
}): string | null {
  switch (context.type) {
    case "call":
      return outlet.telHref;
    case "directions":
      return outlet.mapsUrl;
    case "copy-address":
      return null;
    case "dish-whatsapp":
      return toWhatsAppUrl(
        outlet.whatsappNumber,
        buildDishEnquiryMessage({
          outlet,
          dishName: context.dishName ?? "",
          additionalMessage,
        })
      );
    case "request-menu":
      return toWhatsAppUrl(
        outlet.whatsappNumber,
        buildMenuRequestMessage({
          outlet,
          menuSection: context.categoryName,
        })
      );
    case "contact-form":
      return toWhatsAppUrl(
        outlet.whatsappNumber,
        buildContactFormMessage({
          outlet,
          allOutlets: context.form?.allOutlets ?? false,
          enquiryType: context.form?.enquiryType ?? "General Enquiry",
          name: context.form?.name,
          message: context.form?.message,
        })
      );
    case "general-whatsapp":
    default:
      return toWhatsAppUrl(
        outlet.whatsappNumber,
        buildOutletEnquiryMessage({ outlet, categories, additionalMessage })
      );
  }
}
