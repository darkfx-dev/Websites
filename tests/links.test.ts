import { describe, expect, it } from "vitest";

import { featureFlags, outlet } from "@/data/outlet";
import { directionsHref, telHref } from "@/lib/links";

const APPROVED_PLACE_ID = "ChIJtYD54X9O4DsRir0umBF6TOQ";

describe("contact links", () => {
  it("uses the public business number for tel:", () => {
    expect(telHref).toBe("tel:+919924666000");
    expect(telHref).toBe(`tel:${outlet.contact.phoneE164}`);
  });

  it("pins directions to the exact Google Place ID", () => {
    expect(directionsHref).toContain(`query_place_id=${APPROVED_PLACE_ID}`);
    expect(directionsHref).toBe(outlet.map.directionsUrl);
  });

  it("never attaches tracking parameters to the phone or maps links", () => {
    expect(telHref).not.toMatch(/[?&](utm_|gclid|fbclid)/);
    expect(directionsHref).not.toMatch(/[?&](utm_|gclid|fbclid)/);
  });

  it("publishes no WhatsApp channel while the capability is unverified", async () => {
    expect(featureFlags.WHATSAPP_VERIFIED).toBe(false);

    // The helper itself is gone, so a WhatsApp link cannot be built by accident.
    const links = (await import("@/lib/links")) as Record<string, unknown>;
    expect(links).not.toHaveProperty("whatsappHref");
    expect(JSON.stringify(links)).not.toMatch(/wa\.me/);
  });
});
