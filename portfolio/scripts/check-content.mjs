#!/usr/bin/env node
/**
 * Lists every unfilled `[placeholder]` left in the content file.
 *
 * Reads the source as text rather than importing it, so it needs no build
 * step, no TypeScript loader and no dependencies — it runs the same way on a
 * fresh clone as it does in CI.
 *
 * Exit code 1 while placeholders remain, so it can gate a deploy: this site
 * should not be published under someone's name while it is still describing
 * "[Your Role]".
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "src", "data", "portfolio.ts");
const rel = relative(process.cwd(), file);

let source;
try {
  source = readFileSync(file, "utf8");
} catch {
  console.error(`Could not read ${rel}`);
  process.exit(2);
}

// A placeholder is a whole quoted string that is wrapped in square brackets.
const PLACEHOLDER = /(["'])(\[[^"'\n]*\])\1/g;

const findings = [];
source.split("\n").forEach((line, i) => {
  // Skip the documentation comments, which talk about placeholders using
  // examples that look exactly like placeholders.
  const trimmed = line.trim();
  if (
    trimmed.startsWith("*") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*")
  ) {
    return;
  }

  for (const match of line.matchAll(PLACEHOLDER)) {
    findings.push({ line: i + 1, value: match[2] });
  }
});

if (findings.length === 0) {
  console.log(`✓ No placeholders left in ${rel}.`);
  process.exit(0);
}

console.log(`${findings.length} placeholder(s) still to fill in ${rel}:\n`);
for (const f of findings) {
  console.log(`  ${rel}:${String(f.line).padStart(4)}  ${f.value}`);
}
console.log(
  "\nReplace each one with a real value, or delete the entry if it does not apply."
);
process.exit(1);
