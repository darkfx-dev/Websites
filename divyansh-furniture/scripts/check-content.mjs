#!/usr/bin/env node
/**
 * Lists every unfilled `[placeholder]` left in the content file.
 *
 * Reads the source as text rather than importing it, so it needs no build
 * step, no TypeScript loader and no dependencies — it runs the same way on a
 * fresh clone as it does in CI.
 *
 * Exits 1 while placeholders remain, so it can gate a deploy: this site
 * should not go live under the business's name while it is still offering
 * "[Placeholder price]".
 */
import { readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "src", "data", "site.ts");
const rel = relative(process.cwd(), file);

let source;
try {
  source = readFileSync(file, "utf8");
} catch {
  console.error(`Could not read ${rel}`);
  process.exit(2);
}

// A placeholder is a whole quoted string wrapped in square brackets.
const PLACEHOLDER = /(["'])(\[[^"'\n]*\])\1/g;

const findings = [];
source.split("\n").forEach((line, i) => {
  // Skip documentation comments, which describe placeholders using examples
  // that look exactly like placeholders.
  const t = line.trim();
  if (t.startsWith("*") || t.startsWith("//") || t.startsWith("/*")) return;
  for (const m of line.matchAll(PLACEHOLDER)) {
    findings.push({ line: i + 1, value: m[2] });
  }
});

if (findings.length === 0) {
  console.log(`✓ No placeholders left in ${rel}.`);
  process.exit(0);
}

const blocking = findings.filter((f) => /whatsapp/i.test(f.value));

console.log(`${findings.length} placeholder(s) still to fill in ${rel}:\n`);
for (const f of findings) {
  console.log(`  ${rel}:${String(f.line).padStart(4)}  ${f.value}`);
}
if (blocking.length > 0) {
  console.log(
    "\n! The WhatsApp number is one of them — every booking button on the site is disabled until it is set."
  );
}
console.log("\nReplace each with a real value, or delete the entry if it does not apply.");
process.exit(1);
