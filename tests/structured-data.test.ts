import { describe, expect, it } from "vitest";

import { featureFlags, approvedAssets, outlet } from "@/data/outlet";
import { restaurantJsonLd } from "@/lib/structured-data";

describe("feature flags", () => {
  it("defaults every unverified capability to off", () => {
    expect(featureFlags).toEqual({
      BUSINESS_HOURS_VERIFIED: false,
      MENU_PRICES_VERIFIED: false,
      APPROVED_PHOTOS_AVAILABLE: false,
      TESTIMONIAL_PERMISSION_AVAILABLE: false,
      ENABLE_MAP_EMBED: false,
      ENABLE_ANALYTICS: false,
    });
  });

  it("holds no photography until rights are recorded", () => {
    expect(approvedAssets).toHaveLength(0);
  });

  it("stores no review count, because published counts disagree", () => {
    expect(outlet.rating.reviewCount).toBeNull();
  });
});

describe("restaurant JSON-LD", () => {
  const node = restaurantJsonLd();

  it("describes this outlet with its verified facts", () => {
    expect(node["@type"]).toBe("Restaurant");
    expect(node.name).toBe("Surat Khaman House");
    expect(node.alternateName).toBe("સુરત ખમણ હાઉસ");
    expect(node.telephone).toBe("+919924666000");
    expect(node.hasMap).toContain("ChIJtYD54X9O4DsRir0umBF6TOQ");
    expect(node.geo).toMatchObject({ latitude: 21.19722, longitude: 72.8054 });
    expect(node.address).toMatchObject({
      "@type": "PostalAddress",
      postalCode: "395009",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    });
  });

  it.each([
    "aggregateRating",
    "review",
    "openingHours",
    "openingHoursSpecification",
    "priceRange",
    "image",
    "logo",
    "menu",
    "hasMenu",
    "founder",
    "owner",
    "paymentAccepted",
    "acceptsReservations",
    "sameAs",
    "potentialAction",
  ])("omits %s while it is unverified", (key) => {
    expect(node).not.toHaveProperty(key);
  });

  it("omits url until a real production domain is configured", () => {
    // NEXT_PUBLIC_SITE_URL is unset in this environment.
    expect(node).not.toHaveProperty("url");
  });

  it("serialises without any price or opening time", () => {
    const serialised = JSON.stringify(node);
    expect(serialised).not.toMatch(/₹|priceRange|opens|closes/i);
  });
});
