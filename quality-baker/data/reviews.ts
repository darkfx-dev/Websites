/**
 * Real customer reviews from the shop's Google listing (4.9★, 95 reviews).
 * Quotes are verbatim — do not invent or embellish new ones.
 */
export type Review = {
  quote: string;
  source: string;
};

export const reviews: Review[] = [
  { quote: "Design was fab and cake taste good.", source: "Google review" },
  {
    quote: "Very very tasty cakes and pastry… too kind behaviour.",
    source: "Google review",
  },
  {
    quote: "Cake quality and taste both are too good.",
    source: "Google review",
  },
  { quote: "Fast service and tasty cake.", source: "Google review" },
  { quote: "Very good quality and taste.", source: "Google review" },
];
