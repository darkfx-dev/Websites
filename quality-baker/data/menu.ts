/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MENU & PRICES — EDIT HERE
 *
 *  This one file drives the entire "Menu" section of the site.
 *  To change a price, a name, or add/remove an item, edit the arrays below
 *  and save — nothing else needs to change anywhere in the code.
 *
 *  ⚠ All prices below are ILLUSTRATIVE placeholders. Swap in the shop's real
 *  price list before going live (should take under 5 minutes).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type MenuItem = {
  name: string;
  /** Shown right-aligned after the dotted leader, e.g. "from ₹450" */
  price: string;
  /** Optional one-line description under the item name */
  note?: string;
  /** Renders a small "eggless" tag next to the name */
  eggless?: boolean;
};

export type MenuCategory = {
  title: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    title: "Birthday Cakes",
    items: [
      {
        name: "Classic Vanilla / Chocolate",
        price: "from ₹450",
        note: "Half kg, fresh cream, message piped free",
        eggless: true,
      },
      {
        name: "Butterscotch Crunch",
        price: "from ₹500",
        note: "Caramelised praline, our most-ordered flavour",
        eggless: true,
      },
      {
        name: "Fresh Fruit Gateau",
        price: "from ₹600",
        note: "Seasonal fruit, light chantilly cream",
      },
    ],
  },
  {
    title: "Custom Design Cakes",
    items: [
      {
        name: "Theme & Photo Cakes",
        price: "from ₹900",
        note: "Cartoons, portraits, hobbies — bring us any idea",
        eggless: true,
      },
      {
        name: "Tiered Celebration Cakes",
        price: "from ₹1,800",
        note: "Weddings, anniversaries, engagements. 48-hr notice",
      },
      {
        name: "Fondant Sculpted Cakes",
        price: "quoted per design",
        note: "Sketch approved with you before we bake",
      },
    ],
  },
  {
    title: "Pastries & Small Bakes",
    items: [
      {
        name: "Pastry Slices",
        price: "₹90 each",
        note: "Chocolate truffle, pineapple, butterscotch",
        eggless: true,
      },
      {
        name: "Cupcakes",
        price: "₹80 each",
        note: "Boxes of 6 with mixed toppings",
        eggless: true,
      },
      {
        name: "Brownies & Blondies",
        price: "₹110 each",
        note: "Dense, fudgy, best slightly warmed",
      },
    ],
  },
];
