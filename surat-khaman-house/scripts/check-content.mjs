/**
 * Factual and address-placement checks for the Surat Khaman House site.
 *
 * Everything asserted here is transcribed independently from the source
 * brief rather than imported from `src/data`, so a typo on either side shows
 * up as a mismatch instead of agreeing with itself.
 *
 * Run against a production build:  npm run build && npm run check:content
 */
import { spawn } from "node:child_process";
import process from "node:process";

import { chromium } from "playwright";

const PORT = 4331;
const ORIGIN = `http://127.0.0.1:${PORT}`;

// ── Expected facts, transcribed from the brief ──────────────────────────────

const PHONE_DISPLAY = "+91 99246 66000";
const PHONE_URI = "tel:+919924666000";

const WHATSAPP_URL =
  "https://wa.me/919924666000?text=Hello%20Surat%20Khaman%20House%2C%20I%20would%20like%20to%20inquire%20about%20today%27s%20menu%2C%20prices%20and%20availability.";

const WHATSAPP_MESSAGE =
  "Hello Surat Khaman House, I would like to inquire about today's menu, prices and availability.";

const PLACE_ID = "ChIJtYD54X9O4DsRir0umBF6TOQ";

const PRICE_DISCLAIMER =
  "Reference prices from the latest available menu-board snapshot. Prices and availability may change—please confirm with the outlet.";

const HOURS_FALLBACK = "Open daily—call to confirm today's hours.";

const FULL_ADDRESS =
  "Shop No. 1/3, Kalpana Society–2, Adajan Road, opposite Sevadarshan Hospital, near Ratnaraj Apartment, Krishna Nagar Society, Choksi Wadi, Adajan, Surat, Gujarat 395009";

/** name → [perKg, perPlate|null, unitLabel] */
const EXPECTED_MENU = [
  ["Plain Locho", 120, null, null],
  ["Oil Locho", 200, 30, null],
  ["Amul Butter Locho", 400, 60, null],
  ["Amul Cheese Butter Locho", 500, 80, null],
  ["Plain Khaman", 120, null, null],
  ["Vagharela Khaman", 200, 30, null],
  ["Nylon Khaman", 200, 30, null],
  ["Sev Khamani", 200, 30, null],
  ["Plain Idada", 100, null, null],
  ["Tiranga Idada", 200, 30, null],
  ["Vagharela Idada", 200, 30, null],
  ["Cheese Chinese Idada–Dhokla", 400, 50, null],
  ["Plain Patudi", 160, null, null],
  ["Vaghareli Patudi", 200, 30, null],
  ["Plain Patra", 160, null, null],
  ["Vagharela Patra", 200, 30, null],
  ["Raw Chana-dal Samosa", 200, null, null],
  ["Fried Chana-dal Samosa", 300, 30, null],
  ["Raw Cheese Paneer Samosa", 400, null, null],
  ["Fried Cheese Paneer Samosa", 600, 60, null],
  ["Raw Chinese Samosa", 240, null, null],
  ["Fried Chinese Samosa", 300, 50, null],
  ["Chinese Roll", 240, null, null],
  ["Fried Chinese Roll", 300, 30, null],
  ["Raw Pattice", 240, null, null],
  ["Fried Pattice", 300, 30, null],
  ["Ghee Jalebi", 400, 40, null],
  ["Sev", 300, null, null],
  ["Bottled Water", null, 20, "bottle"],
];

/** §17: none of these may appear in visible text before the final section. */
const BANNED_BEFORE_LOCATION = [
  "Adajan",
  "Adajan Patiya",
  "Adajan Road",
  "Shop No. 1/3",
  "Kalpana Society",
  "Sevadarshan",
  "Ratnaraj",
  "Krishna Nagar",
  "Choksi Wadi",
  "395009",
  "Google Maps",
  "Directions",
  "Get directions",
  "Find us",
  "Visit us",
  "Location pin",
  "Latitude",
  "Longitude",
  "Place ID",
];

/** §21: things that must appear nowhere on the page. */
const BANNED_ANYWHERE = [
  "Gopal Khaman House",
  "gopalkhamanhouse.com",
  "Open now",
  "Since 1915",
  "FSSAI",
  "Jain",
  "Reservation",
  "Free delivery",
  "Catering",
];

// ── Harness ─────────────────────────────────────────────────────────────────

const failures = [];
let checks = 0;

function check(name, condition, detail = "") {
  checks += 1;
  if (!condition) {
    failures.push(detail ? `${name}\n      ${detail}` : name);
    console.log(`  ✗ ${name}${detail ? `\n      ${detail}` : ""}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

async function waitForServer(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  // `detached` puts the server in its own process group so the whole group can
  // be signalled on the way out. Killing only the npx wrapper would leave the
  // real `next-server` holding the port.
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "ignore",
    detached: true,
  });

  let browser;
  try {
    if (!(await waitForServer(ORIGIN))) {
      throw new Error(`Server did not become ready at ${ORIGIN}`);
    }

    browser = await chromium.launch();
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));

    await page.goto(ORIGIN, { waitUntil: "networkidle" });

    // ── Menu ────────────────────────────────────────────────────────────────
    console.log("\nMenu");

    const rows = await page.$$eval("#menu li", (nodes) =>
      nodes
        .filter((n) => n.querySelector("span"))
        .map((n) => n.textContent.replace(/\s+/g, " ").trim()),
    );

    check(
      `menu renders exactly ${EXPECTED_MENU.length} items`,
      rows.length === EXPECTED_MENU.length,
      `found ${rows.length}`,
    );

    const pageText = await page.evaluate(() => document.body.innerText);

    for (const [name, perKg, perPlate, unitLabel] of EXPECTED_MENU) {
      // Match on the name portion only. A prefix match would let "Sev
      // Khamani" answer for "Sev", so split the row at the first price.
      const row = rows.find((r) => r.split("₹")[0].trim() === name);
      if (!row) {
        check(`item present: ${name}`, false, "row not found");
        continue;
      }

      const expected = [];
      if (perKg !== null) expected.push(`₹${perKg}/kg`);
      if (perPlate !== null)
        expected.push(`₹${perPlate}/${unitLabel ?? "plate"}`);

      const ok = expected.every((price) => row.includes(price));
      check(
        `prices correct: ${name} → ${expected.join(" ")}`,
        ok,
        `row read: "${row}"`,
      );
    }

    check(
      "no undefined or NaN leaked into a price",
      !pageText.includes("undefined") && !pageText.includes("NaN"),
    );

    // ── Contact ─────────────────────────────────────────────────────────────
    console.log("\nContact");

    const telHrefs = await page.$$eval('a[href^="tel:"]', (as) =>
      as.map((a) => a.getAttribute("href")),
    );
    check("at least one tel: link", telHrefs.length > 0);
    check(
      "every tel: link is the public number",
      telHrefs.every((h) => h === PHONE_URI),
      `found: ${[...new Set(telHrefs)].join(", ")}`,
    );
    check("displayed phone number is correct", pageText.includes(PHONE_DISPLAY));

    const waHrefs = await page.$$eval('a[href^="https://wa.me/"]', (as) =>
      as.map((a) => a.getAttribute("href")),
    );
    check("at least one WhatsApp link", waHrefs.length > 0);
    check(
      "every WhatsApp link targets 919924666000",
      waHrefs.every((h) => h.startsWith("https://wa.me/919924666000?text=")),
    );
    check(
      "default WhatsApp URL matches the approved URL exactly",
      waHrefs.includes(WHATSAPP_URL),
      `no link equalled the brief's literal.\n      got: ${waHrefs[0]}`,
    );
    check(
      "every WhatsApp link decodes to the approved message",
      waHrefs.every((h) => {
        const text = decodeURIComponent(new URL(h).searchParams.get("text"));
        return text.startsWith(WHATSAPP_MESSAGE);
      }),
    );

    // ── Disclaimers and hours ───────────────────────────────────────────────
    console.log("\nDisclaimers and hours");

    check("price disclaimer is visible", pageText.includes(PRICE_DISCLAIMER));
    check("hours fallback is visible", pageText.includes(HOURS_FALLBACK));
    check(
      "no clock time is published",
      !/\b\d{1,2}[:.]\d{2}\s?(am|pm)\b/i.test(pageText) &&
        !/\b\d{1,2}\s?(am|pm)\b/i.test(pageText),
    );
    // The rule is about how the *displayed* reference prices are labelled, not
    // about the word "current" in any context — the brief's own required copy
    // asks customers to "confirm current prices". So: these labels may never
    // appear, and any mention of current prices must be an instruction to go
    // and confirm them.
    check(
      "reference prices are never labelled today's/latest/guaranteed",
      !/\b(today'?s|latest|guaranteed)\s+prices\b/i.test(pageText),
    );
    check(
      "every mention of 'current prices' asks the customer to confirm them",
      [...pageText.matchAll(/(\w+)\s+current\s+prices/gi)].every(([, word]) =>
        /^confirm$/i.test(word),
      ),
      [...pageText.matchAll(/.{0,24}current\s+prices/gi)]
        .map(([m]) => m.trim())
        .join(" | "),
    );
    check(
      "no review count is displayed",
      !/\b\d[\d,]*\s+(reviews|ratings)\b/i.test(pageText),
    );

    // ── Address placement (§17) ─────────────────────────────────────────────
    console.log("\nAddress placement");

    const visibleBeforeLocation = await page.evaluate(() => {
      const location = document.getElementById("location");
      if (!location) return null;

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      const parts = [];
      let node;
      while ((node = walker.nextNode())) {
        // Stop as soon as we reach the final location section.
        if (location.contains(node)) break;

        const parent = node.parentElement;
        if (!parent) continue;

        // JSON-LD and the RSC payload are non-visible by definition.
        if (parent.closest("script, style, template")) continue;

        const style = getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") continue;

        parts.push(node.textContent);
      }
      return parts.join(" ");
    });

    check("the final #location section exists", visibleBeforeLocation !== null);

    if (visibleBeforeLocation !== null) {
      for (const term of BANNED_BEFORE_LOCATION) {
        const hit = visibleBeforeLocation
          .toLowerCase()
          .includes(term.toLowerCase());
        check(`"${term}" does not appear before the location section`, !hit);
      }
    }

    // The address must appear, exactly once, and only in the final section.
    const addressOccurrences = pageText.split(FULL_ADDRESS).length - 1;
    check(
      "the complete address appears exactly once on the page",
      addressOccurrences === 1,
      `found ${addressOccurrences} occurrences`,
    );

    const addressInsideLocation = await page.evaluate(
      (addr) => {
        const location = document.getElementById("location");
        return Boolean(location && location.innerText.includes(addr));
      },
      FULL_ADDRESS,
    );
    check(
      "the complete address is inside the final location section",
      addressInsideLocation,
    );

    const mapsHrefs = await page.$$eval(
      'a[href*="google.com/maps"]',
      (as) => as.map((a) => ({ href: a.getAttribute("href"), inLocation: Boolean(a.closest("#location")) })),
    );
    check("exactly one Google Maps link", mapsHrefs.length === 1, `found ${mapsHrefs.length}`);
    check(
      "the Maps link is inside the final location section",
      mapsHrefs.every((m) => m.inLocation),
    );
    check(
      `the Maps link uses Place ID ${PLACE_ID}`,
      mapsHrefs.every((m) => m.href.includes(`query_place_id=${PLACE_ID}`)),
      mapsHrefs[0]?.href ?? "no link",
    );

    // ── Structured data (§19) ───────────────────────────────────────────────
    console.log("\nStructured data");

    const jsonLd = await page.$$eval(
      'script[type="application/ld+json"]',
      (nodes) => nodes.map((n) => n.textContent),
    );
    check("exactly one JSON-LD block", jsonLd.length === 1);

    const ld = JSON.parse(jsonLd[0]);
    check("JSON-LD has the business name", ld.name === "Surat Khaman House");
    check("JSON-LD has the Gujarati alternate name", ld.alternateName === "સુરત ખમણ હાઉસ");
    check("JSON-LD has the telephone", ld.telephone === PHONE_DISPLAY);
    check("JSON-LD has the full street address", Boolean(ld.address?.streetAddress));
    check("JSON-LD has coordinates", ld.geo?.latitude === 21.19722 && ld.geo?.longitude === 72.8054);
    check(`JSON-LD hasMap uses Place ID`, String(ld.hasMap).includes(PLACE_ID));

    for (const omitted of [
      "aggregateRating",
      "openingHoursSpecification",
      "review",
      "priceRange",
      "image",
      "sameAs",
      "hasMenu",
      "acceptsReservations",
      "potentialAction",
    ]) {
      check(`JSON-LD omits ${omitted}`, ld[omitted] === undefined);
    }

    // ── Photography and factual audit ───────────────────────────────────────
    console.log("\nPhotography and factual audit");

    const imgCount = await page.$$eval("img", (imgs) => imgs.length);
    check("no photographs are used", imgCount === 0, `found ${imgCount} <img>`);

    for (const term of BANNED_ANYWHERE) {
      check(
        `"${term}" appears nowhere on the page`,
        !pageText.toLowerCase().includes(term.toLowerCase()),
      );
    }

    // ── Mobile sticky bar (§9.12) ───────────────────────────────────────────
    console.log("\nMobile action bar");

    await page.setViewportSize({ width: 390, height: 780 });
    const barLinks = await page.$$eval(
      ".fixed.inset-x-0.bottom-0 a",
      (as) => as.map((a) => a.getAttribute("href")),
    );
    check("sticky bar has exactly two actions", barLinks.length === 2, `found ${barLinks.length}`);
    check(
      "sticky bar is Call + WhatsApp only",
      barLinks.some((h) => h.startsWith("tel:")) &&
        barLinks.some((h) => h.startsWith("https://wa.me/")) &&
        !barLinks.some((h) => h.includes("maps")),
    );

    // ── Menu filtering and empty state ──────────────────────────────────────
    console.log("\nMenu interaction");

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole("button", { name: "Pattice", exact: true }).click();
    await page.waitForTimeout(250);
    const pattice = await page.$$eval("#menu li", (n) => n.length);
    check("filtering to Pattice shows 2 items", pattice === 2, `found ${pattice}`);

    await page.getByRole("button", { name: "All", exact: true }).click();
    await page.waitForTimeout(250);
    await page.getByPlaceholder("Search items or categories").fill("locho");
    await page.waitForTimeout(250);
    const lochoRows = await page.$$eval("#menu li", (n) => n.length);
    check("searching 'locho' narrows the list", lochoRows === 4, `found ${lochoRows}`);

    await page.getByPlaceholder("Search items or categories").fill("zzzz");
    await page.waitForTimeout(250);
    const emptyVisible = await page
      .getByText("No items match that search.")
      .isVisible();
    check("empty state appears for a no-result search", emptyVisible);

    await page.getByRole("button", { name: "Reset the menu" }).click();
    await page.waitForTimeout(250);
    const afterReset = await page.$$eval("#menu li", (n) => n.length);
    check("reset restores all items", afterReset === EXPECTED_MENU.length, `found ${afterReset}`);

    // ── Mobile menu keyboard behaviour ──────────────────────────────────────
    console.log("\nMobile menu keyboard behaviour");

    await page.setViewportSize({ width: 390, height: 780 });
    await page.reload({ waitUntil: "networkidle" });

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await page.waitForTimeout(350);

    const expandedAfterOpen = await page
      .locator('header button[aria-expanded]')
      .first()
      .getAttribute("aria-expanded");
    check("menu trigger reports aria-expanded=true", expandedAfterOpen === "true");

    const focusInPanel = await page.evaluate(() => {
      const panel = document.querySelector("header [id]:not(:has(> div))");
      const active = document.activeElement;
      return Boolean(active && active.closest("header nav[aria-label='Mobile']"));
    });
    check("focus moves into the panel on open", focusInPanel);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
    const expandedAfterEscape = await page
      .locator('header button[aria-expanded]')
      .first()
      .getAttribute("aria-expanded");
    check("Escape closes the panel", expandedAfterEscape === "false");

    const focusReturned = await page.evaluate(() =>
      Boolean(document.activeElement?.closest("header")),
    );
    check("focus returns to the header trigger", focusReturned);

    // ── Console ─────────────────────────────────────────────────────────────
    console.log("\nConsole");
    check(
      "no console errors",
      consoleErrors.length === 0,
      consoleErrors.slice(0, 3).join(" | "),
    );
  } finally {
    if (browser) await browser.close();
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }

  console.log(
    `\n${checks - failures.length}/${checks} checks passed.`,
  );
  if (failures.length > 0) {
    console.log(`\n${failures.length} FAILED:`);
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
