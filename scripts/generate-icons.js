import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA icons from SVG...');

  // Standard 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // Standard 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // Apple Touch Icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Maskable 512x512 with 15% safe zone margin (padding on slate-900 background)
  const innerIcon = await sharp(svgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }, // #0f172a
    },
  })
    .composite([{ input: innerIcon, gravity: 'center' }])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // Favicon 48x48 png
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.resolve('public/favicon.ico'));
  console.log('Created favicon.ico');

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);
