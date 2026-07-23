/**
 * Generates responsive AVIF + WebP delivery variants from the preserved
 * source PNG in public/images. The original is never overwritten or
 * upscaled — variants wider than the source are skipped.
 *
 * Run:  node scripts/optimize-images.mjs
 * (also runs automatically via `npm run build` through the "prebuild" hook)
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const DIR = "public/images";
const WIDTHS = [640, 960, 1440]; // + original where it is not wider
const SOURCES = ["parth-salon-interior.png"];

async function run() {
  for (const file of SOURCES) {
    const src = join(DIR, file);
    try {
      await stat(src);
    } catch {
      console.warn(`skip: ${src} not found`);
      continue;
    }
    const { name } = parse(file);
    const meta = await sharp(src).metadata();
    const targets = WIDTHS.filter((w) => w <= meta.width);
    // include the source width itself for high-density displays
    if (!targets.includes(meta.width)) targets.push(meta.width);

    for (const w of targets) {
      const base = sharp(src).resize({ width: w, withoutEnlargement: true });
      await base
        .clone()
        .avif({ quality: 58 })
        .toFile(join(DIR, `${name}-${w}.avif`));
      await base
        .clone()
        .webp({ quality: 72 })
        .toFile(join(DIR, `${name}-${w}.webp`));
      console.log(`✓ ${name}-${w}.avif / .webp`);
    }

    // A dedicated JPEG for social-preview (Open Graph) — max compatibility.
    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(DIR, `${name}-og.jpg`));
    console.log(`✓ ${name}-og.jpg`);
  }
  const out = (await readdir(DIR)).filter((f) => /\.(avif|webp)$/.test(f));
  console.log(`\nGenerated ${out.length} variants in ${DIR}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
