// Captures the La Forêt hotel website (client project with Kamka IT) at desktop and mobile size.
// Usage: node scripts/capture-laforet.mjs
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const URL = 'https://laforet.charmehotels.com.tn';
const outDir = path.resolve('public/images/laforet');

const shots = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1, widths: [1440, 800] },
  { name: 'mobile', viewport: { width: 375, height: 812 }, scale: 2, widths: [750] },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: shot.viewport, deviceScaleFactor: shot.scale });
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  // Let entrance animations and lazy images settle.
  await page.waitForTimeout(5000);
  const png = await page.screenshot({ type: 'png' });
  for (const width of shot.widths) {
    const file = path.join(outDir, `${shot.name}-${width}.webp`);
    const info = await sharp(png).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file);
    console.log(path.relative(process.cwd(), file), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
  await page.close();
}
await browser.close();
