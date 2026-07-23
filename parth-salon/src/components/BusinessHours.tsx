import { m } from "framer-motion";
import { Phone } from "lucide-react";
import { business } from "../config/business";
import { getOpenState, getWeekRows, statusLabel } from "../lib/hours";
import { staggerParent, staggerChild, sectionReveal, viewportOnce } from "../motion/variants";
import { AccessibleButton } from "./AccessibleButton";
import { ChatGlyph } from "./Icons";

/* Editorial two-column layout: live status + contact on one side, the weekly
   schedule on the other. Status and current-day highlight are computed from
   the config in Asia/Kolkata — never hard-coded. */
export function BusinessHours() {
  const open = getOpenState();
  const rows = getWeekRows();

  return (
    <section id="hours" className="bg-ivory">
      <div className="container-page grid gap-10 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:py-28">
        {/* Status + intro + actions */}
        <m.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="eyebrow text-forest-rich">Plan your visit</p>
          <h2 className="mt-4 text-forest" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Regular weekly hours
          </h2>
          <p className="mt-5 max-w-[36ch] text-[1.02rem] text-muted-ink">
            View the regular weekly hours. Public-holiday timings may vary, so
            contact the salon if you need confirmation.
          </p>

          <div
            className="mt-7 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[0.92rem] font-semibold"
            style={{
              borderColor: open.isOpen ? "var(--color-forest-rich)" : "var(--color-silver)",
              color: open.isOpen ? "var(--color-forest-rich)" : "var(--color-muted-ink)",
            }}
          >
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                open.isOpen ? "bg-forest-rich" : "bg-silver"
              }`}
              aria-hidden="true"
            />
            {statusLabel()}
          </div>

          <p className="mt-6 max-w-[38ch] text-[0.85rem] text-muted-ink">
            {business.holidayHoursNotice}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AccessibleButton variant="whatsapp" href={business.whatsappUrl} external>
              <ChatGlyph />
              WhatsApp
            </AccessibleButton>
            <AccessibleButton
              variant="call"
              href={business.telephoneUrl}
              ariaLabel={`Call Parth Salon at ${business.phoneDisplay}`}
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call the salon
            </AccessibleButton>
          </div>
        </m.div>

        {/* Weekly schedule */}
        <m.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Parth Salon weekly opening hours, timezone India Standard Time
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Hours</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <m.tr
                  key={r.key}
                  variants={staggerChild}
                  className={`border-b border-silver-line ${
                    r.isToday ? "bg-white" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className={`py-3.5 pl-3 pr-2 font-body text-[0.98rem] font-medium ${
                      r.isToday
                        ? "border-l-2 border-forest-rich text-forest"
                        : "border-l-2 border-transparent text-graphite"
                    }`}
                  >
                    {r.label}
                    {r.isToday && (
                      <span className="ml-2 align-middle text-[0.7rem] font-semibold uppercase tracking-wider text-forest-rich">
                        Today
                      </span>
                    )}
                  </th>
                  <td
                    className={`py-3.5 pr-3 text-right font-body text-[0.95rem] tabular-nums ${
                      r.isToday ? "text-forest" : "text-muted-ink"
                    }`}
                  >
                    {r.closes ? `${r.opens} – ${r.closes}` : r.opens}
                  </td>
                </m.tr>
              ))}
            </tbody>
          </table>
        </m.div>
      </div>
    </section>
  );
}
