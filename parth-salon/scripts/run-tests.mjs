/* Runs the pure-logic test suite (scripts/logic.test.mjs).

   The tests import TypeScript source directly, so they are bundled with esbuild
   first (resolving the .ts + config imports) and then executed on Node. esbuild
   is fetched on demand via `npx` to avoid a devDependency that conflicts with
   Vite's pinned esbuild — nothing is added to the shipped bundle. */
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const entry = join(root, "scripts", "logic.test.mjs");
const out = join(mkdtempSync(join(tmpdir(), "parth-tests-")), "logic.mjs");

execFileSync(
  "npx",
  ["--yes", "esbuild@0.24.0", entry, "--bundle", "--platform=node", "--format=esm", `--outfile=${out}`],
  { stdio: ["ignore", "ignore", "inherit"], cwd: root },
);
execFileSync("node", [out], { stdio: "inherit" });
