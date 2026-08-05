/**
 * Encodes the supplied hero frame sequence into two web-ready sets.
 *
 * The source is 240 JPEG frames at 1280x720 (~9.7MB). Shipping all of them as
 * WebP would be ~13MB, so the sequence is decimated: scroll scrubbing needs
 * enough frames that consecutive scroll positions do not visibly jump, not
 * broadcast frame rate. Over a ~200svh track, 120 frames is roughly one frame
 * per 17px of scroll, which reads as continuous.
 *
 * WebP rather than AVIF: AVIF is ~30% smaller here but decodes noticeably
 * slower, and a scrub sequence decodes a new frame on almost every animation
 * frame. Decode speed wins.
 *
 *   node scripts/encode-hero-frames.mjs <source-dir>
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const SOURCE = process.argv[2] ?? "/tmp/ezgif";
const OUT_ROOT = path.resolve("public/media/hero");

/** Desktop and mobile ladders. `every` decimates the source sequence. */
const VARIANTS = [
  { name: "desktop", every: 2, width: 1152, quality: 62 },
  { name: "mobile", every: 4, width: 720, quality: 64 },
];

async function main() {
  const files = (await readdir(SOURCE))
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort();

  if (files.length === 0) throw new Error(`No frames found in ${SOURCE}`);
  console.log(`source: ${files.length} frames`);

  const manifest = { source: { count: files.length }, variants: {} };

  for (const variant of VARIANTS) {
    const dir = path.join(OUT_ROOT, variant.name);
    await mkdir(dir, { recursive: true });

    const picked = files.filter((_, index) => index % variant.every === 0);
    let bytes = 0;

    for (const [index, file] of picked.entries()) {
      const buffer = await sharp(path.join(SOURCE, file))
        .resize({ width: variant.width })
        .webp({ quality: variant.quality, effort: 6 })
        .toBuffer();

      const name = `${String(index + 1).padStart(4, "0")}.webp`;
      await writeFile(path.join(dir, name), buffer);
      bytes += buffer.length;
    }

    manifest.variants[variant.name] = {
      count: picked.length,
      width: variant.width,
      pattern: `/media/hero/${variant.name}/{i}.webp`,
      bytes,
    };

    console.log(
      `${variant.name}: ${picked.length} frames @ ${variant.width}w = ` +
        `${(bytes / 1024 / 1024).toFixed(2)}MB (${Math.round(bytes / picked.length / 1024)}KB avg)`,
    );
  }

  // Posters: first and last frame, used before the sequence loads, under
  // reduced motion, and as the no-JavaScript fallback.
  const first = path.join(SOURCE, files[0]);
  const last = path.join(SOURCE, files[files.length - 1]);
  await mkdir(OUT_ROOT, { recursive: true });

  for (const [label, file] of [
    ["poster-start", first],
    ["poster-end", last],
  ]) {
    await sharp(file).resize({ width: 1600 }).webp({ quality: 74, effort: 6 })
      .toFile(path.join(OUT_ROOT, `${label}.webp`));
  }

  const meta = await sharp(first).metadata();
  manifest.aspectRatio = Number((meta.width / meta.height).toFixed(4));

  await writeFile(
    path.resolve("data/hero-frames.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  console.log(`aspect ratio ${manifest.aspectRatio}; manifest written`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
