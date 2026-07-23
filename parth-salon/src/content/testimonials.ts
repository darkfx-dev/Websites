/* Testimonials — ALL disabled pending verification. Not rendered anywhere
   until each has a confirmed source, attribution, exact wording, and
   publication approval. Direct quotes must never be silently reworded. */
export interface Testimonial {
  id: string;
  quote: string;
  attribution: string | null; // reviewer name or approved anonymous label
  sourcePlatform: string | null;
  sourceUrl: string | null;
  wordingConfirmed: boolean;
  publicationApproved: boolean;
  enabled: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The salon has a great infrastructure, and as soon as you enter, you feel a positive vibe.",
    attribution: null,
    sourcePlatform: null,
    sourceUrl: null,
    wordingConfirmed: false,
    publicationApproved: false,
    enabled: false,
  },
  {
    id: "t2",
    quote:
      "Great experience... wonderful customer service, friendly people and amazing styles.",
    attribution: null,
    sourcePlatform: null,
    sourceUrl: null,
    wordingConfirmed: false,
    publicationApproved: false,
    enabled: false,
  },
  {
    id: "t3",
    quote:
      "Best salon for individuals who are fond of straight hair because he has depth knowledge of all hair treatments.",
    attribution: null,
    sourcePlatform: null,
    sourceUrl: null,
    wordingConfirmed: false,
    publicationApproved: false,
    enabled: false,
  },
];

export const publishedTestimonials = testimonials.filter(
  (t) => t.enabled && t.wordingConfirmed && t.publicationApproved,
);
