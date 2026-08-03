import { business } from "@/data/business";

/**
 * The five approved questions. There is deliberately no location or address
 * question here — location is revealed only in the final section, and a
 * "where are you?" entry in the FAQ would break that.
 */
export const faqs = [
  {
    id: "what-served",
    question: "What does Surat Khaman House serve?",
    answer:
      "Vegetarian Surti breakfast and farsan, including locho, khaman, idada, patra, samosas, pattice and jalebi.",
  },
  {
    id: "prices-current",
    question: "Are the displayed prices current?",
    answer:
      "They are reference prices from an available menu-board photograph. Customers should confirm current prices through WhatsApp or telephone.",
  },
  {
    id: "todays-availability",
    question: "How can I ask about today's availability?",
    answer: `Use the WhatsApp inquiry button or call ${business.telephone.display}.`,
  },
  {
    id: "opening-hours",
    question: "What are the exact opening hours?",
    answer:
      "Public listings disagree, so customers should call to confirm today's hours.",
  },
  {
    id: "online-ordering",
    question: "Does this website support online ordering?",
    answer: "No. It provides menu information and direct contact options.",
  },
] as const;
