# Parth Salon — Owner's Guide (edit from your phone)

You can update the whole website from your phone's web browser. **No apps,
no code, no cost.** Everything you'll normally change lives in **one file**:

```
parth-salon/src/config/business.ts
```

When you save a change there, the website rebuilds and updates by itself
(usually within 1–2 minutes).

---

## How to edit a value (step by step)

1. Open **github.com** in your phone browser and sign in.
2. Go to your repository, then tap into the folder
   `parth-salon` → `src` → `config` and open **`business.ts`**.
3. Tap the **pencil ✏️ icon** (top right) to edit.
4. Find the line you want to change and edit the text **between the quotes**.
5. Scroll down, tap **Commit changes**, then **Commit changes** again.
6. Wait 1–2 minutes and refresh your website. Done.

> Tip: only change the text **inside the "quotes"**. Don't delete commas,
> quotes, or curly brackets `{ }` — they keep the file working.

---

## What you can change (and the exact line to look for)

| You want to change… | Find this line | Example |
|---|---|---|
| Phone / WhatsApp number shown | `phoneDisplay:` | `"+91 98983 78275"` |
| WhatsApp number used by buttons | `phoneInternational:` | `"919898378275"` (no +, no spaces, no leading 0) |
| Number people call | `telephoneUrl:` | `"tel:+919898378275"` |
| Full address | `address:` and `addressLines:` | text in quotes |
| Google Maps link | `mapsUrl:` | replace `null` with `"https://maps.app.goo.gl/…"` in quotes |
| Opening hours | `openingHours:` | change `"09:30"` / `"21:30"` (24-hour clock) |
| Holiday note | `holidayHoursNotice:` | text in quotes |
| Tagline under the hero | `selectedTagline:` | `"Designed for comfort, dedicated to style."` |
| Instagram link | `instagram:` → `url:` and `handle:` | `"https://www.instagram.com/parth_salon_/"` |

> **WhatsApp number rule:** `phoneInternational` must be digits only, with the
> country code and **no** `+` and **no** leading `0`. For India that's
> `91` followed by the 10-digit number → `919898378275`.

### Turning the star rating on (only when you have real numbers)

The rating is **hidden on purpose** until you have one confirmed rating and
review count. When you do:

```ts
rating: 4.6,                 // your real average
reviewCount: 88,             // your real number of reviews
ratingSource: "Google",      // where it's from
showRating: true,            // change false → true to show it
```

Don't put a range (like 4.5–4.6). Use one confirmed number.

### Changing the tagline under the hero

The short line under the big hero heading is `selectedTagline` in
`business.ts`. Edit the text in quotes, or set it to `null` (no quotes) to hide
the line completely.

### Updating the Instagram link

The Instagram button (in the footer) uses the `instagram` block in
`business.ts`. Update `url:` to your profile link and `handle:` to your
`@name`. We never show follower counts or pull posts automatically — it's just
a link to your profile.

### Adding your services and prices (two-step safety gate)

To make sure the website **never shows a price or service you didn't confirm**,
the service menu is kept private until you approve it. There are two files:

1. **The menu list** lives in `parth-salon/src/content/services.ts`. Every
   service is already listed there but switched **off** and carries **no
   price** (so nothing unverified can appear).
2. **The master switch** is `servicesPublicationApproved` in `business.ts`.

While the menu is off, the site shows a friendly "ask on WhatsApp" message
instead of made-up prices. To publish your real menu:

- In `src/content/services.ts`, for each service you want to show, change
  `enabled: false` → `enabled: true` and
  `verificationStatus: "client-supplied"` → `verificationStatus: "confirmed"`.
  Only add a `priceDisplay:` (e.g. `priceDisplay: "₹150"`) when the price is
  confirmed — leave it as `null` to show the service with no price.
- Then in `business.ts` set `servicesPublicationApproved: false` → `true`.

The services section then fills in automatically, grouped by category. Turn the
master switch back to `false` at any time to hide the whole menu again.

> The same private-until-confirmed rule protects **testimonials**
> (`src/content/testimonials.ts`) and **team members**
> (`src/content/team.ts`). They stay hidden until you set an entry's
> `enabled: true`, so nothing unverified is ever published.

### Changing the interior photo or adding gallery photos

- The salon photo lives at `public/images/parth-salon-interior.png`.
  To replace it, upload a new photo with the **same name** (on GitHub: open the
  `public/images` folder → **Add file → Upload files**).
- To add more gallery photos, upload them to `public/images` and add entries to
  the `galleryImages:` list (copy the existing entry's format).

---

## If you make a mistake (undo)

Every change is saved as a "commit". To undo:

1. On github.com open the **`business.ts`** file.
2. Tap **History** (the clock icon).
3. Open the version from **before** your change.
4. Tap the **⋯** menu → **Revert** (or copy the old value back in and commit).

Your website will go back to how it was, automatically. Nothing is ever lost.

---

## Who to contact

If something looks broken and undo doesn't fix it, share your repository link
with whoever set this up — the site's content and settings are all in the one
`business.ts` file, which makes fixes quick.
