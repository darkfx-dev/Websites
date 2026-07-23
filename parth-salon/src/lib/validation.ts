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
