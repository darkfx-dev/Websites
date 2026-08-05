import { describe, expect, it } from "vitest";

import {
  PRICE_DISCLAIMER,
  filterMenu,
  formatPrice,
  menuCategories,
  menuItems,
  priceByUnit,
} from "@/data/menu";
import { featureFlags } from "@/data/outlet";

/** Exact counts from the supplied board, per the brief's acceptance list. */
const EXPECTED_COUNTS: Record<string, number> = {
  Locho: 4,
  "Khaman & Khamani": 4,
  "Idada, Dhokla, Patudi & Patra": 8,
  "Samosas & Rolls": 8,
  Pattice: 2,
  "Sweets & Extras": 2,
  Beverages: 1,
};

describe("menu data", () => {
  it("carries exactly the 29 transcribed items", () => {
    expect(menuItems).toHaveLength(29);
    expect(new Set(menuItems.map((item) => item.id)).size).toBe(29);
  });

  it("matches the required per-category counts", () => {
    for (const [label, count] of Object.entries(EXPECTED_COUNTS)) {
      expect(menuItems.filter((item) => item.category === label)).toHaveLength(count);
    }
    expect(Object.values(EXPECTED_COUNTS).reduce((a, b) => a + b, 0)).toBe(29);
  });

  it("declares all seven categories", () => {
    expect(menuCategories.map((entry) => entry.label)).toEqual(Object.keys(EXPECTED_COUNTS));
  });

  it("keeps prices unverified so the disclaimer stays mandatory", () => {
    expect(featureFlags.MENU_PRICES_VERIFIED).toBe(false);
    expect(menuItems.every((item) => item.priceVerified === false)).toBe(true);
    expect(PRICE_DISCLAIMER).toContain("Prices and availability may change");
  });

  it("stores only units the board actually lists, never inferred ones", () => {
    const plainLocho = menuItems.find((item) => item.id === "plain-locho")!;
    expect(plainLocho.prices.map((p) => p.unit)).toEqual(["kg"]);
    expect(priceByUnit(plainLocho, "plate")).toBeUndefined();

    const oilLocho = menuItems.find((item) => item.id === "oil-locho")!;
    expect(oilLocho.prices.map((p) => p.unit)).toEqual(["kg", "plate"]);
  });

  it("keeps bottled water as a per-bottle price and nothing else", () => {
    const water = menuItems.find((item) => item.id === "bottled-water")!;
    expect(water.category).toBe("Beverages");
    expect(water.prices).toHaveLength(1);
    expect(water.prices[0]).toMatchObject({ unit: "bottle", amount: 20, label: "per bottle" });
    expect(priceByUnit(water, "kg")).toBeUndefined();
  });

  it("preserves the exact transcribed amounts", () => {
    const expected: Record<string, { kg?: number; plate?: number }> = {
      "plain-locho": { kg: 120 },
      "amul-cheese-butter-locho": { kg: 500, plate: 80 },
      "plain-idada": { kg: 100 },
      "fried-cheese-paneer-samosa": { kg: 600, plate: 60 },
      "cheese-chinese-idada-dhokla": { kg: 400, plate: 50 },
      "ghee-jalebi": { kg: 400, plate: 40 },
      sev: { kg: 300 },
    };

    for (const [id, amounts] of Object.entries(expected)) {
      const item = menuItems.find((entry) => entry.id === id)!;
      expect(priceByUnit(item, "kg")?.amount).toBe(amounts.kg);
      expect(priceByUnit(item, "plate")?.amount).toBe(amounts.plate);
    }
  });

  it("formats rupees with en-IN and no stray decimals", () => {
    expect(formatPrice({ unit: "kg", amount: 120, label: "per kg" })).toBe("₹120");
    expect(formatPrice({ unit: "plate", amount: 30, label: "per plate" })).toBe("₹30");
  });

  it("marks every item vegetarian and claims nothing else", () => {
    for (const item of menuItems) {
      expect(item.vegetarian).toBe(true);
      expect(item).not.toHaveProperty("allergens");
      expect(item).not.toHaveProperty("jain");
      expect(item).not.toHaveProperty("available");
    }
  });

  it("keeps raw and fried variants as separate, explicit entries", () => {
    const names = menuItems.map((item) => item.name);
    for (const required of [
      "Raw Chana-dal Samosa",
      "Fried Chana-dal Samosa",
      "Raw Pattice",
      "Fried Pattice",
    ]) {
      expect(names).toContain(required);
    }
  });
});

describe("filterMenu", () => {
  it("returns everything with no category and no query", () => {
    expect(filterMenu(menuItems, null, "")).toHaveLength(29);
  });

  it("filters by category", () => {
    const result = filterMenu(menuItems, "Locho", "");
    expect(result).toHaveLength(4);
    expect(result.every((item) => item.category === "Locho")).toBe(true);
  });

  it("matches names case-insensitively and trims the query", () => {
    expect(filterMenu(menuItems, null, "  KHAMAN ").length).toBe(
      filterMenu(menuItems, null, "khaman").length,
    );
    expect(filterMenu(menuItems, null, "khaman").length).toBeGreaterThan(0);
  });

  it("combines category and query", () => {
    const result = filterMenu(menuItems, "Samosas & Rolls", "cheese");
    expect(result.map((item) => item.name)).toEqual([
      "Raw Cheese Paneer Samosa",
      "Fried Cheese Paneer Samosa",
    ]);
  });

  it("returns an empty list rather than throwing on no match", () => {
    expect(filterMenu(menuItems, null, "pizza")).toEqual([]);
  });
});
