"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CakePreview } from "@/components/studio/CakePreview";
import { Reveal } from "@/components/Reveal";
import { cakeOptions, INSCRIPTION_LIMIT } from "@/data/cake-options";
import {
  buildInquiryMessage,
  inquiryWhatsappHref,
  type CakeInquiry,
} from "@/lib/inquiry";

/**
 * The cake-order studio: a guided five-screen inquiry builder that compiles
 * every selection into one WhatsApp message (see lib/inquiry.ts, unit-tested
 * in tests/inquiry.test.ts). No backend, no payment — WhatsApp is how this
 * shop confirms every order. Selections persist for the session; nothing is
 * lost moving backward. Submission is an inquiry, never a guarantee.
 */

const STORAGE_KEY = "qb-cake-inquiry";

const screens = [
  "The occasion",
  "The cake",
  "Flavour & finish",
  "Make it yours",
  "Review & send",
] as const;

type Draft = CakeInquiry & { colourName?: string };

const emptyDraft: Draft = {
  occasion: cakeOptions.occasions[0],
  style: cakeOptions.styles[0],
  flavor: cakeOptions.flavors[0],
  filling: cakeOptions.fillings[0],
  shape: cakeOptions.shapes[0],
  weight: cakeOptions.weights[1],
  finish: cakeOptions.finishes[0],
  colourName: cakeOptions.colours[0].name,
  fulfilment: cakeOptions.fulfilment[0],
};

export function CakeStudio() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [triedSend, setTriedSend] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restored = useRef(false);

  // Session persistence — restore once, save on every change after that.
  // Restoring must happen after hydration (sessionStorage is client-only and
  // the server HTML renders the empty draft), so the setState-in-effect here
  // is the deliberate canonical pattern, not an accident.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDraft({ ...emptyDraft, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    restored.current = true;
  }, []);
  useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage full/blocked — the in-memory draft still works */
    }
  }, [draft]);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const colourHex =
    cakeOptions.colours.find((c) => c.name === draft.colourName)?.hex ??
    "#f3e4c8";

  const inquiry: CakeInquiry = useMemo(
    () => ({ ...draft, colour: draft.colourName }),
    [draft]
  );

  const dateValid = !!draft.date && draft.date >= todayISO();
  const nameValid = !!draft.name?.trim();
  const canSend = dateValid && nameValid;

  const go = (next: number) => {
    setStep(Math.max(0, Math.min(screens.length - 1, next)));
    // Move focus to the step heading so keyboard/screen-reader users land
    // somewhere sensible after the transition.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  return (
    <div className="studio grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <div>
        {/* Progress */}
        <nav aria-label="Order steps" className="flex items-center gap-2">
          {screens.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => go(i)}
              aria-current={i === step ? "step" : undefined}
              className={`h-11 flex-1 cursor-pointer border-b-2 px-1 text-left text-[0.72rem] font-semibold uppercase tracking-wider transition-colors duration-200 sm:text-xs ${
                i === step
                  ? "border-caramel text-vanilla"
                  : i < step
                    ? "border-caramel/50 text-taupe hover:text-vanilla"
                    : "border-porcelain/15 text-taupe/70 hover:text-vanilla"
              }`}
            >
              <span className="hidden sm:inline">{i + 1}. </span>
              {label}
            </button>
          ))}
        </nav>
        <p className="mt-3 text-sm text-taupe">
          Step {step + 1} of {screens.length}
        </p>

        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 font-display text-3xl font-medium text-porcelain outline-none sm:text-4xl"
        >
          {screens[step]}
        </h3>

        <div key={step} className="step-enter mt-7 space-y-7">
          {step === 0 && (
            <>
              <OptionPills
                label="What are we celebrating?"
                options={cakeOptions.occasions}
                value={draft.occasion}
                onChange={(v) => set({ occasion: v })}
              />
              <label className="block max-w-xs">
                <span className="text-sm font-semibold text-porcelain/85">
                  When do you need it?
                </span>
                <input
                  type="date"
                  required
                  min={todayISO()}
                  value={draft.date ?? ""}
                  onChange={(e) => set({ date: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-porcelain/20 bg-noir/60 px-4 py-3 text-porcelain focus:border-caramel focus:outline-none"
                />
                <span className="mt-1.5 block text-xs text-taupe">
                  We&rsquo;ll confirm timing on WhatsApp — custom work needs a
                  little notice.
                </span>
              </label>
              <OptionPills
                label="Collection or delivery?"
                options={cakeOptions.fulfilment}
                value={draft.fulfilment}
                onChange={(v) => set({ fulfilment: v })}
              />
            </>
          )}

          {step === 1 && (
            <>
              <OptionPills
                label="Cake style"
                options={cakeOptions.styles}
                value={draft.style}
                onChange={(v) => set({ style: v })}
              />
              <OptionPills
                label="Shape"
                options={cakeOptions.shapes}
                value={draft.shape}
                onChange={(v) => set({ shape: v })}
              />
              <OptionPills
                label="Weight"
                options={cakeOptions.weights}
                value={draft.weight}
                onChange={(v) => set({ weight: v })}
              />
            </>
          )}

          {step === 2 && (
            <>
              <OptionPills
                label="Flavour"
                options={cakeOptions.flavors}
                value={draft.flavor}
                onChange={(v) => set({ flavor: v })}
              />
              <OptionPills
                label="Filling (optional)"
                options={cakeOptions.fillings}
                value={draft.filling}
                onChange={(v) => set({ filling: v })}
              />
              <OptionPills
                label="Finish"
                options={cakeOptions.finishes}
                value={draft.finish}
                onChange={(v) => set({ finish: v })}
              />
              <fieldset>
                <legend className="text-sm font-semibold text-porcelain/85">
                  Colour preference
                </legend>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {cakeOptions.colours.map((c) => {
                    const selected = draft.colourName === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => set({ colourName: c.name })}
                        aria-pressed={selected}
                        title={c.name}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors duration-150 ${
                          selected
                            ? "border-caramel bg-caramel/15 text-porcelain"
                            : "border-porcelain/20 text-porcelain/75 hover:border-caramel/60"
                        }`}
                      >
                        <span
                          aria-hidden
                          className="h-4 w-4 rounded-full border border-noir/40"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block">
                <span className="flex items-baseline justify-between text-sm font-semibold text-porcelain/85">
                  Writing on the cake
                  <span className="font-normal tabular-nums text-taupe">
                    {(draft.inscription ?? "").length}/{INSCRIPTION_LIMIT}
                  </span>
                </span>
                <input
                  type="text"
                  maxLength={INSCRIPTION_LIMIT}
                  value={draft.inscription ?? ""}
                  onChange={(e) => set({ inscription: e.target.value })}
                  placeholder="Happy Birthday Aarav!"
                  className="mt-2 w-full rounded-lg border border-porcelain/20 bg-noir/60 px-4 py-3 text-porcelain placeholder:text-porcelain/40 focus:border-caramel focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-porcelain/85">
                  Dietary or allergy notes{" "}
                  <span className="font-normal text-taupe">(optional)</span>
                </span>
                <input
                  type="text"
                  value={draft.dietary ?? ""}
                  onChange={(e) => set({ dietary: e.target.value })}
                  placeholder="Eggless, no nuts…"
                  className="mt-2 w-full rounded-lg border border-porcelain/20 bg-noir/60 px-4 py-3 text-porcelain placeholder:text-porcelain/40 focus:border-caramel focus:outline-none"
                />
                <span className="mt-1.5 block text-xs text-taupe">
                  We&rsquo;ll discuss allergies with you directly — this note
                  starts the conversation, it isn&rsquo;t a guarantee.
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-porcelain/85">
                  Anything else about the design?{" "}
                  <span className="font-normal text-taupe">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  value={draft.notes ?? ""}
                  onChange={(e) => set({ notes: e.target.value })}
                  placeholder="Theme, reference photo you'll share, colours to avoid…"
                  className="mt-2 w-full rounded-lg border border-porcelain/20 bg-noir/60 px-4 py-3 text-porcelain placeholder:text-porcelain/40 focus:border-caramel focus:outline-none"
                />
              </label>
            </>
          )}

          {step === 4 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-porcelain/85">
                    Your name
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={draft.name ?? ""}
                    onChange={(e) => set({ name: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-porcelain/20 bg-noir/60 px-4 py-3 text-porcelain focus:border-caramel focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-porcelain/85">
                    Callback number{" "}
                    <span className="font-normal text-taupe">(optional)</span>
                  </span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={draft.callback ?? ""}
                    onChange={(e) => set({ callback: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-porcelain/20 bg-noir/60 px-4 py-3 text-porcelain focus:border-caramel focus:outline-none"
                  />
                </label>
              </div>

              <div className="rounded-xl border border-porcelain/15 bg-noir/50 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-taupe">
                  Your inquiry
                </h4>
                <pre className="mt-3 whitespace-pre-wrap font-body text-[0.92rem] leading-relaxed text-porcelain/85">
                  {buildInquiryMessage(inquiry)}
                </pre>
              </div>

              {triedSend && !canSend && (
                <p role="alert" className="text-sm text-[#f2b8b5]">
                  {!nameValid && "Please add your name. "}
                  {!dateValid &&
                    "Please pick a date (today or later) in step 1."}
                </p>
              )}

              <p className="max-w-[52ch] text-sm leading-relaxed text-taupe">
                This opens WhatsApp with your inquiry pre-filled — nothing is
                sent until you press send there. Final price and availability
                will be confirmed on WhatsApp.
              </p>
            </>
          )}
        </div>

        {/* Step controls */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="glow-btn inline-flex min-h-12 cursor-pointer items-center rounded-full border border-porcelain/25 px-6 py-3 text-[0.95rem] font-semibold text-porcelain"
            >
              <span aria-hidden className="icing-swipe" />
              Back
            </button>
          )}
          {step < screens.length - 1 ? (
            <button
              type="button"
              onClick={() => go(step + 1)}
              className="glow-btn inline-flex min-h-12 cursor-pointer items-center rounded-full bg-caramel px-7 py-3 text-[0.95rem] font-semibold text-noir"
            >
              <span aria-hidden className="icing-swipe" />
              Continue
            </button>
          ) : (
            <a
              href={canSend ? inquiryWhatsappHref(inquiry) : undefined}
              onClick={(e) => {
                if (!canSend) {
                  e.preventDefault();
                  setTriedSend(true);
                }
              }}
              target="_blank"
              rel="noopener"
              aria-disabled={!canSend}
              className={`glow-btn inline-flex min-h-12 items-center rounded-full px-7 py-3 text-[0.95rem] font-semibold ${
                canSend
                  ? "bg-caramel text-noir"
                  : "cursor-not-allowed bg-caramel/40 text-noir/60"
              }`}
            >
              <span aria-hidden className="icing-swipe" />
              Check availability on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Live preview + running summary */}
      <Reveal className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-porcelain/12 bg-espresso/60 p-6 sm:p-8">
          <CakePreview
            shape={draft.shape ?? "Round"}
            weight={draft.weight ?? "1 kg"}
            finish={draft.finish ?? "Fresh cream"}
            colourHex={colourHex}
            inscription={draft.inscription ?? ""}
          />
          <dl className="mt-6 space-y-1.5 border-t border-porcelain/10 pt-5 text-sm">
            {[
              ["Occasion", draft.occasion],
              ["Date", draft.date],
              ["Cake", draft.style],
              ["Flavour", draft.flavor],
              ["Shape & weight", [draft.shape, draft.weight].filter(Boolean).join(" · ")],
              ["Finish", [draft.finish, draft.colourName].filter(Boolean).join(", ")],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-taupe">{k}</dt>
                  <dd className="text-right text-porcelain/85">{v}</dd>
                </div>
              ))}
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-taupe">
            Final price and availability will be confirmed on WhatsApp.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function OptionPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-porcelain/85">
        {label}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={selected}
              className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                selected
                  ? "border-caramel bg-caramel text-noir"
                  : "border-porcelain/20 text-porcelain/80 hover:border-caramel/60"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
