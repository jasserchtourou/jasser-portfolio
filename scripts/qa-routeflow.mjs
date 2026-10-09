// Visual QA for the RouteFlow hero: viewport screenshots of the WebGL ring at several scroll
// positions (desktop), plus the 2D fallback on mobile / reduced motion. Reports console errors.
// Usage: node scripts/qa-routeflow.mjs <baseUrl> <outDir>
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const [base, outDir] = process.argv.slice(2);
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });

async function run(name, ctxOpts, positions, after, query = '') {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${base}/work/routeflow${query}`, { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => ({
    canvas: !!document.querySelector('canvas'),
    trackHeight: document.querySelector('.pano-track')?.offsetHeight,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }));
  for (const y of positions) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(outDir, `${name}-${y}.png`) });
  }
  if (after) await after(page);
  console.log(name, JSON.stringify(info), errors.length ? `ERRORS: ${errors.join(' | ')}` : 'no console errors');
  await ctx.close();
}

await run('desktop', { viewport: { width: 1440, height: 900 } }, [0, 700, 1500], async (page) => {
  // Drag the ring and press "next" to check both inputs.
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(800);
  await page.mouse.move(900, 600);
  await page.mouse.down();
  await page.mouse.move(500, 600, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, 'desktop-drag.png') });
  // Architecture map mid-animation.
  await page.locator('#architecture').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelector('#architecture figure')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(5200);
  await page.screenshot({ path: path.join(outDir, 'desktop-architecture.png') });
});
await run('tablet', { viewport: { width: 768, height: 1024 } }, [0]);
await run('mobile', { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true }, [0], async (page) => {
  await page.evaluate(() => document.querySelector('#architecture figure')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(4500);
  await page.screenshot({ path: path.join(outDir, 'mobile-architecture.png') });
});
await run('desktop2d', { viewport: { width: 1440, height: 900 } }, [0, 900], null, '?no3d');
await run('reduced', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, [0]);
await browser.close();
