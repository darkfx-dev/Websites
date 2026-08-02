/**
 * Production QA sweep.
 *
 * Serves the built site, then checks it at every required viewport for
 * horizontal overflow, axe accessibility violations and undersized touch
 * targets; exercises the mobile sheet and the FAQ; verifies the
 * reduced-motion and forced-colors states; and greps the served HTML and the
 * client bundle for facts that must never appear.
 *
 *   npm run build && npm run audit:site
 *
 * Screenshots land in `.audit/`.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";
import sharp from "sharp";

/**
 * Use a preinstalled Chromium when one is provided (CI images often ship a
 * build that does not match the pinned Playwright revision); otherwise fall
 * back to Playwright's own download.
 */
const PRESET_CHROMIUM = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const launchOptions = existsSync(PRESET_CHROMIUM) ? { executablePath: PRESET_CHROMIUM } : {};

const require = createRequire(import.meta.url);
const axeSource = require("axe-core").source;

const PORT = 3210;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUT = path.resolve(".audit");
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440];

const problems = [];
const notes = [];

const fail = (message) => problems.push(message);
const note = (message) => notes.push(message);

async function assertPortFree() {
  try {
    await fetch(ORIGIN, { cache: "no-store", signal: AbortSignal.timeout(1500) });
  } catch {
    return; // nothing listening, which is what we want
  }
  throw new Error(
    `Something is already serving ${ORIGIN}. A stale server would be audited instead of the ` +
      `current build. Stop it first (e.g. \`pkill -f "next start"\`) and re-run.`,
  );
}

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(ORIGIN, { cache: "no-store" });
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("Server did not start in time");
}

async function runAxe(page, label, { skipContrast = false } = {}) {
  await page.evaluate(axeSource);
  const results = await page.evaluate(
    async (skip) =>
      await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
        ...(skip ? { rules: { "color-contrast": { enabled: false } } } : {}),
      }),
    skipContrast,
  );

  // Gradient and translucent backdrops make axe return "incomplete" rather
  // than a violation. Those were silently dropped before, which hid a real
  // contrast defect, so they are surfaced as warnings now.
  for (const item of results.incomplete) {
    if (item.id !== "color-contrast") continue;
    note(
      `[axe ${label}] needs review: ${item.id} on ${item.nodes.length} node(s) — ${item.nodes
        .slice(0, 2)
        .map((node) => node.target.join(" "))
        .join(" | ")}`,
    );
  }

  for (const violation of results.violations) {
    fail(
      `[axe ${label}] ${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes
        .slice(0, 3)
        .map((node) => node.target.join(" "))
        .join(" | ")}`,
    );
  }
  return results.violations.length;
}

/** WCAG relative luminance from 8-bit sRGB. */
function luminance([r, g, b]) {
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function parseRgb(value) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(",").map((part) => Number.parseFloat(part));
  if (parts.length >= 4 && parts[3] < 0.95) return null; // translucent text: skip
  return [parts[0], parts[1], parts[2]];
}

/**
 * Measures real text contrast.
 *
 * axe cannot resolve the effective background under the gradient washes and
 * the grain overlay, so it returns ~160 "incomplete" nodes instead of a
 * verdict. This measures the pixels instead:
 *
 *  1. record each text run's computed colour and size;
 *  2. make every glyph transparent, leaving the true composited background;
 *  3. walk the page one viewport at a time, screenshotting each step.
 *
 * Per-viewport capture matters — a full-page screenshot stitches
 * position:fixed overlays in at the wrong offset, which corrupts samples.
 * Runs occluded by an overlay are skipped via an elementFromPoint check.
 */
async function checkTextContrast(page, label) {
  // Scroll-triggered reveals must finish first: an unrevealed section is
  // still transparent, and its text would sample against the page background
  // rather than the panel it actually sits on.
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  });
  await page.waitForTimeout(500);

  const runs = await page.evaluate(() => {
    const collected = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim()) continue;

      const element = node.parentElement;
      if (!element || element.closest(".sr-only, svg, noscript, script, style")) continue;
      if (element.dataset.contrastIdx) continue;

      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none") continue;

      const fontSize = Number.parseFloat(style.fontSize);
      const weight = Number.parseInt(style.fontWeight, 10) || 400;

      element.dataset.contrastIdx = String(collected.length);
      collected.push({
        text: node.textContent.trim().slice(0, 40),
        color: style.color,
        // Large text per WCAG: >=24px, or >=18.66px when bold.
        large: fontSize >= 24 || (fontSize >= 18.66 && weight >= 700),
      });
    }
    return collected;
  });

  await page.addStyleTag({
    content:
      "*, *::before, *::after { color: transparent !important; text-shadow: none !important; }",
  });

  const viewport = page.viewportSize();
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const worst = new Map();
  let sampled = 0;

  for (let top = 0; top < pageHeight; top += viewport.height) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    // Long enough for the sticky bar's 220ms entrance to settle: sampling
    // mid-animation reads a partially transparent surface.
    await page.waitForTimeout(450);

    const visible = await page.evaluate(() => {
      const found = [];
      for (const element of document.querySelectorAll("[data-contrast-idx]")) {
        const rect = element.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        // Keep a margin so the 3x3 sample patch stays on screen.
        if (rect.top < 4 || rect.bottom > window.innerHeight - 4) continue;
        if (rect.left < 4 || rect.right > window.innerWidth - 4) continue;

        const x = Math.round(rect.left + rect.width / 2);
        const y = Math.round(rect.top + rect.height / 2);

        // Skip anything covered by a fixed overlay: the pixel there belongs
        // to the overlay, not to this text.
        const topMost = document.elementFromPoint(x, y);
        if (!topMost || !(element.contains(topMost) || topMost.contains(element))) continue;

        found.push({ idx: Number(element.dataset.contrastIdx), x, y });
      }
      return found;
    });

    if (visible.length === 0) continue;

    const shot = await page.screenshot();
    const { data, info } = await sharp(shot)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (const entry of visible) {
      const run = runs[entry.idx];
      const foreground = parseRgb(run.color);
      if (!foreground) continue;

      // Sample a 3x3 patch and keep the darkest pixel: the grain overlay is
      // noise, so the darkest sample is the worst case for dark-on-light text.
      let darkest = null;
      let darkestLuminance = Infinity;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const offset = ((entry.y + dy) * info.width + (entry.x + dx)) * info.channels;
          const pixel = [data[offset], data[offset + 1], data[offset + 2]];
          const value = luminance(pixel);
          if (value < darkestLuminance) {
            darkestLuminance = value;
            darkest = pixel;
          }
        }
      }

      sampled += 1;
      const ratio = contrastRatio(foreground, darkest);
      const required = run.large ? 3 : 4.5;
      if (ratio < required) {
        const key = `${run.color}|${run.large}`;
        const existing = worst.get(key);
        if (!existing || ratio < existing.ratio) {
          worst.set(key, { ratio, required, run, background: darkest });
        }
      }
    }
  }

  for (const entry of worst.values()) {
    fail(
      `[contrast ${label}] ${entry.ratio.toFixed(2)}:1 (needs ${entry.required}:1) — ` +
        `"${entry.run.text}" ${entry.run.color} on rgb(${entry.background.join(", ")})`,
    );
  }

  note(`[contrast ${label}] sampled ${sampled} text runs, ${worst.size} failing colour pairs`);
}

async function checkOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    fail(
      `[overflow ${label}] page scrolls horizontally: ${overflow.scrollWidth}px content in ${overflow.clientWidth}px viewport`,
    );
  }
}

async function checkTouchTargets(page, label) {
  const small = await page.evaluate(() => {
    const results = [];
    for (const element of document.querySelectorAll("a[href], button")) {
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      // Skip visually-hidden helpers.
      if (rect.width <= 1 && rect.height <= 1) continue;
      if (rect.width < 44 || rect.height < 44) {
        results.push({
          text: (element.textContent || "").trim().slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    }
    return results;
  });

  for (const target of small) {
    fail(`[target ${label}] "${target.text}" is ${target.width}×${target.height}, under 44×44`);
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  await assertPortFree();

  // `detached` puts the server in its own process group so the whole group
  // can be signalled; killing only the npx wrapper leaves the server behind
  // to be audited by the *next* run against a stale build.
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "ignore",
    env: process.env,
    detached: true,
  });

  const browser = await chromium.launch(launchOptions);

  try {
    await waitForServer();

    // ---- Every required viewport ----------------------------------------
    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: width < 500 ? 800 : 900 },
        deviceScaleFactor: 1,
        isMobile: width < 500,
        hasTouch: width < 500,
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(String(error)));

      await page.goto(ORIGIN, { waitUntil: "load" });

      // Guard against auditing an unstyled page: without CSS every element
      // measures wrong and the report fills with meaningless failures.
      const styled = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      );
      if (styled === "rgba(0, 0, 0, 0)" || styled === "rgb(255, 255, 255)") {
        throw new Error(`Stylesheet did not apply at ${width}px (body background ${styled})`);
      }

      await checkOverflow(page, `${width}px`);
      await checkTouchTargets(page, `${width}px`);
      const violations = await runAxe(page, `${width}px`);

      for (const error of consoleErrors) fail(`[console ${width}px] ${error}`);

      if (width === 390 || width === 1280) {
        // Walk the page first so scroll-triggered reveals have run; a
        // straight full-page capture would show unrevealed sections blank.
        // The smooth-scroll override matters: with it left on, each step
        // animates and the observer never catches up.
        await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
        await page.evaluate(async () => {
          const step = Math.round(window.innerHeight * 0.8);
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 120));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(OUT, `home-${width}.png`),
          fullPage: true,
        });
        // Destructive (blanks all text), so it runs last on this context.
        await checkTextContrast(page, `${width}px`);
      }

      note(`${width}px: ${violations} axe violations, ${consoleErrors.length} console errors`);
      await context.close();
    }

    // ---- Short mobile viewport ------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 360, height: 560 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });
      await checkOverflow(page, "360×560");

      // Primary actions must be reachable without scrolling past the hero.
      const ctaBox = await page
        .getByRole("link", { name: /Ask on WhatsApp/ })
        .first()
        .boundingBox();
      if (!ctaBox || ctaBox.y > 560) {
        fail("[hero 360×560] primary WhatsApp CTA is not visible in the first viewport");
      }
      await context.close();
    }

    // ---- Mobile sheet ----------------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 800 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });

      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("dialog", { name: "Site menu" }).waitFor();
      await checkOverflow(page, "sheet open");
      await runAxe(page, "sheet open");
      await page.screenshot({ path: path.join(OUT, "mobile-sheet.png") });

      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "detached" });

      const focused = await page.evaluate(
        () => document.activeElement?.getAttribute("aria-expanded") ?? null,
      );
      if (focused !== "false") fail("[sheet] focus did not return to the menu trigger on Escape");

      await context.close();
    }

    // ---- FAQ expanded + menu filter -------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });

      await page.getByRole("button", { name: /What does this outlet serve/ }).click();
      await page.waitForTimeout(400);
      await checkOverflow(page, "faq open");
      await runAxe(page, "faq open");

      await page.getByRole("button", { name: "Locho", exact: true }).click();
      await page.waitForTimeout(400);
      const status = await page.getByRole("status").first().textContent();
      if (!status?.includes("Showing 4 of 29")) {
        fail(`[menu] filter did not announce the result count, got: ${status}`);
      }
      await runAxe(page, "menu filtered");
      await page.screenshot({ path: path.join(OUT, "menu-filtered.png") });
      await context.close();
    }

    // ---- Reduced motion --------------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 800 },
        reducedMotion: "reduce",
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });

      const headlineOpacity = await page.evaluate(
        () => getComputedStyle(document.querySelector("h1")).opacity,
      );
      if (headlineOpacity !== "1") {
        fail(`[reduced-motion] hero headline is not fully visible (opacity ${headlineOpacity})`);
      }
      await checkOverflow(page, "reduced motion");
      await runAxe(page, "reduced motion");
      await page.screenshot({ path: path.join(OUT, "reduced-motion.png"), fullPage: true });
      await context.close();
    }

    // ---- Forced colors ---------------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 1024, height: 900 },
        forcedColors: "active",
      });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });
      await checkOverflow(page, "forced colors");
      await runAxe(page, "forced colors", { skipContrast: true });
      await context.close();
    }

    // ---- 200% and 400% zoom ---------------------------------------------
    // Browser zoom shrinks the layout viewport; halving/quartering a 1280px
    // window reproduces exactly that reflow.
    for (const [label, width] of [
      ["200% zoom", 640],
      ["400% zoom", 320],
    ]) {
      const context = await browser.newContext({ viewport: { width, height: 700 } });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });
      await checkOverflow(page, label);
      await runAxe(page, label);
      await context.close();
    }

    // ---- No JavaScript ---------------------------------------------------
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 800 },
        javaScriptEnabled: false,
      });
      const page = await context.newPage();
      await page.goto(ORIGIN, { waitUntil: "load" });

      const text = (await page.textContent("body")) ?? "";
      for (const required of ["Surat Khaman House", "+91 99246 66000", "Plain Locho", "Ghee Jalebi"]) {
        if (!text.includes(required)) fail(`[no-js] "${required}" is missing without JavaScript`);
      }
      const waLink = await page.locator('a[href^="https://wa.me/919924666000"]').count();
      const telLink = await page.locator('a[href="tel:+919924666000"]').count();
      const mapLink = await page.locator('a[href*="ChIJtYD54X9O4DsRir0umBF6TOQ"]').count();
      if (waLink === 0) fail("[no-js] no WhatsApp link");
      if (telLink === 0) fail("[no-js] no telephone link");
      if (mapLink === 0) fail("[no-js] no Place-ID directions link");
      note(`no-js: ${waLink} WhatsApp, ${telLink} tel, ${mapLink} maps links present`);
      await context.close();
    }

    // ---- Factual audit of the served HTML and client bundle --------------
    {
      const html = await (await fetch(ORIGIN)).text();

      const forbidden = [
        /₹/,
        /\bsince\s+\d{4}\b/i,
        /\bfounded\b/i,
        /\bproprietor\b/i,
        /\baward[- ]winning\b/i,
        /\bbest in surat\b/i,
        /\bno\.?\s*1\b(?!\s*\/)/i,
        /\bmost authentic\b/i,
        /\border online\b/i,
        /\bdelivery\b/i,
        /\breservation/i,
        /\bcatering\b/i,
        /\bfssai\b/i,
        /\bjain\b/i,
        /gopalkhamanhouse/i,
        /\binstagram\b/i,
        /\bfacebook\b/i,
        /openingHours/i,
        /priceRange/i,
        /aggregateRating/i,
      ];
      for (const pattern of forbidden) {
        if (pattern.test(html)) fail(`[facts] served HTML matches forbidden pattern ${pattern}`);
      }

      // The only phone number anywhere must be the public business number.
      const phoneLike = html.match(/(?:\+?91[\s-]?)?\b\d{5}[\s-]?\d{5}\b/g) ?? [];
      const unexpected = phoneLike.filter(
        (value) => !/9924\s?666\s?000|99246\s?66000/.test(value.replace(/[\s-]/g, "")),
      );
      if (unexpected.length > 0) {
        fail(`[facts] unexpected phone-like strings in HTML: ${[...new Set(unexpected)].join(", ")}`);
      }

      if (!html.includes("ChIJtYD54X9O4DsRir0umBF6TOQ")) {
        fail("[facts] the exact Google Place ID is missing from the served HTML");
      }

      // Reference prices must not reach the client bundle.
      const chunkDir = path.resolve(".next/static/chunks");
      const files = await readdir(chunkDir, { recursive: true }).catch(() => []);
      const referencePrices = [
        "120", "200", "400", "500", "100", "160", "240", "300", "600", "50", "80", "60", "30", "40", "20",
      ];
      let priceHits = 0;
      for (const file of files) {
        if (!String(file).endsWith(".js")) continue;
        const source = await readFile(path.join(chunkDir, String(file)), "utf8");
        if (source.includes("₹")) {
          fail(`[facts] rupee symbol found in client chunk ${file}`);
        }
        // Look for the price table shape rather than bare numbers, which
        // legitimately appear in minified code.
        if (/perKg\s*:\s*\d/.test(source) || /perPlate\s*:\s*\d/.test(source)) {
          fail(`[facts] a serialised price field reached client chunk ${file}`);
          priceHits += 1;
        }
      }
      note(`bundle: scanned ${files.length} chunk files, ${priceHits} price leaks`);
      void referencePrices;
    }
  } finally {
    await browser.close();
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }

  const report = [
    "# Audit report",
    "",
    `Generated ${new Date().toISOString()}`,
    "",
    "## Checks",
    ...notes.map((entry) => `- ${entry}`),
    "",
    problems.length === 0 ? "## Result\n\nNo problems found." : "## Problems",
    ...problems.map((entry) => `- ${entry}`),
    "",
  ].join("\n");

  await writeFile(path.join(OUT, "report.md"), report, "utf8");

  console.log(report);
  if (problems.length > 0) {
    console.error(`\n${problems.length} problem(s) found.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
