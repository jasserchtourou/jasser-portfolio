// Captures RouteFlow (running locally via docker compose) at desktop and mobile size and writes
// optimized WebP files to public/images/routeflow/. Uses the real GPU (ANGLE/D3D11) so the
// React Three Fiber views render properly.
// Usage: node scripts/capture-routeflow.mjs [baseUrl=http://localhost:3000] [warehouseId]
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:3000';
const site = process.argv[3]; // warehouse id for the 3D site view
const out = path.resolve('public/images/routeflow');
await fs.mkdir(out, { recursive: true });

// Desktop shots are 4:3 so every panel of the portfolio's 3D ring has the same proportions.
const pages = [
  { name: 'dashboard', url: '/dashboard', wait: 5000 },
  { name: 'network-3d', url: '/warehouses', wait: 9000 },
  ...(site
    ? [
        { name: 'warehouse-3d-night', url: `/warehouses/${site}/3d?theme=night`, wait: 12000 },
        { name: 'warehouse-3d-day', url: `/warehouses/${site}/3d?theme=day`, wait: 12000 },
      ]
    : []),
  { name: 'routes', url: '/routes?view=at-risk', wait: 4000 },
  { name: 'shipments', url: '/shipments?open=SHP-2205', wait: 5000 },
  { name: 'tracking', url: '/tracking', wait: 7000 },
  { name: 'orders', url: '/orders', wait: 4000 },
  { name: 'events', url: '/events', wait: 4000 },
];
const mobilePages = [
  { name: 'm-dashboard', url: '/dashboard', wait: 5000 },
  { name: 'm-shipments', url: '/shipments', wait: 4000 },
  { name: 'm-routes', url: '/routes', wait: 4000 },
];

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist', '--enable-gpu'] });

async function shoot(list, ctxOpts, widths) {
  const ctx = await browser.newContext(ctxOpts);
  for (const p of list) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + p.url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(p.wait);
    const png = await page.screenshot({ type: 'png' });
    for (const w of widths) {
      const file = path.join(out, `${p.name}-${w}.webp`);
      const info = await sharp(png).resize({ width: w }).webp({ quality: 80, effort: 6 }).toFile(file);
      console.log(path.relative(process.cwd(), file), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`, errors.join(' | '));
    }
    await page.close();
  }
  await ctx.close();
}

await shoot(pages, { viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 }, [1600, 800]);
await shoot(mobilePages, { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, [750]);
await browser.close();
