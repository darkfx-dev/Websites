/**
 * Featured customer review quotes.
 *
 * ⚠ EMPTY ON PURPOSE. Modi Bakers' aggregate rating (4.3★ across 373 Google
 * reviews) is confirmed by the owner and shown in the reviews section, but no
 * individual quotes have been supplied yet. Add Modi Bakers' OWN verbatim
 * Google review quotes here to feature them — never invent or borrow quotes.
 *
 * Example shape:
 *   { quote: "Best cake in town!", source: "Google review" }
 */
export type Review = {
  quote: string;
  source: string;
};

export const reviews: Review[] = [];
