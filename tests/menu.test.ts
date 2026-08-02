import { describe, expect, it } from "vitest";

import { filterMenu, menuCategories, menuItems, unitSummary } from "@/data/menu";
import { featureFlags } from "@/data/outlet";

describe("menu data", () => {
  it("carries exactly the 29 items transcribed from the board", () => {
    expect(menuItems).toHaveLength(29);
    expect(new Set(menuItems.map((item) => item.id)).size).toBe(29);
  });

  it("ships no price while MENU_PRICES_VERIFIED is false", () => {
    expect(featureFlags.MENU_PRICES_VERIFIED).toBe(false);

    for (const item of menuItems) {
      expect(item.perKg).toBeUndefined();
      expect(item.perPlate).toBeUndefined();
      expect(item.priceVerified).toBe(false);
    }

    // Nothing in the serialised module may look like a price.
    expect(JSON.stringify(menuItems)).not.toMatch(/[₹]|\bRs\.?\b|\b\d{2,4}\b/);
  });

  it("marks every item vegetarian and claims nothing else about it", () => {
    for (const item of menuItems) {
      expect(item.vegetarian).toBe(true);
      // No allergen, spice, portion, Jain or availability inference.
      expect(Object.keys(item).sort()).toEqual(
        expect.arrayContaining(["category", "id", "name", "priceVerified", "units", "vegetarian"]),
      );
    }
  });

  it("assigns every item to a declared category", () => {
    const labels = new Set(menuCategories.map((category) => category.label));
    for (const item of menuItems) {
      expect(labels.has(item.category)).toBe(true);
    }
  });

  it("keeps raw and fried variants as separate, explicit entries", () => {
    const names = menuItems.map((item) => item.name);
    expect(names).toContain("Raw Chana-dal Samosa");
    expect(names).toContain("Fried Chana-dal Samosa");
    expect(names).toContain("Raw Pattice");
    expect(names).toContain("Fried Pattice");
  });

  it("describes the sale format without a number", () => {
    expect(unitSummary(menuItems.find((item) => item.id === "oil-locho")!)).toBe(
      "By weight · Per plate",
    );
    expect(unitSummary(menuItems.find((item) => item.id === "plain-locho")!)).toBe("By weight");
    expect(unitSummary(menuItems.find((item) => item.id === "bottled-water")!)).toBe("Per bottle");
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

  it("matches names case-insensitively and ignores surrounding whitespace", () => {
    expect(filterMenu(menuItems, null, "  KHAMAN ")).toHaveLength(
      filterMenu(menuItems, null, "khaman").length,
    );
    expect(filterMenu(menuItems, null, "khaman").length).toBeGreaterThan(0);
  });

  it("combines category and query", () => {
    const result = filterMenu(menuItems, "Samosa & Rolls", "cheese");
    expect(result.map((item) => item.name)).toEqual([
      "Raw Cheese Paneer Samosa",
      "Fried Cheese Paneer Samosa",
    ]);
  });

  it("returns an empty list rather than throwing on no match", () => {
    expect(filterMenu(menuItems, null, "pizza")).toEqual([]);
  });
});
