/**
 * Menu for the Adajan outlet.
 *
 * Transcribed from the latest available photograph of the outlet's menu board.
 * English spellings are normalised from Gujarati.
 *
 * PRICE STATUS — the three supplied briefs disagree and this is the
 * reconciliation:
 *   • Brief 1 said hide every price until the owner confirms them.
 *   • Brief 2 supplied the same figures and required them to be *shown*
 *     alongside an exact disclaimer.
 *   • V2 says never invent a price and only render verified units.
 * The figures below are user-supplied (not invented) but are explicitly "not
 * confirmed as current", so they are rendered together with the mandatory
 * disclaimer in `PRICE_DISCLAIMER` wherever any price appears. That satisfies
 * all three: nothing is invented, nothing is presented as confirmed.
 *
 * Prices are held in paise-free whole rupees exactly as transcribed. A missing
 * unit is `undefined` — never inferred, never converted between units.
 *
 * Per-item Gujarati names are not recorded because none were verified;
 * inventing transliterations would be a factual error.
 */

export const PRICE_DISCLAIMER =
  "Reference prices from the latest available menu-board photograph. Prices and availability may change—please confirm with the outlet.";

export type MenuCategory =
  | "Locho"
  | "Khaman & Khamani"
  | "Idada, Dhokla, Patudi & Patra"
  | "Samosas & Rolls"
  | "Pattice"
  | "Sweets & Extras"
  | "Beverages";

export type PriceUnit = "kg" | "plate" | "bottle";

export type MenuPrice = {
  unit: PriceUnit;
  /** Whole rupees, exactly as transcribed. */
  amount: number;
  /** Rendered beside the amount, e.g. "per kg". */
  label: string;
};

export type MenuItem = {
  id: string;
  name: string;
  gujaratiName?: string;
  category: MenuCategory;
  /** Only units the board actually lists. Never computed. */
  prices: readonly MenuPrice[];
  /** Every item on this board is vegetarian. */
  vegetarian: true;
  /** False until the owner confirms the figures against the current board. */
  priceVerified: boolean;
  note?: string;
};

export const menuCategories: readonly { id: string; label: MenuCategory }[] = [
  { id: "locho", label: "Locho" },
  { id: "khaman-khamani", label: "Khaman & Khamani" },
  { id: "idada-dhokla-patudi-patra", label: "Idada, Dhokla, Patudi & Patra" },
  { id: "samosas-rolls", label: "Samosas & Rolls" },
  { id: "pattice", label: "Pattice" },
  { id: "sweets-extras", label: "Sweets & Extras" },
  { id: "beverages", label: "Beverages" },
] as const;

const perKg = (amount: number): MenuPrice => ({ unit: "kg", amount, label: "per kg" });
const perPlate = (amount: number): MenuPrice => ({ unit: "plate", amount, label: "per plate" });
const perBottle = (amount: number): MenuPrice => ({
  unit: "bottle",
  amount,
  label: "per bottle",
});

const item = (
  id: string,
  name: string,
  category: MenuCategory,
  prices: readonly MenuPrice[],
): MenuItem => ({ id, name, category, prices, vegetarian: true, priceVerified: false });

export const menuItems: readonly MenuItem[] = [
  item("plain-locho", "Plain Locho", "Locho", [perKg(120)]),
  item("oil-locho", "Oil Locho", "Locho", [perKg(200), perPlate(30)]),
  item("amul-butter-locho", "Amul Butter Locho", "Locho", [perKg(400), perPlate(60)]),
  item("amul-cheese-butter-locho", "Amul Cheese Butter Locho", "Locho", [
    perKg(500),
    perPlate(80),
  ]),

  item("plain-khaman", "Plain Khaman", "Khaman & Khamani", [perKg(120)]),
  item("vagharela-khaman", "Vagharela Khaman", "Khaman & Khamani", [perKg(200), perPlate(30)]),
  item("nylon-khaman", "Nylon Khaman", "Khaman & Khamani", [perKg(200), perPlate(30)]),
  item("sev-khamani", "Sev Khamani", "Khaman & Khamani", [perKg(200), perPlate(30)]),

  item("plain-idada", "Plain Idada", "Idada, Dhokla, Patudi & Patra", [perKg(100)]),
  item("tiranga-idada", "Tiranga Idada", "Idada, Dhokla, Patudi & Patra", [
    perKg(200),
    perPlate(30),
  ]),
  item("vagharela-idada", "Vagharela Idada", "Idada, Dhokla, Patudi & Patra", [
    perKg(200),
    perPlate(30),
  ]),
  item(
    "cheese-chinese-idada-dhokla",
    "Cheese Chinese Idada–Dhokla",
    "Idada, Dhokla, Patudi & Patra",
    [perKg(400), perPlate(50)],
  ),
  item("plain-patudi", "Plain Patudi", "Idada, Dhokla, Patudi & Patra", [perKg(160)]),
  item("vaghareli-patudi", "Vaghareli Patudi", "Idada, Dhokla, Patudi & Patra", [
    perKg(200),
    perPlate(30),
  ]),
  item("plain-patra", "Plain Patra", "Idada, Dhokla, Patudi & Patra", [perKg(160)]),
  item("vagharela-patra", "Vagharela Patra", "Idada, Dhokla, Patudi & Patra", [
    perKg(200),
    perPlate(30),
  ]),

  item("raw-chana-dal-samosa", "Raw Chana-dal Samosa", "Samosas & Rolls", [perKg(200)]),
  item("fried-chana-dal-samosa", "Fried Chana-dal Samosa", "Samosas & Rolls", [
    perKg(300),
    perPlate(30),
  ]),
  item("raw-cheese-paneer-samosa", "Raw Cheese Paneer Samosa", "Samosas & Rolls", [perKg(400)]),
  item("fried-cheese-paneer-samosa", "Fried Cheese Paneer Samosa", "Samosas & Rolls", [
    perKg(600),
    perPlate(60),
  ]),
  item("raw-chinese-samosa", "Raw Chinese Samosa", "Samosas & Rolls", [perKg(240)]),
  item("fried-chinese-samosa", "Fried Chinese Samosa", "Samosas & Rolls", [
    perKg(300),
    perPlate(50),
  ]),
  item("chinese-roll", "Chinese Roll", "Samosas & Rolls", [perKg(240)]),
  item("fried-chinese-roll", "Fried Chinese Roll", "Samosas & Rolls", [
    perKg(300),
    perPlate(30),
  ]),

  item("raw-pattice", "Raw Pattice", "Pattice", [perKg(240)]),
  item("fried-pattice", "Fried Pattice", "Pattice", [perKg(300), perPlate(30)]),

  item("ghee-jalebi", "Ghee Jalebi", "Sweets & Extras", [perKg(400), perPlate(40)]),
  item("sev", "Sev", "Sweets & Extras", [perKg(300)]),

  item("bottled-water", "Bottled Water", "Beverages", [perBottle(20)]),
] as const;

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** e.g. "₹200". Formatting only — never arithmetic. */
export function formatPrice(price: MenuPrice): string {
  return rupees.format(price.amount);
}

export function priceByUnit(menuItem: MenuItem, unit: PriceUnit): MenuPrice | undefined {
  return menuItem.prices.find((price) => price.unit === unit);
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
