/**
 * Generate iOS splash screen images from the app icon.
 * Uses sharp to create properly sized images with the icon centered
 * on the app's background color.
 *
 * Run: node scripts/generate-splash.mjs
 */

import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ICON_PATH = resolve(ROOT, 'src/assets/images/icon.png');
const OUT_DIR = resolve(ROOT, 'public/splash');

mkdirSync(OUT_DIR, { recursive: true });

// Background color matching the app's page color
const BG_COLOR = '#f3f4f6';

// Icon size as a fraction of the shortest screen dimension
const ICON_RATIO = 0.3;

// All iOS splash screen sizes: [width, height, filename suffix]
const SCREENS = [
  // iPhones (portrait)
  [640, 1136, 'iphone5'],
  [750, 1334, 'iphone6'],
  [1242, 2208, 'iphone6plus'],
  [1125, 2436, 'iphonex'],
  [828, 1792, 'iphonexr'],
  [1242, 2688, 'iphonexsmax'],
  [1080, 2340, 'iphone12mini'],
  [1170, 2532, 'iphone12'],
  [1284, 2778, 'iphone12promax'],
  [1179, 2556, 'iphone14pro'],
  [1290, 2796, 'iphone14promax'],
  // iPads (portrait)
  [1536, 2048, 'ipad'],
  [1668, 2224, 'ipadpro105'],
  [1668, 2388, 'ipadpro11'],
  [2048, 2732, 'ipadpro129'],
  // Landscape variants for iPads
  [2048, 1536, 'ipad-landscape'],
  [2224, 1668, 'ipadpro105-landscape'],
  [2388, 1668, 'ipadpro11-landscape'],
  [2732, 2048, 'ipadpro129-landscape'],
];

async function generate() {
  const iconBuffer = await sharp(ICON_PATH).png().toBuffer();

  for (const [width, height, name] of SCREENS) {
    const iconSize = Math.round(Math.min(width, height) * ICON_RATIO);
    const resizedIcon = await sharp(iconBuffer)
      .resize(iconSize, iconSize)
      .toBuffer();

    const left = Math.round((width - iconSize) / 2);
    const top = Math.round((height - iconSize) / 2);

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: BG_COLOR,
      },
    })
      .composite([{ input: resizedIcon, left, top }])
      .png()
      .toFile(resolve(OUT_DIR, `splash-${name}.png`));

    console.log(`✓ splash-${name}.png (${width}×${height})`);
  }

  console.log(`\nDone! ${SCREENS.length} splash screens generated.`);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
