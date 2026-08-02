import { describe, expect, it } from "vitest";

import { outlet } from "@/data/outlet";
import { categoryInquiryMessage, directionsHref, encodeMessage, telHref, whatsappHref } from "@/lib/links";

/** The exact approved strings from the outlet brief. */
const APPROVED_WHATSAPP_URL =
  "https://wa.me/919924666000?text=Hello%20Surat%20Khaman%20House%2C%20I%20would%20like%20to%20inquire%20about%20today%27s%20menu%20and%20availability.";
const APPROVED_PLACE_ID = "ChIJtYD54X9O4DsRir0umBF6TOQ";

describe("contact links", () => {
  it("builds the approved WhatsApp URL byte for byte", () => {
    expect(whatsappHref()).toBe(APPROVED_WHATSAPP_URL);
  });

  it("percent-encodes the apostrophe that encodeURIComponent leaves alone", () => {
    expect(encodeURIComponent("today's")).toContain("'");
    expect(encodeMessage("today's")).toBe("today%27s");
  });

  it("uses the public business number for tel:", () => {
    expect(telHref).toBe("tel:+919924666000");
  });

  it("pins directions to the exact Google Place ID", () => {
    expect(directionsHref).toContain(`query_place_id=${APPROVED_PLACE_ID}`);
    expect(directionsHref).toBe(outlet.map.directionsUrl);
  });

  it("keeps category inquiries addressed to this outlet and still encodes correctly", () => {
    const href = whatsappHref(categoryInquiryMessage("Locho"));
    expect(href.startsWith("https://wa.me/919924666000?text=")).toBe(true);
    expect(decodeURIComponent(href.split("text=")[1])).toBe(
      "Hello Surat Khaman House, I would like to inquire about today's Locho availability and price.",
    );
  });

  it("never attaches tracking parameters to phone or WhatsApp links", () => {
    expect(telHref).not.toMatch(/[?&](utm_|gclid|fbclid)/);
    expect(whatsappHref()).not.toMatch(/[?&](utm_|gclid|fbclid)/);
  });
});
