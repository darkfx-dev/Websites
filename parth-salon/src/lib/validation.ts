/* Appointment-form validation. Pure functions — no framework coupling — so
   the same rules can be unit-tested and reused. */

export interface EnquiryInput {
  name: string;
  phone: string;
  inquiryType: string;
  date: string; // yyyy-mm-dd from <input type=date>, may be ""
  time: string;
  message: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export const MESSAGE_MAX = 500;

export const INQUIRY_TYPES = [
  "Appointment inquiry",
  "Services and pricing",
  "Availability inquiry",
  "General question",
] as const;

/** Local yyyy-mm-dd for "today" so a same-day appointment is allowed. */
export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Lenient international phone check: 7–15 digits, optional leading +,
    spaces/dashes/parens allowed. Deliberately permissive to avoid rejecting
    valid formats. */
export function isValidPhone(raw: string): boolean {
  const trimmed = raw.trim();
  if (!/^[+\d][\d\s()-]*$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/* --- 3-step consultation builder ---------------------------------------- */
export const ENQUIRY_TYPES = [
  "Appointment availability",
  "Service consultation",
  "Pricing enquiry",
  "General enquiry",
] as const;

export const DAYPARTS = ["Morning", "Afternoon", "Evening", "Flexible"] as const;
export const HAIR_LENGTHS = ["Short", "Medium", "Long", "Not sure", "Not applicable"] as const;
export const REPLY_PREFS = ["WhatsApp", "Phone"] as const;

export interface ConsultationInput {
  enquiryType: string;
  serviceCategory: string;
  service: string;
  date: string;
  timeMode: "exact" | "daypart";
  time: string; // HH:MM when timeMode==="exact"
  daypart: string;
  hairLength: string;
  notes: string;
  name: string;
  phone: string;
  replyPref: string;
  confirm: boolean;
}

export type ConsultationErrors = Partial<Record<keyof ConsultationInput, string>>;

/** Validate a whole consultation. `enabledServiceIds` are the ids that may be
    selected (published services); an unknown id is rejected. */
export function validateConsultation(
  input: ConsultationInput,
  enabledServiceIds: string[] = [],
): ConsultationErrors {
  const e: ConsultationErrors = {};
  if (!input.enquiryType) e.enquiryType = "Please choose what your enquiry is about.";
  if (input.service && input.service !== "help-me-choose" && !enabledServiceIds.includes(input.service)) {
    e.service = "That service isn't available — please choose another.";
  }
  if (input.date && input.date < todayISO()) e.date = "Please choose today or a future date.";
  if (input.notes.length > MESSAGE_MAX) e.notes = `Please keep notes under ${MESSAGE_MAX} characters.`;
  if (!input.name.trim()) e.name = "Please enter your name.";
  else if (input.name.trim().length > 80) e.name = "Please shorten your name.";
  if (!input.phone.trim()) e.phone = "Please enter a mobile number.";
  else if (!isValidPhone(input.phone)) e.phone = "Enter a valid mobile number (7–15 digits).";
  if (!input.confirm) e.confirm = "Please tick the box to continue.";
  return e;
}

/** Fields owned by each step, so "Next" can validate just its own step. */
export const STEP_FIELDS: Record<number, (keyof ConsultationInput)[]> = {
  1: ["enquiryType", "service"],
  2: ["date", "notes"],
  3: ["name", "phone", "confirm"],
};

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!input.name.trim()) {
    errors.name = "Please enter your name.";
  } else if (input.name.trim().length > 80) {
    errors.name = "Please shorten your name.";
  }

  if (!input.phone.trim()) {
    errors.phone = "Please enter a phone number.";
  } else if (!isValidPhone(input.phone)) {
    errors.phone = "Enter a valid phone number (7–15 digits).";
  }

  if (!input.inquiryType) {
    errors.inquiryType = "Please choose what your enquiry is about.";
  }

  if (input.date) {
    if (input.date < todayISO()) {
      errors.date = "Please choose today or a future date.";
    }
  }

  if (input.message.length > MESSAGE_MAX) {
    errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
  }

  return errors;
}
