// Pre-optimizes floor artwork from src/assets/floors/*.png into
// public/floors/<name>-<width>.webp. Runs as `prebuild` so the parallax
// layers never ship multi-MB PNGs. Re-run after dropping new artwork
// (e.g. foreground layers) into src/assets/floors/.
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = new URL('../src/assets/floors/', import.meta.url).pathname;
const OUT_DIR = new URL('../public/floors/', import.meta.url).pathname;
const WIDTHS = [1280, 1920, 2560];
const QUALITY = 75;

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name;
  const input = sharp(path.join(SRC_DIR, file));
  const { width } = await input.metadata();

  for (const w of WIDTHS) {
    if (w > width) continue;
    const out = path.join(OUT_DIR, `${name}-${w}.webp`);
    await input.clone().resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
    console.log(`✓ ${path.relative(process.cwd(), out)}`);
  }
}
