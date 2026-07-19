/**
 * WhatsApp cake-inquiry message builder. Pure and dependency-free so it can
 * be unit-tested directly (see tests/inquiry.test.ts).
 *
 * Empty optional fields are omitted; the message never implies a guaranteed
 * booking — availability and price are confirmed by the shop in the chat.
 */

export type CakeInquiry = {
  name?: string;
  callback?: string;
  occasion?: string;
  date?: string;
  style?: string;
  flavor?: string;
  filling?: string;
  shape?: string;
  weight?: string;
  finish?: string;
  colour?: string;
  inscription?: string;
  fulfilment?: string;
  dietary?: string;
  notes?: string;
};

const WHATSAPP_NUMBER = "919426392062";

function line(label: string, value: string | undefined): string | null {
  const v = value?.trim();
  return v ? `${label}: ${v}` : null;
}

export function buildInquiryMessage(
  inquiry: CakeInquiry,
  bakeryName = "Modi Bakers"
): string {
  const finishColour = [inquiry.finish, inquiry.colour]
    .map((v) => v?.trim())
    .filter(Boolean)
    .join(", ");

  const lines = [
    `Hi ${bakeryName}, I would like to check the availability and price of a custom cake.`,
    line("Name", inquiry.name),
    line("Callback number", inquiry.callback),
    line("Occasion", inquiry.occasion),
    line("Required date", inquiry.date),
    line("Cake", inquiry.style),
    line("Flavour", inquiry.flavor),
    line("Filling", inquiry.filling),
    line("Shape", inquiry.shape),
    line("Weight", inquiry.weight),
    line("Finish and colour", finishColour || undefined),
    inquiry.inscription?.trim()
      ? `Cake inscription: "${inquiry.inscription.trim()}"`
      : null,
    line("Collection or delivery", inquiry.fulfilment),
    line("Dietary or allergy notes", inquiry.dietary),
    line("Additional notes", inquiry.notes),
    "Please confirm whether this order is available and share the final price. Thank you.",
  ];

  return lines.filter((l): l is string => l !== null).join("\n");
}

export function inquiryWhatsappHref(inquiry: CakeInquiry): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildInquiryMessage(inquiry)
  )}`;
}
