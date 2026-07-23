/* Focused correctness checks for the pure logic (acceptance criteria).
   Bundled through esbuild so TS + config imports resolve, then run on Node. */
import assert from "node:assert/strict";
import { getWeekRows, getOpenState, formatTime12 } from "../src/lib/hours.ts";
import { isValidPhone, validateEnquiry, todayISO } from "../src/lib/validation.ts";
import { buildEnquiryMessage, whatsappLink, directionsUrl } from "../src/lib/whatsapp.ts";
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

console.log(`\n${passed} logic checks passed.`);
