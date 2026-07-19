import { z } from "zod";
import { school } from "../data/school";

/** Standards offered, as strings for form values. */
export const STANDARDS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
] as const;

export const STREAMS = ["Science", "Commerce"] as const;
export const ENQUIRY_TYPES = [
  "Admission",
  "Fees",
  "School Information",
  "Other",
] as const;
export const CONTACT_METHODS = ["WhatsApp", "Phone Call"] as const;

export const MESSAGE_LIMIT = 400;

/** A standard requires a stream choice only at Higher Secondary level. */
export function requiresStream(standard: string): boolean {
  return standard === "11" || standard === "12";
}

/** Accepts common Indian mobile formats: optional +91/91/0 prefix, spaces/dashes. */
const indianMobilePattern =
  /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export const enquirySchema = z
  .object({
    parentName: z
      .string()
      .trim()
      .min(2, "Please enter the parent or guardian's full name."),
    mobile: z
      .string()
      .trim()
      .regex(
        indianMobilePattern,
        "Please enter a valid 10-digit Indian mobile number."
      ),
    studentName: z
      .string()
      .trim()
      .min(2, "Please enter the student's full name."),
    standard: z.enum(STANDARDS, {
      message: "Please choose the standard you are applying for.",
    }),
    stream: z.union([z.enum(STREAMS), z.literal("")]).optional(),
    currentStandard: z.string().trim().max(40).optional(),
    enquiryType: z.enum(ENQUIRY_TYPES, {
      message: "Please choose what your enquiry is about.",
    }),
    preferredContact: z.enum(CONTACT_METHODS, {
      message: "Please choose how the school should contact you.",
    }),
    message: z
      .string()
      .trim()
      .max(MESSAGE_LIMIT, `Please keep your question under ${MESSAGE_LIMIT} characters.`)
      .optional(),
    consent: z.literal(true, {
      message:
        "Please confirm you are happy for these details to be used to contact the school.",
    }),
  })
  .superRefine((data, ctx) => {
    if (requiresStream(data.standard) && !data.stream) {
      ctx.addIssue({
        code: "custom",
        path: ["stream"],
        message:
          "Please choose Science or Commerce for Standard 11 or 12.",
      });
    }
  });

export type EnquiryData = z.infer<typeof enquirySchema>;

/** Normalise a mobile number for display inside the WhatsApp message. */
export function normaliseMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;
}

/** Build the plain-text WhatsApp message from reviewed form data. */
export function buildEnquiryMessage(data: EnquiryData): string {
  const lines = [
    `Hello ${school.shortName}. I would like to make an admission enquiry.`,
    "",
    `Parent/Guardian: ${data.parentName}`,
    `Mobile: ${normaliseMobile(data.mobile)}`,
    `Student: ${data.studentName}`,
    `Applying for: Standard ${data.standard}`,
  ];
  if (requiresStream(data.standard) && data.stream) {
    lines.push(`Stream: ${data.stream}`);
  }
  lines.push(
    `Current standard: ${data.currentStandard?.trim() || "Not provided"}`,
    `Enquiry about: ${data.enquiryType}`,
    `Preferred contact: ${data.preferredContact}`,
    `Question: ${data.message?.trim() || "No additional question"}`,
    "",
    "I understand that this enquiry does not confirm admission."
  );
  return lines.join("\n");
}

/** Build the final wa.me URL. The number must be digits only, no "+". */
export function buildWhatsAppUrl(data: EnquiryData): string {
  const text = encodeURIComponent(buildEnquiryMessage(data));
  return `${school.whatsappBase}?text=${text}`;
}
