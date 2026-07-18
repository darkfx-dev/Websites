/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PRODUCT CATALOG & PRICES — EDIT HERE
 *
 *  This one file drives the entire ordering section. To change a price, a
 *  name, a flavour list, or add/remove a product, edit the array below and
 *  save — nothing else in the code needs to change.
 *
 *  ⚠ All prices are ILLUSTRATIVE placeholders until the shop confirms its
 *  real price list (swapping them in takes under 5 minutes).
 *
 *  `art` picks the tile illustration (see components/PastryArt.tsx) — when
 *  real photos arrive, add an `image` path per product and swap the tile art
 *  for a next/image in components/sections/OrderSection.tsx.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { PastryVariant } from "@/components/PastryArt";

export type Product = {
  id: string;
  name: string;
  category:
    | "Birthday Cakes"
    | "Custom Design Cakes"
    | "Pastries & Desserts"
    | "Cupcakes"
    | "Eggless Options";
  description: string;
  /** Numeric base price in ₹ (used for the count-up reveal + order message) */
  price: number;
  /** e.g. "from" for starting prices; omit for fixed prices */
  priceQualifier?: "from" | "each";
  art: PastryVariant;
  customizable: boolean;
  /** Options shown in the expanded card when customizable */
  sizes?: string[];
  flavors?: string[];
  eggless?: boolean;
  /** Featured products render as a wide tile in the catalog */
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "classic-birthday",
    name: "Classic Birthday Cake",
    category: "Birthday Cakes",
    description:
      "Fresh cream, soft sponge, and your message piped on top — free. The cake most of Bhestan grew up on.",
    price: 450,
    priceQualifier: "from",
    art: "candles",
    customizable: true,
    sizes: ["Half kg", "1 kg", "2 kg"],
    flavors: ["Vanilla", "Chocolate", "Butterscotch", "Pineapple"],
    eggless: true,
  },
  {
    id: "custom-design",
    name: "Custom Design Cake",
    category: "Custom Design Cakes",
    description:
      "Cartoons, portraits, hobbies, the joke only your family gets. Tell us the idea — we sketch it with you before the oven comes on. Reviewers call the results “fab”, and we intend to keep it that way.",
    price: 900,
    priceQualifier: "from",
    art: "tiered",
    customizable: true,
    sizes: ["1 kg", "2 kg", "Tiered (quoted)"],
    flavors: ["Vanilla", "Chocolate", "Butterscotch", "Red Velvet"],
    eggless: true,
    featured: true,
  },
  {
    id: "fresh-fruit",
    name: "Fresh Fruit Gateau",
    category: "Birthday Cakes",
    description:
      "Seasonal fruit and light chantilly cream. Lighter than it looks, gone faster than you'd think.",
    price: 600,
    priceQualifier: "from",
    art: "layer",
    customizable: true,
    sizes: ["Half kg", "1 kg"],
    flavors: ["Mixed fruit", "Mango (seasonal)", "Strawberry"],
  },
  {
    id: "pastry-slices",
    name: "Pastry Slices",
    category: "Pastries & Desserts",
    description:
      "Chocolate truffle, pineapple, butterscotch. Baked for the day, never for the week.",
    price: 90,
    priceQualifier: "each",
    art: "slice",
    customizable: false,
    eggless: true,
  },
  {
    id: "cupcake-box",
    name: "Cupcake Box of 6",
    category: "Cupcakes",
    description:
      "Six cupcakes, mixed toppings, one box that rarely survives the ride home.",
    price: 480,
    art: "cupcake",
    customizable: true,
    flavors: ["Mixed box", "All chocolate", "All vanilla"],
    eggless: true,
  },
  {
    id: "brownie",
    name: "Brownies & Blondies",
    category: "Pastries & Desserts",
    description: "Dense and fudgy. Best slightly warmed, honestly best anyway.",
    price: 110,
    priceQualifier: "each",
    art: "croissant",
    customizable: false,
  },
];

export const categories = [
  "Birthday Cakes",
  "Custom Design Cakes",
  "Pastries & Desserts",
  "Cupcakes",
  "Eggless Options",
] as const;
