# Launch blockers

Things that must be supplied by the owner before this site goes live. None of
them can be invented, and each has been deliberately left out rather than
guessed.

## 1. Production domain — blocks launch

Nothing is deployed to a real address yet, so the canonical URL, `metadataBase`,
the sitemap entry, `robots.txt`'s sitemap line and the `url` field in the
Restaurant JSON-LD are all omitted.

**To fix:** set `NEXT_PUBLIC_SITE_URL` to the real origin (for example
`https://suratkhamanhouse-adajan.com`) and rebuild. Everything above starts
emitting automatically — see `lib/site.ts`.

Open Graph and Twitter card metadata are also withheld. The brief permits them
only alongside an approved brand image or a code-generated, non-photographic
social card, and both need the final domain to resolve absolute URLs.

## 2. Owner-confirmed opening hours — blocks publishing any time

Public listings disagree: 6:00 AM–7:00 PM, 6:30 AM–6:00 PM and an older
6:30 AM–8:00 PM all appear online. The site therefore shows
"Open daily — call to confirm today's hours." and omits
`openingHoursSpecification` from structured data.

**To fix:** confirm the real schedule with the owner, record the confirmation
date, add the hours to `data/outlet.ts`, set `BUSINESS_HOURS_VERIFIED: true`,
and add `openingHoursSpecification` to `lib/structured-data.ts`.

## 3. Owner-confirmed prices — blocks showing any price

The board prices circulating online are an unverified snapshot. They are kept
out of the application entirely: they live in `docs/price-reference.md`, which
no code imports, so no number can reach the HTML, the JSON-LD, the accessible
text or the JavaScript bundle. The audit asserts this on every run.

**To fix:** follow the checklist at the top of `docs/price-reference.md`.
Do not flip `MENU_PRICES_VERIFIED` with partial confirmation.

## 4. Rights-cleared photography — gallery stays hidden

No photograph of this outlet has verified reuse permission. Customer uploads on
Google, Justdial, TripTap and Restaurant Guru are reference material only and
must not be copied into this repository. The gallery section renders nothing at
all — no heading, no placeholder, no reserved space.

**To fix:** add owner-supplied originals to `public/approved/`, describe each in
`approvedAssets` in `data/outlet.ts` with a complete rights record, and set
`APPROVED_PHOTOS_AVAILABLE: true`.

Suggested shot list, in priority order — a recommendation, not a claim that any
of these exist: daylight storefront showing the sign and entrance; clean
counter/interior context; overhead menu spread; close photographs of locho,
vagharela khaman, sev khamani, idada/patra, samosa/pattice and ghee jalebi; one
staff image, only with consent.

## 5. Testimonials — omitted

No exact, attributable, reuse-approved customer quote is available, so there is
no testimonial component. The "What visitors often mention" block instead shows
neutral paraphrased themes, clearly labelled as summaries, alongside the
operational criticisms that also recur. Nothing is presented as a quotation and
no reviewer is named.

**To fix (optional):** supply exact quotes with attribution and written reuse
permission, then set `TESTIMONIAL_PERMISSION_AVAILABLE: true`.

## Not blockers — deliberately out of scope

The following were not built, because the brief rules them out for this outlet
and no verified data or backend exists for any of them: online ordering, a cart
or payment, delivery, reservations, catering, a contact form, accounts or
authentication, an admin panel, a CMS, a blog, analytics, a review count, a
founding year, an owner or proprietor name, social profiles, an email address,
an FSSAI number, and any claim about parking, seating, wheelchair access,
payment methods or Jain availability.
