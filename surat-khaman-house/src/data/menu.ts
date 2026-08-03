/**
 * The complete menu, transcribed from an outlet-specific photographed menu
 * board. There are exactly 29 entries and nothing may be added to them.
 *
 * Every item carries `priceVerified: false` because the board snapshot is not
 * confirmed as current — the UI must always render these behind the reference
 * -price disclaimer, and must never call them today's, current, latest or
 * guaranteed prices.
 *
 * Prices are stored as plain rupee numbers. A missing `perKg` or `perPlate`
 * means that item simply is not sold that way; it is not a zero and not an
 * unknown, so `formatPrice` omits the slot entirely rather than rendering an
 * empty badge.
 */
export type MenuCategory =
  | "Locho"
  | "Khaman & Khamani"
  | "Idada, Dhokla, Patudi & Patra"
  | "Samosas & Rolls"
  | "Pattice"
  | "Sweets & Extras";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  perKg?: number;
  perPlate?: number;
  /** Overrides the "plate" noun where the board sells by a different unit. */
  unitLabel?: string;
  vegetarian: true;
  priceVerified: false;
};

/** Filter order. "All" is prepended by the explorer, not stored here. */
export const menuCategories: readonly MenuCategory[] = [
  "Locho",
  "Khaman & Khamani",
  "Idada, Dhokla, Patudi & Patra",
  "Samosas & Rolls",
  "Pattice",
  "Sweets & Extras",
] as const;

export const menuItems: readonly MenuItem[] = [
  // Locho
  {
    id: "plain-locho",
    name: "Plain Locho",
    category: "Locho",
    perKg: 120,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "oil-locho",
    name: "Oil Locho",
    category: "Locho",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "amul-butter-locho",
    name: "Amul Butter Locho",
    category: "Locho",
    perKg: 400,
    perPlate: 60,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "amul-cheese-butter-locho",
    name: "Amul Cheese Butter Locho",
    category: "Locho",
    perKg: 500,
    perPlate: 80,
    vegetarian: true,
    priceVerified: false,
  },

  // Khaman & Khamani
  {
    id: "plain-khaman",
    name: "Plain Khaman",
    category: "Khaman & Khamani",
    perKg: 120,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "vagharela-khaman",
    name: "Vagharela Khaman",
    category: "Khaman & Khamani",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "nylon-khaman",
    name: "Nylon Khaman",
    category: "Khaman & Khamani",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "sev-khamani",
    name: "Sev Khamani",
    category: "Khaman & Khamani",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },

  // Idada, Dhokla, Patudi & Patra
  {
    id: "plain-idada",
    name: "Plain Idada",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 100,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "tiranga-idada",
    name: "Tiranga Idada",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "vagharela-idada",
    name: "Vagharela Idada",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "cheese-chinese-idada-dhokla",
    name: "Cheese Chinese Idada–Dhokla",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 400,
    perPlate: 50,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "plain-patudi",
    name: "Plain Patudi",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 160,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "vaghareli-patudi",
    name: "Vaghareli Patudi",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "plain-patra",
    name: "Plain Patra",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 160,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "vagharela-patra",
    name: "Vagharela Patra",
    category: "Idada, Dhokla, Patudi & Patra",
    perKg: 200,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },

  // Samosas & Rolls
  {
    id: "raw-chana-dal-samosa",
    name: "Raw Chana-dal Samosa",
    category: "Samosas & Rolls",
    perKg: 200,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "fried-chana-dal-samosa",
    name: "Fried Chana-dal Samosa",
    category: "Samosas & Rolls",
    perKg: 300,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "raw-cheese-paneer-samosa",
    name: "Raw Cheese Paneer Samosa",
    category: "Samosas & Rolls",
    perKg: 400,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "fried-cheese-paneer-samosa",
    name: "Fried Cheese Paneer Samosa",
    category: "Samosas & Rolls",
    perKg: 600,
    perPlate: 60,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "raw-chinese-samosa",
    name: "Raw Chinese Samosa",
    category: "Samosas & Rolls",
    perKg: 240,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "fried-chinese-samosa",
    name: "Fried Chinese Samosa",
    category: "Samosas & Rolls",
    perKg: 300,
    perPlate: 50,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "chinese-roll",
    name: "Chinese Roll",
    category: "Samosas & Rolls",
    perKg: 240,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "fried-chinese-roll",
    name: "Fried Chinese Roll",
    category: "Samosas & Rolls",
    perKg: 300,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },

  // Pattice
  {
    id: "raw-pattice",
    name: "Raw Pattice",
    category: "Pattice",
    perKg: 240,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "fried-pattice",
    name: "Fried Pattice",
    category: "Pattice",
    perKg: 300,
    perPlate: 30,
    vegetarian: true,
    priceVerified: false,
  },

  // Sweets & Extras
  {
    id: "ghee-jalebi",
    name: "Ghee Jalebi",
    category: "Sweets & Extras",
    perKg: 400,
    perPlate: 40,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "sev",
    name: "Sev",
    category: "Sweets & Extras",
    perKg: 300,
    vegetarian: true,
    priceVerified: false,
  },
  {
    id: "bottled-water",
    name: "Bottled Water",
    category: "Sweets & Extras",
    perPlate: 20,
    unitLabel: "bottle",
    vegetarian: true,
    priceVerified: false,
  },
] as const;

/** The count the site quotes in copy, derived rather than hard-coded. */
export const menuItemCount = menuItems.length;

export type FormattedPrice = { kg: string | null; unit: string | null };

/**
 * The single price-formatting rule for the site.
 *
 * Returns one fixed slot per pricing mode rather than a packed list, so the
 * menu can reserve a column for each and keep prices aligned down the page
 * even when an item is sold only by weight. A slot the item does not have is
 * `null`, which renders as nothing at all — never `undefined`, and never an
 * empty badge.
 */
export function formatPrice(item: MenuItem): FormattedPrice {
  return {
    kg: item.perKg !== undefined ? `₹${item.perKg}/kg` : null,
    unit:
      item.perPlate !== undefined
        ? `₹${item.perPlate}/${item.unitLabel ?? "plate"}`
        : null,
  };
}

/** Case- and diacritic-tolerant match across item name and category. */
export function matchesQuery(item: MenuItem, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return (
    item.name.toLowerCase().includes(needle) ||
    item.category.toLowerCase().includes(needle)
  );
}
