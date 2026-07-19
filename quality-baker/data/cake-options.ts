/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CAKE STUDIO OPTIONS — EDIT HERE
 *
 *  Every choice offered by the cake-order studio lives in this file. The
 *  flavour list matches the confirmed product data in data/menu.ts; the
 *  remaining lists are sensible defaults for an Indian celebration-cake shop,
 *  ⚠ CLEARLY MARKED AS EDITABLE until the owner confirms their real offering.
 *  Remove or add strings here and the studio updates everywhere, including
 *  the WhatsApp message.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const cakeOptions = {
  occasions: [
    "Birthday",
    "Anniversary",
    "Wedding / Engagement",
    "Corporate",
    "Just because",
  ],
  styles: [
    "Classic cream cake",
    "Photo cake",
    "Theme / character cake",
    "Tiered celebration cake",
  ],
  flavors: [
    "Vanilla",
    "Chocolate",
    "Butterscotch",
    "Pineapple",
    "Red Velvet",
    "Mixed fruit",
  ],
  /* EDITABLE: confirm real filling options with the shop */
  fillings: ["Baker's choice", "Fresh cream", "Chocolate ganache", "Fruit"],
  shapes: ["Round", "Square", "Heart", "Tiered"],
  weights: ["Half kg", "1 kg", "1.5 kg", "2 kg", "Larger (discuss)"],
  /* EDITABLE: confirm real finish options with the shop */
  finishes: ["Fresh cream", "Chocolate ganache", "Fondant"],
  colours: [
    { name: "Baker's choice", hex: "#f3e4c8" },
    { name: "Ivory", hex: "#fffdf8" },
    { name: "Blush pink", hex: "#f2c8cf" },
    { name: "Sky blue", hex: "#bcd9f2" },
    { name: "Chocolate", hex: "#4a2e21" },
    { name: "Gold", hex: "#d9b36c" },
  ],
  fulfilment: ["Collect from the shop", "Ask about delivery"],
} as const;

export const INSCRIPTION_LIMIT = 60;
