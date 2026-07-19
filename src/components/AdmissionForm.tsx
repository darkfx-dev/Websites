import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  enquirySchema,
  requiresStream,
  buildEnquiryMessage,
  buildWhatsAppUrl,
  normaliseMobile,
  STANDARDS,
  STREAMS,
  ENQUIRY_TYPES,
  CONTACT_METHODS,
  MESSAGE_LIMIT,
  type EnquiryData,
} from "../lib/enquiry";
import { school } from "../data/school";

/**
 * Admission Enquiry — privacy-minimising, no-storage flow.
 * Three short steps plus a review screen. Data lives only in component state;
 * nothing is persisted or transmitted until the parent opens WhatsApp and
 * sends the prepared message themselves.
 */

type StepId = 0 | 1 | 2 | 3;

const STEP_LABELS = ["Your details", "Student", "Enquiry", "Review"] as const;

const STEP_FIELDS: Record<Exclude<StepId, 3>, (keyof EnquiryData)[]> = {
  0: ["parentName", "mobile"],
  1: ["studentName", "standard", "stream", "currentStandard"],
  2: ["enquiryType", "preferredContact", "message", "consent"],
};

export default function AdmissionForm() {
  const [step, setStep] = useState<StepId>(0);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const {
    register,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<EnquiryData>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      parentName: "",
      mobile: "",
      studentName: "",
      stream: "",
      currentStandard: "",
      message: "",
      consent: undefined as unknown as true,
    },
  });

  const standard = watch("standard");
  const streamNeeded = requiresStream(standard ?? "");
  const messageValue = watch("message") ?? "";

  const goTo = (next: StepId) => {
    setStep(next);
    setPopupBlocked(false);
    // Move focus to the step heading so screen readers announce progress.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const nextFrom = async (current: Exclude<StepId, 3>) => {
    const valid = await trigger(STEP_FIELDS[current], { shouldFocus: true });
    if (valid) goTo((current + 1) as StepId);
  };

  const data = getValues();
  const whatsAppUrl = useMemo(
    () => (step === 3 ? buildWhatsAppUrl(data) : ""),
    [step, data]
  );

  const openWhatsApp = () => {
    const win = window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
    if (!win) setPopupBlocked(true);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildEnquiryMessage(getValues()));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      /* Clipboard unavailable — the visible summary text remains selectable. */
    }
  };

  const stepErrors =
    step < 3
      ? STEP_FIELDS[step as Exclude<StepId, 3>]
          .map((f) => ({ field: f, error: errors[f] }))
          .filter((e) => e.error)
      : [];

  const motionProps = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
      };

  const err = (field: keyof EnquiryData) =>
    errors[field] ? (
      <p className="field-error" id={`${field}-error`} role="alert">
        {errors[field]?.message as string}
      </p>
    ) : null;

  const describedBy = (field: keyof EnquiryData, helpId?: string) =>
    [errors[field] ? `${field}-error` : null, helpId]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="enquiry">
      {/* Progress */}
      <ol className="enquiry__progress" aria-label="Enquiry progress">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            aria-current={step === i ? "step" : undefined}
            data-state={i < step ? "done" : i === step ? "active" : "todo"}
          >
            <span aria-hidden="true">{i + 1}</span> {label}
          </li>
        ))}
      </ol>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="enquiry__step-title"
      >
        Step {step + 1} of 4 — {STEP_LABELS[step]}
      </h2>

      {stepErrors.length > 1 && (
        <div className="enquiry__error-summary" role="alert">
          <p>Please fix the following before continuing:</p>
          <ul>
            {stepErrors.map(({ field, error }) => (
              <li key={field}>{error?.message as string}</li>
            ))}
          </ul>
        </div>
      )}

      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.fieldset key="s0" {...motionProps} transition={{ duration: reduce ? 0 : 0.22 }}>
              <legend className="sr-only">Parent or guardian details</legend>
              <div className="field">
                <label htmlFor="parentName">Parent / guardian full name *</label>
                <input
                  id="parentName"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.parentName}
                  aria-describedby={describedBy("parentName")}
                  {...register("parentName")}
                />
                {err("parentName")}
              </div>
              <div className="field">
                <label htmlFor="mobile">Parent / guardian mobile number *</label>
                <input
                  id="mobile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.mobile}
                  aria-describedby={describedBy("mobile", "mobile-help")}
                  {...register("mobile")}
                />
                <p className="field-help" id="mobile-help">
                  10-digit Indian mobile number. +91 is optional.
                </p>
                {err("mobile")}
              </div>
              <div className="enquiry__nav">
                <button type="button" className="btn btn--primary" onClick={() => nextFrom(0)}>
                  Continue
                </button>
              </div>
            </motion.fieldset>
          )}

          {step === 1 && (
            <motion.fieldset key="s1" {...motionProps} transition={{ duration: reduce ? 0 : 0.22 }}>
              <legend className="sr-only">Student details</legend>
              <div className="field">
                <label htmlFor="studentName">Student full name *</label>
                <input
                  id="studentName"
                  type="text"
                  aria-invalid={!!errors.studentName}
                  aria-describedby={describedBy("studentName")}
                  {...register("studentName")}
                />
                {err("studentName")}
              </div>
              <div className="field">
                <label htmlFor="standard">Standard applying for *</label>
                <select
                  id="standard"
                  aria-invalid={!!errors.standard}
                  aria-describedby={describedBy("standard")}
                  {...register("standard")}
                >
                  <option value="">Choose a standard</option>
                  {STANDARDS.map((s) => (
                    <option key={s} value={s}>
                      Standard {s}
                    </option>
                  ))}
                </select>
                {err("standard")}
              </div>

              {streamNeeded && (
                <div className="field" role="radiogroup" aria-labelledby="stream-label">
                  <span id="stream-label" className="field-label">
                    Preferred stream (Standard 11–12) *
                  </span>
                  <div className="field-options">
                    {STREAMS.map((s) => (
                      <label key={s} className="option">
                        <input
                          type="radio"
                          value={s}
                          aria-describedby={describedBy("stream")}
                          {...register("stream")}
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                  {err("stream")}
                </div>
              )}

              <div className="field">
                <label htmlFor="currentStandard">
                  Current standard <span className="optional">(optional)</span>
                </label>
                <input
                  id="currentStandard"
                  type="text"
                  placeholder="e.g. Standard 4"
                  {...register("currentStandard")}
                />
              </div>
              <div className="enquiry__nav">
                <button type="button" className="btn btn--secondary" onClick={() => goTo(0)}>
                  Back
                </button>
                <button type="button" className="btn btn--primary" onClick={() => nextFrom(1)}>
                  Continue
                </button>
              </div>
            </motion.fieldset>
          )}

          {step === 2 && (
            <motion.fieldset key="s2" {...motionProps} transition={{ duration: reduce ? 0 : 0.22 }}>
              <legend className="sr-only">About your enquiry</legend>
              <div className="field">
                <label htmlFor="enquiryType">Enquiry about *</label>
                <select
                  id="enquiryType"
                  aria-invalid={!!errors.enquiryType}
                  aria-describedby={describedBy("enquiryType")}
                  {...register("enquiryType")}
                >
                  <option value="">Choose one</option>
                  {ENQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {err("enquiryType")}
              </div>

              <div className="field" role="radiogroup" aria-labelledby="contact-label">
                <span id="contact-label" className="field-label">
                  Preferred contact method *
                </span>
                <div className="field-options">
                  {CONTACT_METHODS.map((m) => (
                    <label key={m} className="option">
                      <input
                        type="radio"
                        value={m}
                        aria-describedby={describedBy("preferredContact")}
                        {...register("preferredContact")}
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
                {err("preferredContact")}
              </div>

              <div className="field">
                <label htmlFor="message">
                  Additional question <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  maxLength={MESSAGE_LIMIT}
                  aria-invalid={!!errors.message}
                  aria-describedby={describedBy("message", "message-help")}
                  {...register("message")}
                />
                <p className="field-help" id="message-help">
                  {MESSAGE_LIMIT - messageValue.length} characters left
                </p>
                {err("message")}
              </div>

              <div className="field field--consent">
                <label className="option option--consent">
                  <input
                    type="checkbox"
                    aria-invalid={!!errors.consent}
                    aria-describedby={describedBy("consent")}
                    {...register("consent")}
                  />
                  <span>
                    I understand these details will be placed into a WhatsApp
                    message that I review and send myself, or used by me to
                    call the school. This website does not store them. *
                  </span>
                </label>
                {err("consent")}
              </div>

              <div className="enquiry__nav">
                <button type="button" className="btn btn--secondary" onClick={() => goTo(1)}>
                  Back
                </button>
                <button type="button" className="btn btn--primary" onClick={() => nextFrom(2)}>
                  Review enquiry
                </button>
              </div>
            </motion.fieldset>
          )}

          {step === 3 && (
            <motion.div key="s3" {...motionProps} transition={{ duration: reduce ? 0 : 0.22 }}>
              <div className="enquiry__review">
                <dl>
                  <div><dt>Parent / guardian</dt><dd>{data.parentName}</dd></div>
                  <div><dt>Mobile</dt><dd>{normaliseMobile(data.mobile)}</dd></div>
                  <div><dt>Student</dt><dd>{data.studentName}</dd></div>
                  <div><dt>Applying for</dt><dd>Standard {data.standard}</dd></div>
                  {streamNeeded && data.stream && (
                    <div><dt>Stream</dt><dd>{data.stream}</dd></div>
                  )}
                  <div>
                    <dt>Current standard</dt>
                    <dd>{data.currentStandard?.trim() || "Not provided"}</dd>
                  </div>
                  <div><dt>Enquiry about</dt><dd>{data.enquiryType}</dd></div>
                  <div><dt>Preferred contact</dt><dd>{data.preferredContact}</dd></div>
                  <div>
                    <dt>Question</dt>
                    <dd>{data.message?.trim() || "No additional question"}</dd>
                  </div>
                </dl>
              </div>

              <p className="enquiry__disclaimer">
                Choosing <strong>Continue on WhatsApp</strong> opens WhatsApp
                with this enquiry as a prepared message. You can still edit it
                there, and it is only sent when you press send. Sending an
                enquiry does not confirm admission — the school will confirm
                availability and next steps directly.
              </p>

              <div className="enquiry__nav enquiry__nav--final">
                <button type="button" className="btn btn--secondary" onClick={() => goTo(2)}>
                  Back and edit
                </button>
                <button type="button" className="btn btn--primary" onClick={openWhatsApp}>
                  Continue on WhatsApp
                </button>
                <a className="btn btn--secondary" href={school.phoneHref}>
                  Call Admissions ({school.phoneDisplay})
                </a>
              </div>

              {popupBlocked && (
                <div className="enquiry__fallback" role="alert">
                  <p>
                    WhatsApp didn't open — your browser may have blocked the
                    popup. You can copy the message below and open WhatsApp
                    yourself, or use this direct link:{" "}
                    <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                      Open WhatsApp with your enquiry
                    </a>
                  </p>
                  <pre>{buildEnquiryMessage(getValues())}</pre>
                  <button type="button" className="btn btn--secondary" onClick={copySummary}>
                    {copied ? "Copied ✓" : "Copy message"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <style>{`
        .enquiry { max-width: 40rem; }
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }
        .enquiry__progress {
          list-style: none; display: flex; flex-wrap: wrap;
          gap: 0.5rem 1.25rem; padding: 0; margin: 0 0 1.5rem;
          font-size: 0.8125rem; font-weight: 700;
        }
        .enquiry__progress li {
          display: flex; align-items: center; gap: 0.4rem;
          color: var(--ink-muted);
        }
        .enquiry__progress li span {
          display: grid; place-items: center;
          width: 1.5rem; height: 1.5rem; border-radius: 50%;
          border: 2px solid currentColor; font-size: 0.75rem;
        }
        .enquiry__progress li[data-state="active"] { color: var(--red); }
        .enquiry__progress li[data-state="done"] { color: var(--ink); }
        .enquiry__step-title {
          font-family: var(--font-sans); font-size: 1.15rem;
          margin-bottom: 1.25rem;
        }
        .enquiry__step-title:focus { outline: none; }
        .enquiry__error-summary {
          background: var(--red-tint); border-left: 3px solid var(--red);
          padding: 1rem 1.25rem; border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
        }
        .enquiry__error-summary p { font-weight: 700; margin-bottom: 0.5rem; }
        .enquiry__error-summary ul { margin: 0; padding-left: 1.25rem; }
        fieldset { border: 0; padding: 0; margin: 0; }
        .field { margin-bottom: 1.4rem; }
        .field label:not(.option), .field-label {
          display: block; font-weight: 700; margin-bottom: 0.4rem;
        }
        .optional { font-weight: 500; color: var(--ink-muted); }
        .field input[type="text"], .field input[type="tel"],
        .field select, .field textarea {
          width: 100%; min-height: 48px;
          padding: 0.65rem 0.9rem;
          font: inherit; color: var(--ink);
          background: var(--paper);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .field textarea { resize: vertical; }
        .field input:focus-visible, .field select:focus-visible,
        .field textarea:focus-visible {
          outline: 3px solid var(--red); outline-offset: 1px;
        }
        .field [aria-invalid="true"] { border-color: var(--red); }
        .field-help {
          font-size: 0.875rem; color: var(--ink-muted);
          margin: 0.35rem 0 0;
        }
        .field-error {
          display: flex; gap: 0.4rem;
          font-size: 0.9rem; font-weight: 600; color: var(--red-deep);
          margin: 0.4rem 0 0;
        }
        .field-error::before { content: "⚠"; }
        .field-options { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .option {
          display: inline-flex; align-items: center; gap: 0.6rem;
          min-height: 48px; padding: 0.5rem 1rem;
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          font-weight: 600; cursor: pointer;
        }
        .option:has(input:checked) {
          border-color: var(--red); background: var(--red-tint);
        }
        .option input { width: 1.15rem; height: 1.15rem; accent-color: var(--red); }
        .option--consent { align-items: flex-start; padding: 1rem; font-weight: 500; }
        .option--consent input { margin-top: 0.2rem; flex: none; }
        .enquiry__nav {
          display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem;
        }
        .enquiry__review dl { margin: 0; border-top: 1px solid var(--border); }
        .enquiry__review dl > div {
          display: grid; grid-template-columns: minmax(9rem, 0.6fr) 1fr;
          gap: 1rem; padding: 0.75rem 0.25rem;
          border-bottom: 1px solid var(--border);
        }
        .enquiry__review dt {
          font-weight: 800; font-size: 0.8125rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ink-muted); align-self: center;
        }
        .enquiry__review dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
        .enquiry__disclaimer {
          margin-top: 1.5rem; padding: 1rem 1.25rem;
          background: var(--surface); border-left: 3px solid var(--red);
          font-size: 0.9375rem; color: var(--ink-muted);
        }
        .enquiry__fallback {
          margin-top: 1.5rem; padding: 1.25rem;
          border: 1.5px solid var(--red); border-radius: var(--radius-md);
          background: var(--red-tint);
        }
        .enquiry__fallback pre {
          white-space: pre-wrap; overflow-wrap: anywhere;
          background: var(--paper); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 1rem;
          font-size: 0.875rem; max-height: 16rem; overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
