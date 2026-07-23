/* Focused correctness checks for the pure logic (acceptance criteria).
   Bundled through esbuild so TS + config imports resolve, then run on Node. */
import assert from "node:assert/strict";
import {
  getWeekRows,
  getOpenState,
  formatTime12,
  statusLabel,
  checkTimeWithinHours,
} from "../src/lib/hours.ts";
import {
  isValidPhone,
  validateEnquiry,
  validateConsultation,
  STEP_FIELDS,
  todayISO,
  ENQUIRY_TYPES,
} from "../src/lib/validation.ts";
import {
  buildEnquiryMessage,
  buildConsultationMessage,
  whatsappLink,
  directionsUrl,
} from "../src/lib/whatsapp.ts";
import {
  publishedServices,
  hasPublishedServices,
  findPublishedService,
  serviceCatalogue,
  serviceCategories,
} from "../src/content/services.ts";
import { business } from "../src/config/business.ts";

let passed = 0;
const check = (name, fn) => {
  fn();
  passed++;
  console.log("  ✓", name);
};

// --- Hours schedule matches the supplied source of truth ---
const rows = getWeekRows(new Date("2026-01-05T12:00:00Z")); // arbitrary
const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
check("Monday hours are 9:30 AM – 9:30 PM", () => {
  assert.equal(byLabel.Monday.opens, "9:30 AM");
  assert.equal(byLabel.Monday.closes, "9:30 PM");
});
check("Tuesday–Sunday close at 10:30 PM, open 9:30 AM", () => {
  for (const d of ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
    assert.equal(byLabel[d].opens, "9:30 AM", `${d} opens`);
    assert.equal(byLabel[d].closes, "10:30 PM", `${d} closes`);
  }
});
check("Exactly one day is marked Today", () => {
  assert.equal(rows.filter((r) => r.isToday).length, 1);
});
check("formatTime12 converts 24h correctly", () => {
  assert.equal(formatTime12("09:30"), "9:30 AM");
  assert.equal(formatTime12("22:30"), "10:30 PM");
  assert.equal(formatTime12("00:00"), "12:00 AM");
});

// --- Open/closed computed from schedule (probe known IST instants) ---
check("Open at a weekday mid-afternoon (IST)", () => {
  // 2026-01-06 is a Tuesday; 10:00 UTC = 15:30 IST → open
  assert.equal(getOpenState(new Date("2026-01-06T10:00:00Z")).isOpen, true);
});
check("Closed before opening (IST early morning)", () => {
  // 2026-01-06 02:00 UTC = 07:30 IST → before 9:30 open
  const s = getOpenState(new Date("2026-01-06T02:00:00Z"));
  assert.equal(s.isOpen, false);
  assert.match(s.detail, /Opens 9:30 AM/);
});
check("Closed late night after Monday close (IST)", () => {
  // Monday closes 21:30 IST. 2026-01-05 16:30 UTC = 22:00 IST Monday → closed
  assert.equal(getOpenState(new Date("2026-01-05T16:30:00Z")).isOpen, false);
});

// --- Phone validation ---
check("Accepts valid international numbers", () => {
  assert.ok(isValidPhone("+91 98983 78275"));
  assert.ok(isValidPhone("9898378275"));
  assert.ok(isValidPhone("+1 (555) 123-4567"));
});
check("Rejects too-short / letters", () => {
  assert.ok(!isValidPhone("12345"));
  assert.ok(!isValidPhone("call me"));
  assert.ok(!isValidPhone(""));
});

// --- Enquiry validation ---
check("Requires name, phone, inquiry type", () => {
  const e = validateEnquiry({ name: "", phone: "", inquiryType: "", date: "", time: "", message: "" });
  assert.ok(e.name && e.phone && e.inquiryType);
});
check("Rejects a past date", () => {
  const e = validateEnquiry({
    name: "A", phone: "9898378275", inquiryType: "General question",
    date: "2000-01-01", time: "", message: "",
  });
  assert.ok(e.date);
});
check("Accepts today's date", () => {
  const e = validateEnquiry({
    name: "A", phone: "9898378275", inquiryType: "General question",
    date: todayISO(), time: "", message: "",
  });
  assert.equal(e.date, undefined);
});

// --- WhatsApp message + links ---
check("Enquiry message includes all fields and is URL-encoded", () => {
  const msg = buildEnquiryMessage({
    name: "Riya", phone: "9898378275", inquiryType: "Appointment inquiry",
    date: "2026-02-01", time: "18:00", message: "Hi",
  });
  assert.match(msg, /Name: Riya/);
  assert.match(msg, /Preferred date: 2026-02-01/);
  const url = whatsappLink(msg);
  assert.ok(url.startsWith("https://wa.me/919898378275?text="));
  assert.ok(!url.includes("\n")); // newlines must be encoded
  assert.ok(url.includes("%0A"));
});
check("WhatsApp number has no + or leading zero", () => {
  assert.equal(business.phoneInternational, "919898378275");
  assert.ok(!business.phoneInternational.startsWith("0"));
  assert.ok(!business.phoneInternational.includes("+"));
});
check("Telephone URL uses international prefix", () => {
  assert.equal(business.telephoneUrl, "tel:+919898378275");
});
check("Directions falls back to encoded address search (no API key)", () => {
  const u = directionsUrl();
  assert.ok(u.includes("google.com/maps/search/"));
  assert.ok(u.includes(encodeURIComponent("Katargam")));
});

/* ======================================================================
   Part 2 — statusLabel, hours-intelligence, consultation builder, services
   ====================================================================== */

// --- Richer open-now status label ---
check("statusLabel reads 'Open now · Closes at …' when open", () => {
  // 2026-01-06 (Tue) 10:00 UTC = 15:30 IST → open, closes 22:30
  const l = statusLabel(new Date("2026-01-06T10:00:00Z"));
  assert.match(l, /^Open now · Closes at 10:30 PM$/);
});
check("statusLabel reads 'Closed · Opens today at …' before opening", () => {
  // 2026-01-06 02:00 UTC = 07:30 IST Tuesday → before 9:30 open
  const l = statusLabel(new Date("2026-01-06T02:00:00Z"));
  assert.match(l, /^Closed · Opens today at 9:30 AM$/);
});
check("statusLabel reads 'Closed · Opens tomorrow at …' after close", () => {
  // Monday closes 21:30 IST. 2026-01-05 16:30 UTC = 22:00 IST Monday → closed,
  // next opening is Tuesday 9:30 AM (tomorrow).
  const l = statusLabel(new Date("2026-01-05T16:30:00Z"));
  assert.match(l, /^Closed · Opens tomorrow at 9:30 AM$/);
});

// --- Opening-hours boundaries are half-open [opens, closes) ---
check("Exactly at opening minute counts as open", () => {
  // 2026-01-06 04:00 UTC = 09:30 IST Tuesday → open
  assert.equal(getOpenState(new Date("2026-01-06T04:00:00Z")).isOpen, true);
});
check("Exactly at closing minute counts as closed", () => {
  // Tuesday closes 22:30 IST = 17:00 UTC → closed
  assert.equal(getOpenState(new Date("2026-01-06T17:00:00Z")).isOpen, false);
});

// --- checkTimeWithinHours (non-blocking enquiry-time hint) ---
check("checkTimeWithinHours returns null when a field is missing", () => {
  assert.equal(checkTimeWithinHours("", "10:00"), null);
  assert.equal(checkTimeWithinHours("2026-02-03", ""), null);
});
check("A time inside that weekday's hours is within", () => {
  // 2026-02-03 is a Tuesday (open 9:30–22:30)
  const r = checkTimeWithinHours("2026-02-03", "11:00");
  assert.equal(r.within, true);
  assert.equal(r.dayLabel, "Tuesday");
  assert.equal(r.opens, "9:30 AM");
  assert.equal(r.closes, "10:30 PM");
});
check("A time before opening is flagged (not within)", () => {
  const r = checkTimeWithinHours("2026-02-03", "08:00");
  assert.equal(r.within, false);
});
check("Monday after 21:30 is flagged (Monday closes earlier)", () => {
  // 2026-02-02 is a Monday (open 9:30–21:30)
  const r = checkTimeWithinHours("2026-02-02", "22:00");
  assert.equal(r.dayLabel, "Monday");
  assert.equal(r.within, false);
});

// --- Consultation validation ---
const goodConsult = {
  enquiryType: ENQUIRY_TYPES[0],
  serviceCategory: "",
  service: "",
  date: "",
  timeMode: "daypart",
  time: "",
  daypart: "Morning",
  hairLength: "",
  notes: "",
  name: "Riya",
  phone: "9898378275",
  replyPref: "WhatsApp",
  confirm: true,
};
check("A complete consultation passes validation", () => {
  assert.deepEqual(validateConsultation(goodConsult), {});
});
check("Missing enquiry type, name, phone and confirm all error", () => {
  const e = validateConsultation({
    ...goodConsult, enquiryType: "", name: "", phone: "", confirm: false,
  });
  assert.ok(e.enquiryType && e.name && e.phone && e.confirm);
});
check("A service id not in the enabled list is rejected", () => {
  const e = validateConsultation({ ...goodConsult, service: "haircuts" }, []);
  assert.ok(e.service);
});
check("An enabled service id is accepted; 'help-me-choose' always allowed", () => {
  assert.equal(validateConsultation({ ...goodConsult, service: "haircuts" }, ["haircuts"]).service, undefined);
  assert.equal(validateConsultation({ ...goodConsult, service: "help-me-choose" }).service, undefined);
});
check("A past preferred date is rejected", () => {
  assert.ok(validateConsultation({ ...goodConsult, date: "2000-01-01" }).date);
});
check("Notes over 500 chars are rejected", () => {
  assert.ok(validateConsultation({ ...goodConsult, notes: "x".repeat(501) }).notes);
});
check("STEP_FIELDS cover the 3 steps without overlap", () => {
  const all = [...STEP_FIELDS[1], ...STEP_FIELDS[2], ...STEP_FIELDS[3]];
  assert.equal(new Set(all).size, all.length);
  assert.ok(STEP_FIELDS[1].includes("enquiryType"));
  assert.ok(STEP_FIELDS[3].includes("confirm"));
});

// --- Consultation WhatsApp message ---
check("Consultation message uses safe defaults for blank optional fields", () => {
  const msg = buildConsultationMessage({
    enquiryType: "Service consultation", serviceCategory: "", service: "",
    date: "", preferredTime: "", hairLength: "", replyPref: "WhatsApp",
    name: "Riya", phone: "9898378275", notes: "",
  });
  assert.match(msg, /Service category: Not sure/);
  assert.match(msg, /Service: Help me choose/);
  assert.match(msg, /Preferred date: Not specified/);
  assert.match(msg, /Preferred time: Flexible/);
  assert.match(msg, /Hair length: Not applicable/);
  assert.match(msg, /Details: None/);
  // Never claims a confirmed booking.
  assert.match(msg, /does not confirm an appointment/);
});
check("Consultation message keeps supplied values and encodes once", () => {
  const msg = buildConsultationMessage({
    enquiryType: "Appointment availability", serviceCategory: "Hair care",
    service: "Haircuts", date: "2026-02-03", preferredTime: "6:00 PM",
    hairLength: "Medium", replyPref: "Phone", name: "Riya",
    phone: "9898378275", notes: "First visit",
  });
  assert.match(msg, /Service: Haircuts/);
  assert.match(msg, /Preferred time: 6:00 PM/);
  assert.match(msg, /Preferred reply: Phone/);
  const url = whatsappLink(msg);
  assert.ok(url.startsWith("https://wa.me/919898378275?text="));
  assert.ok(!url.includes("\n") && url.includes("%0A"));
});

// --- Service catalogue publication gate ---
check("No services are published until the owner approves publication", () => {
  assert.equal(business.servicesPublicationApproved, false);
  assert.equal(hasPublishedServices(), false);
  assert.deepEqual(publishedServices(), []);
  assert.equal(findPublishedService("haircuts"), null);
});
check("Every catalogue item is unconfirmed with no invented price/duration", () => {
  for (const s of serviceCatalogue) {
    assert.equal(s.enabled, false, `${s.id} enabled`);
    assert.equal(s.verificationStatus, "client-supplied", `${s.id} status`);
    assert.equal(s.priceDisplay, null, `${s.id} price`);
    assert.equal(s.durationDisplay, null, `${s.id} duration`);
  }
});
check("Every catalogue item maps to a known category", () => {
  const ids = new Set(serviceCategories.map((c) => c.id));
  for (const s of serviceCatalogue) assert.ok(ids.has(s.categoryId), `${s.id} category`);
});

console.log(`\n${passed} logic checks passed.`);
