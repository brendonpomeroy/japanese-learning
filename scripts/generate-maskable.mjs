/**
 * Generate Android maskable icons with safe-zone padding.
 * Maskable icons need ~10% padding on each side so content
 * isn't clipped when the OS applies adaptive icon shapes.
 *
 * Run: node scripts/generate-maskable.mjs
 */

import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ICON_PATH = resolve(ROOT, 'src/assets/images/icon.png');
const OUT_DIR = resolve(ROOT, 'public/icons');

mkdirSync(OUT_DIR, { recursive: true });

// Background color for the padding area
const BG_COLOR = '#2563eb';

// Safe zone: icon content is 80% of total, 10% padding each side
const SAFE_ZONE_RATIO = 0.8;

const SIZES = [192, 512];

async function generate() {
  for (const size of SIZES) {
    const innerSize = Math.round(size * SAFE_ZONE_RATIO);

    const resizedIcon = await sharp(ICON_PATH)
      .resize(innerSize, innerSize)
      .toBuffer();

    const padding = Math.round((size - innerSize) / 2);

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG_COLOR,
      },
    })
      .composite([{ input: resizedIcon, left: padding, top: padding }])
      .png()
      .toFile(resolve(OUT_DIR, `maskable-${size}x${size}.png`));

    console.log(`✓ maskable-${size}x${size}.png`);
  }

  console.log('\nDone! Maskable icons generated.');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
