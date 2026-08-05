import { outlet } from "@/data/outlet";

export type FaqAction = "call" | "directions";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  action?: FaqAction;
};

/**
 * Only questions that can be answered from the approved source of truth.
 * Nothing here may imply ordering, delivery, reservations, seating,
 * parking, payment methods or precise opening times.
 */
export const faqEntries: readonly FaqEntry[] = [
  {
    id: "what-is-served",
    question: "What does this outlet serve?",
    answer: `${outlet.displayName} is a ${outlet.businessType.toLowerCase()}. The board covers locho, khaman and khamani, idada, patudi and patra, samosas and rolls, pattice, and sweets and extras such as ghee jalebi and sev.`,
  },
  {
    id: "todays-menu",
    question: "How do I ask what is available today?",
    answer:
      "Call the outlet. Availability changes through the day, so a quick call before you travel is the reliable way to check what is ready.",
    action: "call",
  },
  {
    id: "prices-current",
    question: "Are the prices I found online current?",
    answer:
      "The prices shown here were transcribed from the latest available photograph of the menu board. They have not been confirmed as current, so treat them as a reference and check by phone before ordering.",
    action: "call",
  },
  {
    id: "how-to-call",
    question: "How do I call the outlet?",
    answer: `The public business number is ${outlet.contact.phoneDisplay}. On a phone, the call button below dials it directly.`,
    action: "call",
  },
  {
    id: "where-is-it",
    question: "Where exactly is this outlet?",
    answer: `${outlet.address.display}. This website covers only this Adajan Patiya outlet and not any other business using the same name.`,
  },
  {
    id: "directions",
    question: "How do I get directions?",
    answer:
      "The directions link opens this exact shop in Google Maps using its Google Place ID, so it will not send you to a similarly named outlet.",
    action: "directions",
  },
  {
    id: "opening-hours",
    question: "Why are exact opening hours not listed?",
    answer:
      "Public listings report different opening and closing times for this outlet, and none has been confirmed by the owner. Rather than publish a time that might be wrong, the site says it is open daily and asks you to call to confirm today's hours.",
    action: "call",
  },
] as const;
