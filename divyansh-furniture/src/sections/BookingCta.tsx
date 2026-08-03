"use client";

import { useState } from "react";
import { business } from "@/data/site";
import { BookButton } from "@/components/ui/BookButton";
import { Corner } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { bookingEnabled } from "@/lib/whatsapp";

const ROOMS = [
  "Living room",
  "Bedroom",
  "Dining",
  "Kitchen",
  "Whole home",
  "Something else",
] as const;

/**
 * Booking.
 *
 * Deliberately not a form that posts anywhere. A form needs a server route
 * or a third-party endpoint, and either one needs validation, rate limiting
 * and spam handling to be responsible — for a business whose enquiries
 * already arrive on WhatsApp, that is a lot of machinery to end up in the
 * same inbox.
 *
 * Instead the visitor picks a room and optionally types a line, and both are
 * composed into the opening WhatsApp message. Nothing is stored, nothing is
 * sent anywhere but WhatsApp, and the whole thing is one tap on a phone.
 */
export function BookingCta() {
  const [room, setRoom] = useState<string>(ROOMS[0]);
  const [note, setNote] = useState("");

  const message =
    `Hi ${business.name}, I would like to book a consultation.\n` +
    `Room: ${room}` +
    (note.trim() ? `\nDetails: ${note.trim()}` : "");

  return (
    <section id="booking" className="section-y relative" aria-labelledby="booking-title">
      <div className="page">
        <Reveal>
          <div className="card relative overflow-hidden p-8 sm:p-12 lg:p-16">
            <Corner position="tl" className="m-5" />
            <Corner position="br" className="m-5" />

            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div>
                <p className="label">Book</p>
                <h2 id="booking-title" className="mt-5 text-h2">
                  Tell us the room.
                  <br />
                  <span className="italic text-brass">We&rsquo;ll take it from there.</span>
                </h2>
                <p className="mt-6 max-w-prose text-lead leading-relaxed text-silk-dim">
                  Pick a room and add anything you already know — a size, a
                  wood, a budget. It goes straight into a WhatsApp message so
                  you are not filling in a form and waiting.
                </p>
              </div>

              <div>
                <fieldset>
                  <legend className="label">Which room?</legend>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {ROOMS.map((option) => {
                      const selected = room === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setRoom(option)}
                          aria-pressed={selected}
                          className={
                            "min-h-[44px] rounded-full border px-4 text-sm transition-colors duration-200 " +
                            (selected
                              ? "border-brass bg-brass-wash text-silk"
                              : "border-hairline-strong text-silk-dim hover:border-brass-line hover:text-silk")
                          }
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8">
                  <label htmlFor="booking-note" className="label">
                    Anything else? <span className="text-silk-faint">(optional)</span>
                  </label>
                  <textarea
                    id="booking-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    maxLength={400}
                    placeholder="e.g. 6-seater dining table, teak, around 5 feet"
                    className="mt-3 w-full rounded border border-hairline-strong bg-[#1b1512] px-4 py-3 text-sm text-silk placeholder:text-silk-faint focus:border-brass-line"
                  />
                  <p className="mt-2 text-label text-silk-faint">
                    This is put into the message — nothing is stored on this
                    site.
                  </p>
                </div>

                <div className="mt-7">
                  <BookButton message={message} variant="primary" fullWidth>
                    Send on WhatsApp
                  </BookButton>
                </div>

                {!bookingEnabled ? (
                  <p
                    role="status"
                    className="mt-4 rounded border border-dashed border-brass-line bg-brass-wash px-4 py-3 text-sm text-silk-dim"
                  >
                    Booking is switched off because no WhatsApp number has been
                    set. Add one to{" "}
                    <code className="text-silk">src/data/site.ts</code> and
                    every button on the site starts working.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
