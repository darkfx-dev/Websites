# Menu price reference — owner verification worksheet

**Status: UNVERIFIED. Not published on the website.**

This file is an editorial worksheet. **No application code imports it**, so
none of these numbers can reach the browser bundle, the rendered HTML, the
structured data or the accessible text while `MENU_PRICES_VERIFIED` is
`false` in `data/outlet.ts`.

The figures below are an **online-reference snapshot** transcribed from a
photographed board labelled "Surat Khaman House (AP)". They are not
owner-confirmed current prices and may be out of date.

## How to publish prices

1. Have the owner confirm each price against the current board.
2. Record the confirmation date.
3. Move the confirmed figures into `data/menu.ts` (`perKg` / `perPlate`) and
   set `priceVerified: true` on each confirmed item.
4. Only when **every** displayed item is confirmed, set
   `MENU_PRICES_VERIFIED: true` in `data/outlet.ts`.
5. Surface a "Prices last confirmed <date>" badge next to the menu.

Do not flip the flag with partial confirmation.

## Reference snapshot

| Category | Item | Reference per kg | Reference per plate/item |
|---|---|---:|---:|
| Locho | Plain Locho | ₹120 | — |
| Locho | Oil Locho | ₹200 | ₹30 |
| Locho | Amul Butter Locho | ₹400 | ₹60 |
| Locho | Amul Cheese Butter Locho | ₹500 | ₹80 |
| Khaman & Khamani | Plain Khaman | ₹120 | — |
| Khaman & Khamani | Vagharela Khaman | ₹200 | ₹30 |
| Khaman & Khamani | Nylon Khaman | ₹200 | ₹30 |
| Khaman & Khamani | Sev Khamani | ₹200 | ₹30 |
| Idada, Patudi & Patra | Plain Idada | ₹100 | — |
| Idada, Patudi & Patra | Tiranga Idada | ₹200 | ₹30 |
| Idada, Patudi & Patra | Vagharela Idada | ₹200 | ₹30 |
| Idada, Patudi & Patra | Cheese Chinese Idada–Dhokla | ₹400 | ₹50 |
| Idada, Patudi & Patra | Plain Patudi | ₹160 | — |
| Idada, Patudi & Patra | Vaghareli Patudi | ₹200 | ₹30 |
| Idada, Patudi & Patra | Plain Patra | ₹160 | — |
| Idada, Patudi & Patra | Vagharela Patra | ₹200 | ₹30 |
| Samosa & Rolls | Raw Chana-dal Samosa | ₹200 | — |
| Samosa & Rolls | Fried Chana-dal Samosa | ₹300 | ₹30 |
| Samosa & Rolls | Raw Cheese Paneer Samosa | ₹400 | — |
| Samosa & Rolls | Fried Cheese Paneer Samosa | ₹600 | ₹60 |
| Samosa & Rolls | Raw Chinese Samosa | ₹240 | — |
| Samosa & Rolls | Fried Chinese Samosa | ₹300 | ₹50 |
| Samosa & Rolls | Chinese Roll | ₹240 | — |
| Samosa & Rolls | Fried Chinese Roll | ₹300 | ₹30 |
| Pattice | Raw Pattice | ₹240 | — |
| Pattice | Fried Pattice | ₹300 | ₹30 |
| Sweets & Extras | Ghee Jalebi | ₹400 | ₹40 |
| Sweets & Extras | Sev | ₹300 | — |
| Sweets & Extras | Bottled Water | — | ₹20 per bottle |
