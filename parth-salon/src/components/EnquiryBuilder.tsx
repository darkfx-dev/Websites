import { useState, useId, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { serviceCategories, publishedServices } from "../content/services";
import {
  buildConsultationMessage,
  whatsappLink,
  type ConsultationState,
} from "../lib/whatsapp";
import {
  validateConsultation,
  STEP_FIELDS,
  todayISO,
  MESSAGE_MAX,
  ENQUIRY_TYPES,
  DAYPARTS,
  HAIR_LENGTHS,
  REPLY_PREFS,
  type ConsultationInput,
  type ConsultationErrors,
} from "../lib/validation";
import { checkTimeWithinHours, formatTime12 } from "../lib/hours";
import { SectionReveal } from "./SectionReveal";
import { ChatGlyph } from "./Icons";
import { useAdaptiveMotion } from "../motion/useAdaptiveMotion";
import { duration, easeHeritage } from "../motion/variants";

const TOTAL_STEPS = 3;
const STEP_TITLES = ["What can we help with?", "Timing & details", "Your details"];

const empty: ConsultationInput = {
  enquiryType: "",
  serviceCategory: "",
  service: "",
  date: "",
  timeMode: "daypart",
  time: "",
  daypart: "",
  hairLength: "",
  notes: "",
  name: "",
  phone: "",
  replyPref: "WhatsApp",
  confirm: false,
};

/* Map the form state to the exact WhatsApp message shape. Ids become the
   human-readable labels/names; nothing is invented. */
function toState(v: ConsultationInput): ConsultationState {
  const cat = serviceCategories.find((c) => c.id === v.serviceCategory);
  const svc = publishedServices().find((s) => s.id === v.service);
  let preferredTime = "";
  if (v.timeMode === "exact" && v.time) preferredTime = formatTime12(v.time);
  else if (v.timeMode === "daypart" && v.daypart) preferredTime = v.daypart;
  return {
    enquiryType: v.enquiryType,
    serviceCategory: cat ? cat.label : "",
    service: svc ? svc.name : v.service === "help-me-choose" ? "Help me choose" : "",
    date: v.date,
    preferredTime,
    hairLength: v.hairLength === "Not applicable" ? "" : v.hairLength,
    replyPref: v.replyPref,
    name: v.name,
    phone: v.phone,
    notes: v.notes,
  };
}

const inputBase =
  "w-full rounded-[8px] border bg-white px-3.5 py-2.5 text-[0.98rem] text-graphite " +
  "placeholder:text-muted-ink/60 min-h-[48px] transition-colors focus-visible:border-forest-rich";

/* 3-step consultation builder. Composes a prefilled WhatsApp message from
   validated fields — no data leaves the browser until the visitor chooses to
   open WhatsApp, and the flow never claims a booking is confirmed. State lives
   only for the session (component state), with a "Clear form" reset. */
export function EnquiryBuilder() {
  const [values, setValues] = useState<ConsultationInput>(empty);
  const [errors, setErrors] = useState<ConsultationErrors>({});
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const { reduced } = useAdaptiveMotion();

  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;
  const regionRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const firstMount = useRef(true);

  const published = publishedServices();
  const enabledIds = published.map((s) => s.id);
  const categoryServices = values.serviceCategory
    ? published.filter((s) => s.categoryId === values.serviceCategory)
    : published;

  const set = <K extends keyof ConsultationInput>(k: K, v: ConsultationInput[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  // Move focus to the step region when the step changes (not on first paint,
  // not while typing), so screen-reader and keyboard users land in context.
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    regionRef.current?.focus();
  }, [step]);

  function errorsForStep(s: number): ConsultationErrors {
    const all = validateConsultation(values, enabledIds);
    const out: ConsultationErrors = {};
    for (const f of STEP_FIELDS[s]) if (all[f]) out[f] = all[f];
    return out;
  }

  function focusFirstError(errs: ConsultationErrors) {
    const first = Object.keys(errs)[0];
    if (first) document.getElementById(fid(first))?.focus();
  }

  function handleNext() {
    const stepErr = errorsForStep(step);
    if (Object.keys(stepErr).length > 0) {
      setErrors(stepErr);
      setStatus("Please check the highlighted fields before continuing.");
      focusFirstError(stepErr);
      return;
    }
    setErrors({});
    setStatus("");
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function handleBack() {
    setErrors({});
    setStatus("");
    setStep((s) => Math.max(1, s - 1));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const all = validateConsultation(values, enabledIds);
    if (Object.keys(all).length > 0) {
      setErrors(all);
      // Jump to the earliest step that still has an error.
      const bad = [1, 2, 3].find((s) => STEP_FIELDS[s].some((f) => all[f]));
      if (bad && bad !== step) {
        setStep(bad);
        setStatus("Some earlier details need attention — we've taken you back to them.");
        return;
      }
      setStatus("Please check the highlighted fields and try again.");
      focusFirstError(all);
      return;
    }
    setErrors({});
    setStatus("Opening WhatsApp…");
    const url = whatsappLink(buildConsultationMessage(toState(values)));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleClear() {
    setValues(empty);
    setErrors({});
    setStatus("Form cleared.");
    setStep(1);
  }

  const err = (k: keyof ConsultationInput) =>
    errors[k] ? (
      <p id={fid(`${k}-error`)} className="mt-1 flex items-start gap-1 text-[0.82rem] font-medium text-error">
        <AlertTriangle className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errors[k]}
      </p>
    ) : null;

  const borderFor = (k: keyof ConsultationInput) =>
    errors[k] ? "border-error" : "border-silver-line";

  const describedBy = (k: keyof ConsultationInput, extra?: string) =>
    [errors[k] ? fid(`${k}-error`) : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  // Non-blocking opening-hours intelligence for an exact chosen time.
  const timeCheck =
    values.timeMode === "exact"
      ? checkTimeWithinHours(values.date, values.time)
      : null;
  const outsideHours = timeCheck && !timeCheck.within;

  const stepErrKeys = STEP_FIELDS[step].filter((f) => errors[f]);

  // --- reusable chip radio ---------------------------------------------------
  function ChipGroup({
    field,
    legend,
    options,
    required,
  }: {
    field: keyof ConsultationInput;
    legend: string;
    options: readonly string[];
    required?: boolean;
  }) {
    const current = values[field] as string;
    return (
      <fieldset className="min-w-0" aria-describedby={describedBy(field)}>
        <legend className="mb-2 block text-[0.88rem] font-semibold text-graphite">
          {legend} {required && <span className="text-error">*</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {options.map((opt, i) => {
            const active = current === opt;
            return (
              <label
                key={opt}
                className={`tap inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-[0.9rem] transition-colors ${
                  active
                    ? "border-forest-rich bg-forest text-white"
                    : "border-silver-line bg-white text-graphite hover:border-forest-rich"
                }`}
              >
                <input
                  type="radio"
                  name={fid(field as string)}
                  id={i === 0 ? fid(field as string) : undefined}
                  value={opt}
                  checked={active}
                  onChange={() => set(field, opt as never)}
                  aria-invalid={i === 0 ? !!errors[field] : undefined}
                  className="sr-only"
                />
                {active && <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />}
                {opt}
              </label>
            );
          })}
        </div>
        {err(field)}
      </fieldset>
    );
  }

  // --- live summary ----------------------------------------------------------
  const st = toState(values);
  const summaryRows: [string, string][] = [
    ["Enquiry", st.enquiryType],
    ["Area", st.serviceCategory],
    ["Service", values.service ? st.service : ""],
    ["Date", st.date],
    ["Time", st.preferredTime],
    ["Reply via", st.replyPref],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <section id="contact" className="bg-ivory">
      <div className="container-page grid gap-10 py-20 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:py-28">
        {/* Intro + live summary */}
        <SectionReveal>
          <p className="eyebrow text-forest-rich">Plan a visit</p>
          <h2 className="mt-4 text-forest" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Build your enquiry
          </h2>
          <p className="mt-5 max-w-[34ch] text-[1.02rem] text-muted-ink">
            Answer a few quick questions and we&apos;ll prepare a WhatsApp
            message for you to review and send. We&apos;ll reply with
            availability, guidance, and current prices. This does not confirm a
            booking.
          </p>

          {summaryRows.length > 0 && (
            <div className="mt-8 rounded-[12px] border border-silver-line bg-white/70 p-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-wider text-forest-rich">
                Your enquiry so far
              </p>
              <dl className="mt-3 grid gap-1.5 text-[0.9rem]">
                {summaryRows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-ink">{k}</dt>
                    <dd className="text-right font-medium text-graphite">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </SectionReveal>

        {/* Stepper */}
        <SectionReveal>
          <form noValidate onSubmit={handleSubmit} className="min-w-0">
            {/* Progress — text label, not colour alone */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-[0.85rem] font-semibold text-forest-rich" aria-hidden="true">
                  Step {step} of {TOTAL_STEPS}
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="tap text-[0.82rem] font-medium text-muted-ink underline underline-offset-2 hover:text-forest"
                >
                  Clear form
                </button>
              </div>
              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < step ? "bg-forest-rich" : "bg-silver-line"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Announce the current step to assistive tech */}
            <p className="sr-only" role="status" aria-live="polite">
              Step {step} of {TOTAL_STEPS}: {STEP_TITLES[step - 1]}
            </p>

            <div
              ref={regionRef}
              tabIndex={-1}
              role="group"
              aria-label={`Step ${step} of ${TOTAL_STEPS}: ${STEP_TITLES[step - 1]}`}
              className="outline-none"
            >
              <h3 className="font-display text-[1.5rem] text-forest">
                {STEP_TITLES[step - 1]}
              </h3>

              {/* Error summary for the current step */}
              {stepErrKeys.length > 0 && (
                <div
                  ref={summaryRef}
                  role="alert"
                  className="mt-4 rounded-[10px] border border-error/40 bg-error/5 p-4 text-[0.88rem] text-error"
                >
                  <p className="font-semibold">Please fix the following:</p>
                  <ul className="mt-1.5 list-disc pl-5">
                    {stepErrKeys.map((k) => (
                      <li key={k}>
                        <a href={`#${fid(k)}`} className="underline underline-offset-2">
                          {errors[k]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={step}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  transition={{ duration: duration.step, ease: easeHeritage }}
                  className="mt-6 grid gap-5"
                >
                  {step === 1 && (
                    <>
                      <ChipGroup
                        field="enquiryType"
                        legend="What is your enquiry about?"
                        options={ENQUIRY_TYPES}
                        required
                      />

                      <div>
                        <label
                          htmlFor={fid("serviceCategory")}
                          className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                        >
                          Which area interests you? (optional)
                        </label>
                        <select
                          id={fid("serviceCategory")}
                          value={values.serviceCategory}
                          onChange={(e) => {
                            set("serviceCategory", e.target.value);
                            set("service", "");
                          }}
                          className={`${inputBase} border-silver-line`}
                        >
                          <option value="">Not sure yet</option>
                          {serviceCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {published.length > 0 ? (
                        <div>
                          <label
                            htmlFor={fid("service")}
                            className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                          >
                            Specific service (optional)
                          </label>
                          <select
                            id={fid("service")}
                            value={values.service}
                            onChange={(e) => set("service", e.target.value)}
                            aria-invalid={!!errors.service}
                            aria-describedby={describedBy("service")}
                            className={`${inputBase} ${borderFor("service")}`}
                          >
                            <option value="">No preference</option>
                            <option value="help-me-choose">Help me choose</option>
                            {categoryServices.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          {err("service")}
                        </div>
                      ) : (
                        <p className="text-[0.9rem] text-muted-ink">
                          Not sure which service you need? That&apos;s fine — pick
                          an area or leave it blank, and we&apos;ll guide you to
                          the right option when we reply.
                        </p>
                      )}
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={fid("date")}
                            className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                          >
                            Preferred date (optional)
                          </label>
                          <input
                            id={fid("date")}
                            type="date"
                            min={todayISO()}
                            value={values.date}
                            onChange={(e) => set("date", e.target.value)}
                            aria-invalid={!!errors.date}
                            aria-describedby={describedBy("date")}
                            className={`${inputBase} ${borderFor("date")}`}
                          />
                          {err("date")}
                        </div>

                        <div>
                          <span className="mb-1.5 block text-[0.88rem] font-semibold text-graphite">
                            How would you like to give a time?
                          </span>
                          <div className="flex gap-2">
                            {(["daypart", "exact"] as const).map((mode) => (
                              <label
                                key={mode}
                                className={`tap inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-full border px-3 text-[0.88rem] transition-colors ${
                                  values.timeMode === mode
                                    ? "border-forest-rich bg-forest text-white"
                                    : "border-silver-line bg-white text-graphite hover:border-forest-rich"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={fid("timeMode")}
                                  value={mode}
                                  checked={values.timeMode === mode}
                                  onChange={() => set("timeMode", mode)}
                                  className="sr-only"
                                />
                                {mode === "daypart" ? "Time of day" : "Exact time"}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {values.timeMode === "daypart" ? (
                        <ChipGroup
                          field="daypart"
                          legend="Preferred time of day (optional)"
                          options={DAYPARTS}
                        />
                      ) : (
                        <div className="sm:max-w-[12rem]">
                          <label
                            htmlFor={fid("time")}
                            className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                          >
                            Preferred time (optional)
                          </label>
                          <input
                            id={fid("time")}
                            type="time"
                            value={values.time}
                            onChange={(e) => set("time", e.target.value)}
                            className={`${inputBase} border-silver-line`}
                          />
                        </div>
                      )}

                      {/* Non-blocking opening-hours hint */}
                      {outsideHours && (
                        <p className="flex items-start gap-2 rounded-[10px] border border-amber-500/40 bg-amber-50 px-4 py-3 text-[0.86rem] text-amber-900">
                          <AlertTriangle className="mt-[2px] h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>
                            {timeCheck!.opens
                              ? `That time is outside our ${timeCheck!.dayLabel} hours (${timeCheck!.opens}–${timeCheck!.closes}).`
                              : `We're usually closed on ${timeCheck!.dayLabel}.`}{" "}
                            You can still send this — we&apos;ll suggest the
                            nearest available time.
                          </span>
                        </p>
                      )}

                      <ChipGroup
                        field="hairLength"
                        legend="Hair length (optional)"
                        options={HAIR_LENGTHS}
                      />

                      <div>
                        <label
                          htmlFor={fid("notes")}
                          className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                        >
                          Anything else? (optional)
                        </label>
                        <textarea
                          id={fid("notes")}
                          rows={3}
                          maxLength={MESSAGE_MAX}
                          value={values.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          aria-invalid={!!errors.notes}
                          aria-describedby={describedBy("notes", fid("notes-count"))}
                          className={`${inputBase} ${borderFor("notes")} resize-y`}
                        />
                        <div className="mt-1 flex justify-between">
                          {err("notes") ?? <span />}
                          <span id={fid("notes-count")} className="text-[0.78rem] text-muted-ink tabular-nums">
                            {values.notes.length}/{MESSAGE_MAX}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <label
                          htmlFor={fid("name")}
                          className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                        >
                          Your name <span className="text-error">*</span>
                        </label>
                        <input
                          id={fid("name")}
                          type="text"
                          autoComplete="name"
                          value={values.name}
                          onChange={(e) => set("name", e.target.value)}
                          aria-invalid={!!errors.name}
                          aria-describedby={describedBy("name")}
                          className={`${inputBase} ${borderFor("name")}`}
                        />
                        {err("name")}
                      </div>

                      <div>
                        <label
                          htmlFor={fid("phone")}
                          className="mb-1.5 block text-[0.88rem] font-semibold text-graphite"
                        >
                          Mobile number <span className="text-error">*</span>
                        </label>
                        <input
                          id={fid("phone")}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+91…"
                          value={values.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          aria-invalid={!!errors.phone}
                          aria-describedby={describedBy("phone")}
                          className={`${inputBase} ${borderFor("phone")}`}
                        />
                        {err("phone")}
                      </div>

                      <ChipGroup
                        field="replyPref"
                        legend="Preferred reply"
                        options={REPLY_PREFS}
                      />

                      <div>
                        <label className="flex items-start gap-3 text-[0.9rem] text-graphite">
                          <input
                            id={fid("confirm")}
                            type="checkbox"
                            checked={values.confirm}
                            onChange={(e) => set("confirm", e.target.checked)}
                            aria-invalid={!!errors.confirm}
                            aria-describedby={describedBy("confirm")}
                            className="mt-0.5 h-5 w-5 shrink-0 rounded border-silver-line accent-forest"
                          />
                          <span>
                            I understand this sends a WhatsApp enquiry and does
                            not confirm an appointment.{" "}
                            <span className="text-error">*</span>
                          </span>
                        </label>
                        {err("confirm")}
                      </div>
                    </>
                  )}
                </m.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="tap inline-flex min-h-[52px] items-center justify-center rounded-[8px] border border-silver-line bg-white px-6 font-semibold text-forest transition-colors hover:border-forest-rich"
                >
                  Back
                </button>
              )}
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="tap inline-flex min-h-[52px] items-center justify-center rounded-[8px] bg-forest px-6 font-semibold text-white transition-colors hover:bg-forest-rich"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="tap inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] bg-whatsapp px-6 font-semibold text-[#04310f] transition-[filter] hover:brightness-95"
                >
                  <ChatGlyph />
                  Continue on WhatsApp
                </button>
              )}
            </div>

            <p role="status" aria-live="polite" className="mt-4 min-h-[1.2em] text-[0.85rem] text-muted-ink">
              {status}
            </p>
          </form>
        </SectionReveal>
      </div>
    </section>
  );
}
