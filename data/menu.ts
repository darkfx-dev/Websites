/**
 * Menu for the Adajan Patiya outlet.
 *
 * Transcribed from an outlet-specific photographed board labelled
 * "Surat Khaman House (AP)". English spellings are normalised from Gujarati.
 *
 * PRICES ARE DELIBERATELY ABSENT FROM THIS MODULE. The board prices are an
 * online-reference snapshot, not owner-confirmed, so `MENU_PRICES_VERIFIED`
 * is false and no number may reach the browser. The reference snapshot is
 * kept for owner verification in `docs/price-reference.md`, which is an
 * editorial worksheet that no application code imports.
 *
 * Per-item Gujarati names are not recorded because none were verified;
 * inventing transliterations here would be a factual error.
 */

export type MenuCategory =
  | "Locho"
  | "Khaman & Khamani"
  | "Idada, Patudi & Patra"
  | "Samosa & Rolls"
  | "Pattice"
  | "Sweets & Extras";

/** How the board sells an item. Derived from which columns the board fills. */
export type MenuUnit = "kg" | "plate" | "bottle";

export type MenuItem = {
  id: string;
  name: string;
  gujaratiName?: string;
  category: MenuCategory;
  /** Left undefined while MENU_PRICES_VERIFIED is false. */
  perKg?: number;
  /** Left undefined while MENU_PRICES_VERIFIED is false. */
  perPlate?: number;
  unitLabel?: string;
  /** Every item on this board is vegetarian. */
  vegetarian: true;
  priceVerified: boolean;
  note?: string;
  /** Ways the item can be bought. Communicates format without a price. */
  units: readonly MenuUnit[];
};

export const menuCategories: readonly { id: string; label: MenuCategory }[] = [
  { id: "locho", label: "Locho" },
  { id: "khaman-khamani", label: "Khaman & Khamani" },
  { id: "idada-patudi-patra", label: "Idada, Patudi & Patra" },
  { id: "samosa-rolls", label: "Samosa & Rolls" },
  { id: "pattice", label: "Pattice" },
  { id: "sweets-extras", label: "Sweets & Extras" },
] as const;

const item = (
  id: string,
  name: string,
  category: MenuCategory,
  units: readonly MenuUnit[],
  unitLabel?: string,
): MenuItem => ({
  id,
  name,
  category,
  vegetarian: true,
  priceVerified: false,
  units,
  ...(unitLabel ? { unitLabel } : {}),
});

export const menuItems: readonly MenuItem[] = [
  item("plain-locho", "Plain Locho", "Locho", ["kg"]),
  item("oil-locho", "Oil Locho", "Locho", ["kg", "plate"]),
  item("amul-butter-locho", "Amul Butter Locho", "Locho", ["kg", "plate"]),
  item("amul-cheese-butter-locho", "Amul Cheese Butter Locho", "Locho", ["kg", "plate"]),

  item("plain-khaman", "Plain Khaman", "Khaman & Khamani", ["kg"]),
  item("vagharela-khaman", "Vagharela Khaman", "Khaman & Khamani", ["kg", "plate"]),
  item("nylon-khaman", "Nylon Khaman", "Khaman & Khamani", ["kg", "plate"]),
  item("sev-khamani", "Sev Khamani", "Khaman & Khamani", ["kg", "plate"]),

  item("plain-idada", "Plain Idada", "Idada, Patudi & Patra", ["kg"]),
  item("tiranga-idada", "Tiranga Idada", "Idada, Patudi & Patra", ["kg", "plate"]),
  item("vagharela-idada", "Vagharela Idada", "Idada, Patudi & Patra", ["kg", "plate"]),
  item("cheese-chinese-idada-dhokla", "Cheese Chinese Idada–Dhokla", "Idada, Patudi & Patra", [
    "kg",
    "plate",
  ]),
  item("plain-patudi", "Plain Patudi", "Idada, Patudi & Patra", ["kg"]),
  item("vaghareli-patudi", "Vaghareli Patudi", "Idada, Patudi & Patra", ["kg", "plate"]),
  item("plain-patra", "Plain Patra", "Idada, Patudi & Patra", ["kg"]),
  item("vagharela-patra", "Vagharela Patra", "Idada, Patudi & Patra", ["kg", "plate"]),

  item("raw-chana-dal-samosa", "Raw Chana-dal Samosa", "Samosa & Rolls", ["kg"]),
  item("fried-chana-dal-samosa", "Fried Chana-dal Samosa", "Samosa & Rolls", ["kg", "plate"]),
  item("raw-cheese-paneer-samosa", "Raw Cheese Paneer Samosa", "Samosa & Rolls", ["kg"]),
  item("fried-cheese-paneer-samosa", "Fried Cheese Paneer Samosa", "Samosa & Rolls", [
    "kg",
    "plate",
  ]),
  item("raw-chinese-samosa", "Raw Chinese Samosa", "Samosa & Rolls", ["kg"]),
  item("fried-chinese-samosa", "Fried Chinese Samosa", "Samosa & Rolls", ["kg", "plate"]),
  item("chinese-roll", "Chinese Roll", "Samosa & Rolls", ["kg"]),
  item("fried-chinese-roll", "Fried Chinese Roll", "Samosa & Rolls", ["kg", "plate"]),

  item("raw-pattice", "Raw Pattice", "Pattice", ["kg"]),
  item("fried-pattice", "Fried Pattice", "Pattice", ["kg", "plate"]),

  item("ghee-jalebi", "Ghee Jalebi", "Sweets & Extras", ["kg", "plate"]),
  item("sev", "Sev", "Sweets & Extras", ["kg"]),
  item("bottled-water", "Bottled Water", "Sweets & Extras", ["bottle"], "Per bottle"),
] as const;

/** Human-readable format line for a card, e.g. "By weight · Per plate". */
export function unitSummary(menuItem: MenuItem): string {
  if (menuItem.unitLabel) return menuItem.unitLabel;
  const labels: Record<MenuUnit, string> = {
    kg: "By weight",
    plate: "Per plate",
    bottle: "Per bottle",
  };
  return menuItem.units.map((unit) => labels[unit]).join(" · ");
}

/** Case-insensitive name match. Category "all" is represented by null. */
export function filterMenu(
  items: readonly MenuItem[],
  category: MenuCategory | null,
  query: string,
): readonly MenuItem[] {
  const normalised = query.trim().toLowerCase();
  return items.filter((entry) => {
    const matchesCategory = category === null || entry.category === category;
    const matchesQuery = normalised === "" || entry.name.toLowerCase().includes(normalised);
    return matchesCategory && matchesQuery;
  });
}
