/**
 * Image pipeline for the site.
 *
 * 1. Derives genuine detail crops from the confirmed interior photograph
 *    (all real views of the actual salon — no invented imagery).
 * 2. Generates responsive AVIF + WebP delivery variants for the master photo
 *    and every crop. Originals are never upscaled — variants wider than the
 *    source are skipped. A social-preview JPEG is produced for the master.
 *
 * Run:  node scripts/optimize-images.mjs
 * (also runs automatically via `npm run build` through the "prebuild" hook)
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const DIR = "public/images";
const WIDTHS = [400, 640, 960, 1440]; // + original where it is not wider
const MASTER = "parth-salon-interior.png";

// Detail crops extracted from the master. Coordinates are in master pixels
// (master is 1526×1031). Each crop is a real region of the Parth Salon room.
const CROPS = [
  { name: "parth-salon-arches", left: 780, top: 90, width: 700, height: 800 },
  { name: "parth-salon-chairs", left: 430, top: 520, width: 820, height: 500 },
];

async function makeVariants(file, { og = false } = {}) {
  const src = join(DIR, file);
  const { name } = parse(file);
  const meta = await sharp(src).metadata();
  const targets = WIDTHS.filter((w) => w <= meta.width);
  if (!targets.includes(meta.width)) targets.push(meta.width);

  for (const w of targets) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 58 }).toFile(join(DIR, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(join(DIR, `${name}-${w}.webp`));
  }
  console.log(`✓ ${name} → ${targets.join(", ")}`);

  if (og) {
    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(DIR, `${name}-og.jpg`));
    console.log(`✓ ${name}-og.jpg`);
  }
}

async function run() {
  const master = join(DIR, MASTER);
  try {
    await stat(master);
  } catch {
    console.error(`Master image ${master} not found.`);
    process.exit(1);
  }

  // Derive crop source PNGs from the master (idempotent — regenerated each run).
  for (const c of CROPS) {
    await sharp(master)
      .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
      .png()
      .toFile(join(DIR, `${c.name}.png`));
  }

  await makeVariants(MASTER, { og: true });
  for (const c of CROPS) await makeVariants(`${c.name}.png`);

  const out = (await readdir(DIR)).filter((f) => /\.(avif|webp)$/.test(f));
  console.log(`\nGenerated ${out.length} variants in ${DIR}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
