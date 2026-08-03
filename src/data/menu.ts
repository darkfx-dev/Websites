import { menuCategories } from "./business";

/**
 * Individual, owner-verified dish names, grouped by category slug.
 *
 * SOURCE-OF-TRUTH RULES:
 * - These are the names supplied by the business. No dish, price, description,
 *   ingredient, tag, or photo may be invented here — `MenuItem` deliberately
 *   carries no price/description/image field so none can leak into the UI.
 * - Some categories list fewer named dishes than their aggregate `count` in
 *   `business.ts` (South Indian: 24 named vs ~46 listed). That gap is shown
 *   honestly in the UI; do NOT pad it with made-up names to reach the count.
 * - Counts and availability are DYNAMIC — see `business.lastVerified`.
 */
export type MenuItem = {
  /** Stable slug id, e.g. "pav-bhaji-regular-pav-bhaji". */
  id: string;
  name: string;
  /** Matches a `slug` in `business.ts` `menuCategories`. */
  categorySlug: string;
};

const namesByCategory: Record<string, string[]> = {
  "mpb-special-combos": [
    "Chinese Combo",
    "Fast Food Combo",
    "Italian Combo",
    "Meal for Two",
    "Meal for Three",
  ],
  "pav-bhaji": [
    "Regular Pav Bhaji",
    "Jain Pav Bhaji",
    "Cheese Pav Bhaji",
    "Cheese Jain Pav Bhaji",
    "Paneer Pav Bhaji",
    "Paneer Jain Pav Bhaji",
    "Paneer Cheese Pav Bhaji",
    "Paneer Cheese Jain Pav Bhaji",
    "Fry Pav Bhaji",
    "Fry Cheese Pav Bhaji",
    "Green Pav Bhaji",
    "Green Cheese Pav Bhaji",
    "Red Pav Bhaji",
    "Yellow Pav Bhaji",
    "Khada Pav Bhaji",
    "Masala Pav",
    "Cheese Masala Pav",
    "Only Bhaji",
    "Potato Fry",
    "Kora Pav",
    "Extra Butter Pav",
  ],
  rice: [
    "Tawa Pulao",
    "Kashmiri Pulao",
    "Jeera Rice",
    "Cheese Tawa Pulao",
    "Paneer Tawa Pulao",
    "Cheese Paneer Tawa Pulao",
    "Cheese Kashmiri Pulao",
    "Paneer Kashmiri Pulao",
    "Cheese Paneer Kashmiri Pulao",
  ],
  "delightful-combos": [
    "Deadly Dosa",
    "Our Signature",
    "Chaat Combo",
    "Cheesy Combo",
    "Fancy Dosa",
    "Dosa Hi Dosa",
    "Premium Combo",
  ],
  "south-indian": [
    "Sada Dosa",
    "Masala Dosa",
    "Mysore Masala Dosa",
    "Nylon Sada Dosa",
    "Onion Sada Dosa",
    "Garlic Sada Dosa",
    "Garlic Nylon Dosa",
    "Onion Nylon Dosa",
    "Palak Dosa",
    "Palak Mysore Dosa",
    "Sweet Corn Dosa",
    "Chinese Dosa",
    "Manchurian Dosa",
    "Paneer Masala Dosa",
    "Paneer Mysore Dosa",
    "Paneer Palak Dosa",
    "Paneer Chilli Dosa",
    "Paneer Toofani Dosa",
    "Jini Roll Dosa",
    "Cheese Frankie Dosa",
    "American Chopsuey Dosa",
    "Special Dosa",
    "Dilkhush Dosa",
    "Jhanak Jhanak Payal Dosa",
  ],
  chinese: [
    "Bombay Bhel",
    "Chinese Bhel",
    "Veg Garlic Manchurian",
    "Veg Manchurian Dry",
    "Veg Manchurian Gravy",
    "Veg Schezwan Manchurian",
    "Paneer Manchurian",
    "Paneer Chilli",
    "Paneer 65",
    "Veg 65",
    "Veg Lollipop",
    "Paneer Red Cook",
    "Veg Crispy",
  ],
  "fried-rice-and-noodles": [
    "Hakka Noodles",
    "Schezwan Noodles",
    "Singapuri Noodles",
    "Manchurian Noodles",
    "Crisp and Soft Noodles",
    "American Chopsuey",
    "Chinese Chopsuey",
    "Veg Chopsuey",
    "Combination Fried Rice",
    "Manchurian Fried Rice",
    "Triple Schezwan Fried Rice",
    "Veg Fried Rice",
    "Schezwan Fried Rice",
    "Hong Kong Fried Rice",
    "Paneer Fried Rice",
    "Singapuri Fried Rice",
  ],
  soups: [
    "Hot and Sour Soup",
    "Manchow Soup",
    "Tomato Soup",
    "Veg Clear Soup",
    "Special Veg Soup",
    "Special Veg Noodles Soup",
  ],
  pizza: [
    "Margherita Pizza",
    "Chinese Corn Pizza",
    "Chinese Pizza",
    "Spicy Paneer Pizza",
    "Veggie Delight Pizza",
  ],
  sandwiches: [
    "Cheese Grilled Sandwich",
    "Veg Grill Sandwich",
    "Veg Sandwich",
    "Bread Butter",
    "Bread Butter Cheese",
    "Veg Cheese Sandwich",
    "Cheese Toast",
    "Toast",
    "Veg Cheese Toast",
    "Veg Toast",
  ],
  accompaniments: [
    "Roasted Papad",
    "Fry Papad",
    "Chutney",
    "Onion Fry",
    "Shimla Fry",
  ],
  "snacks-and-chaats": [
    "French Fries",
    "Bhel Puri",
    "Dahi Bataka",
    "Dahi Puri",
    "Masala Puri",
    "Papdi Chaat",
    "Sev Puri",
    "Chutney Puri",
    "Cheese Bhel",
    "Cheese Sev",
  ],
  "spring-potatoes": [
    "Salted Spiral Potato",
    "Salted Spiral Potato Chaat",
    "Cheese and Salted Spiral Potato",
    "Lemon Pepper Spiral Potato",
    "Salted Peri Peri Spiral Potato",
  ],
  "cold-drinks": ["Buttermilk", "Mineral Water"],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Flattened list of every named dish, with generated stable ids. */
export const menuItems: MenuItem[] = Object.entries(namesByCategory).flatMap(
  ([categorySlug, names]) =>
    names.map((name) => ({
      id: `${categorySlug}-${slugify(name)}`,
      name,
      categorySlug,
    }))
);

/** Count of individually-named dishes we can display for a category. */
export function namedCountForCategory(categorySlug: string): number {
  return menuItems.filter((item) => item.categorySlug === categorySlug).length;
}

/**
 * A category's named count differs from its aggregate `count` only where the
 * business listed more variations than it named for us (South Indian today).
 * The UI uses this to show an honest "N of ~M listed" label instead of padding.
 */
export function categoryHasUnnamedItems(categorySlug: string): boolean {
  const category = menuCategories.find((c) => c.slug === categorySlug);
  if (!category) return false;
  return namedCountForCategory(categorySlug) < category.count;
}

/** A few representative dish names for a category (for the scroll story). */
export function sampleDishNames(categorySlug: string, limit = 3): string[] {
  return menuItems
    .filter((item) => item.categorySlug === categorySlug)
    .slice(0, limit)
    .map((item) => item.name);
}
