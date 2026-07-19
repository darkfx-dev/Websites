# Content Review & Pre-Launch Checklist

Every item below needs sign-off from an authorised school representative
**before the site goes live**. Nothing on the website claims anything beyond
the facts supplied; this file lists what is still unconfirmed and what is
deliberately absent.

## Must confirm before launch

- [ ] **Official name presentation.** The site uses
  "St. Thomas English Medium Higher Secondary School" as the formal name,
  "STEMS" where space is limited, and "St. Thomas School, Surat" as the
  social/search phrase. The school must approve this presentation.
- [ ] **Phone number.** Confirm **74359 75575** is the correct public contact
  number.
- [ ] **WhatsApp.** Confirm **+91 74359 75575** is active on WhatsApp *and
  monitored*. The entire enquiry flow hands off to this number.
- [ ] **Address display and map pin.** Confirm the exact display formatting
  of the supplied address and that the Google Maps directions link lands at
  the right gate.
- [ ] **GSEB wording** and availability of **Standards 1–12**.
- [ ] **Science and Commerce** availability for Standards 11–12.
- [ ] **Instagram URL** remains correct.

## Awaiting school assets / information (not shown on the site)

None of the following exists on the site today, because none was supplied.
Each needs school-provided content *and* approval before being added:

- Official logo (the site is deliberately text-marked until then)
- Official motto, founding year, trust/management name
- GSEB affiliation/registration number
- Principal's name, faculty and student counts
- Fee amounts, admission dates, session availability
- Office hours and email address
- Exam results, awards, facilities, transport, safety systems, scholarships,
  clubs, testimonials
- Campus photographs (with permission to publish and alt text)

## Legal / data protection

- [ ] The current enquiry flow stores nothing. If the school ever wants
  stored submissions, obtain: written school authorization, an approved
  privacy notice, named staff access, retention rules, anti-spam controls,
  and secure credentials — then build a server-side workflow. Do **not**
  bolt on a third-party form endpoint.
- [ ] School/legal review of the privacy page wording.

## Deployment

- [ ] Choose a free static host and verify its terms suit a school website
  (Netlify, Cloudflare Pages and GitHub Pages free tiers are candidates;
  their current terms were **not** verified from this environment).
- [ ] Set `SITE_URL`, rebuild, add the `Sitemap:` line to `robots.txt`,
  and validate the JSON-LD with Google's Rich Results test after launch.
- [ ] Explicit authorization to publish.
