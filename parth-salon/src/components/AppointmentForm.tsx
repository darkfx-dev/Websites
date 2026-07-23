import { useState, useId } from "react";
import { buildEnquiryMessage, whatsappLink } from "../lib/whatsapp";
import {
  validateEnquiry,
  todayISO,
  INQUIRY_TYPES,
  MESSAGE_MAX,
  type EnquiryInput,
  type EnquiryErrors,
} from "../lib/validation";
import { SectionReveal } from "./SectionReveal";
import { ChatGlyph } from "./Icons";

const empty: EnquiryInput = {
  name: "",
  phone: "",
  inquiryType: "",
  date: "",
  time: "",
  message: "",
};

/* Builds a WhatsApp enquiry from validated fields. Nothing is sent to a
   server; the browser opens WhatsApp with a prefilled, URL-encoded message.
   The form never claims the appointment is confirmed. */
export function AppointmentForm() {
  const [values, setValues] = useState<EnquiryInput>(empty);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<string>("");
  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;

  const set = (k: keyof EnquiryInput, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("Please check the highlighted fields and try again.");
      // Move focus to the first field with an error.
      const firstKey = Object.keys(found)[0];
      document.getElementById(fid(firstKey))?.focus();
      return;
    }
    setStatus("Opening WhatsApp…");
    const url = whatsappLink(buildEnquiryMessage(values));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const fieldError = (k: keyof EnquiryInput) =>
    errors[k] ? (
      <p id={fid(`${k}-error`)} className="mt-1 text-[0.82rem] font-medium text-error">
        {errors[k]}
      </p>
    ) : null;

  const inputBase =
    "w-full rounded-[8px] border bg-white px-3.5 py-2.5 text-[0.98rem] text-graphite " +
    "placeholder:text-muted-ink/60 min-h-[48px] transition-colors " +
    "focus-visible:border-forest-rich";
  const borderFor = (k: keyof EnquiryInput) =>
    errors[k] ? "border-error" : "border-silver-line";

  return (
    <section id="contact" className="bg-ivory">
      <div className="container-page grid gap-10 py-20 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:py-28">
        <SectionReveal>
          <p className="eyebrow text-forest-rich">Appointment enquiry</p>
          <h2 className="mt-4 text-forest" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Send an enquiry
          </h2>
          <p className="mt-5 max-w-[34ch] text-[1.02rem] text-muted-ink">
            Fill in a few details and continue on WhatsApp — your message is
            prepared for you. We&apos;ll reply with availability, services, and
            prices. This form does not confirm a booking.
          </p>
        </SectionReveal>

        <SectionReveal>
          <form noValidate onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <div>
              <label htmlFor={fid("name")} className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                Full name <span className="text-error">*</span>
              </label>
              <input
                id={fid("name")}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? fid("name-error") : undefined}
                className={`${inputBase} ${borderFor("name")}`}
              />
              {fieldError("name")}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor={fid("phone")} className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                Phone number <span className="text-error">*</span>
              </label>
              <input
                id={fid("phone")}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="+91…"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? fid("phone-error") : undefined}
                className={`${inputBase} ${borderFor("phone")}`}
              />
              {fieldError("phone")}
            </div>

            {/* Inquiry type */}
            <div>
              <label htmlFor={fid("inquiryType")} className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                What is your enquiry about? <span className="text-error">*</span>
              </label>
              <select
                id={fid("inquiryType")}
                name="inquiryType"
                required
                value={values.inquiryType}
                onChange={(e) => set("inquiryType", e.target.value)}
                aria-invalid={!!errors.inquiryType}
                aria-describedby={errors.inquiryType ? fid("inquiryType-error") : undefined}
                className={`${inputBase} ${borderFor("inquiryType")}`}
              >
                <option value="" disabled>
                  Choose one…
                </option>
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {fieldError("inquiryType")}
            </div>

            {/* Date + time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={fid("date")} className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                  Preferred date
                </label>
                <input
                  id={fid("date")}
                  name="date"
                  type="date"
                  min={todayISO()}
                  value={values.date}
                  onChange={(e) => set("date", e.target.value)}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? fid("date-error") : undefined}
                  className={`${inputBase} ${borderFor("date")}`}
                />
                {fieldError("date")}
              </div>
              <div>
                <label htmlFor={fid("time")} className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                  Preferred time
                </label>
                <input
                  id={fid("time")}
                  name="time"
                  type="time"
                  value={values.time}
                  onChange={(e) => set("time", e.target.value)}
                  className={`${inputBase} ${borderFor("time")}`}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor={fid("message")} className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                Additional message
              </label>
              <textarea
                id={fid("message")}
                name="message"
                rows={3}
                maxLength={MESSAGE_MAX}
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? fid("message-error") : undefined}
                className={`${inputBase} ${borderFor("message")} resize-y`}
              />
              <div className="mt-1 flex justify-between">
                {fieldError("message") ?? <span />}
                <span className="text-[0.78rem] text-muted-ink tabular-nums">
                  {values.message.length}/{MESSAGE_MAX}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="tap mt-1 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] bg-whatsapp px-6 font-semibold text-[#04310f] transition-[filter] hover:brightness-95"
            >
              <ChatGlyph />
              Continue on WhatsApp
            </button>

            {/* Status / error announcements for screen readers */}
            <p role="status" aria-live="polite" className="min-h-[1.2em] text-[0.85rem] text-muted-ink">
              {status}
            </p>
          </form>
        </SectionReveal>
      </div>
    </section>
  );
}
