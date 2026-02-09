// scripts/generate-icons.js
// Generates a set of PNG icons (including maskable) from a high-res source

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '..', 'public');
const candidates = [
  'icon-source.png',
  'logo.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png'
];

function findSource() {
  for (const name of candidates) {
    const p = path.join(publicDir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const src = findSource();
if (!src) {
  console.error('No source image found in public/. Put a high-res PNG named one of:', candidates.join(', '));
  process.exit(1);
}

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512];

async function generate() {
  console.log('Using source:', src);
  for (const s of sizes) {
    const out = path.join(publicDir, `icon-${s}x${s}.png`);
    await sharp(src).resize(s, s, { fit: 'cover' }).png({ quality: 90 }).toFile(out);
    console.log('Written', out);

    // maskable variant (same image but named with -maskable)
    const outMask = path.join(publicDir, `icon-${s}x${s}-maskable.png`);
    await sharp(src).resize(s, s, { fit: 'cover' }).png({ quality: 90 }).toFile(outMask);
    console.log('Written', outMask);
  }

  // also write android-chrome files expected by many manifests
  const android192 = path.join(publicDir, 'android-chrome-192x192.png');
  const android512 = path.join(publicDir, 'android-chrome-512x512.png');
  await sharp(src).resize(192, 192).png({ quality: 90 }).toFile(android192);
  await sharp(src).resize(512, 512).png({ quality: 90 }).toFile(android512});
  console.log('Written android-chrome-192x192.png and android-chrome-512x512.png');

  // apple-touch-icon
  const apple = path.join(publicDir, 'apple-touch-icon.png');
  await sharp(src).resize(180, 180).png({ quality: 90 }).toFile(apple);
  console.log('Written apple-touch-icon.png');

  console.log('Icon generation complete.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
