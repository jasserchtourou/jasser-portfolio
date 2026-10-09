// Visual QA: full-page screenshots at 375 / 768 / 1440 px plus console errors and horizontal overflow.
// Usage: node scripts/qa-screens.mjs <baseUrl> <outDir> [path ...] [--reduced]
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const reduced = args.includes('--reduced');
const [base, outDir, ...paths] = args.filter((a) => !a.startsWith('--'));
const routes = paths.length ? paths : ['/'];
const widths = [375, 768, 1440];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
let problems = 0;

for (const route of routes) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 812 : 900 },
      reducedMotion: reduced ? 'reduce' : 'no-preference',
      hasTouch: width < 768,
      isMobile: width < 768,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && !m.text().startsWith('Failed to load resource') && errors.push(`${m.type()}: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.url().replace(base, '')}`));
    await page.goto(base + route, { waitUntil: 'load' });
    // Scroll through so scroll-triggered reveals and lazy sections run.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `${route.replace(/\W+/g, '_') || 'home'}-${width}${reduced ? '-reduced' : ''}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: true });
    const status = [overflow > 0 ? `OVERFLOW ${overflow}px` : 'no overflow', ...errors].join(' | ');
    if (overflow > 0 || errors.length) problems++;
    console.log(`${route} @${width}: ${status}`);
    await context.close();
  }
}
await browser.close();
process.exitCode = problems ? 1 : 0;
