// Accessibility (axe-core, WCAG 2.1 AA), keyboard order and frame-time checks.
// Usage: node scripts/qa-a11y-perf.mjs <baseUrl>
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const base = process.argv[2];
const routes = ['/', '/projects', '/work/sentrymesh', '/work/routeflow'];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });

for (const route of routes) {
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
    const page = await context.newPage();
    await page.goto(base + route, { waitUntil: 'load' });
    // Reveal everything first so axe sees final colours, not mid-animation opacity.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1500);
    if (reducedMotion === 'reduce') {
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const v = res.violations.map((x) => `${x.id} (${x.impact}) ×${x.nodes.length}: ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
      console.log(`AXE ${route}: ${v.length ? '\n  ' + v.join('\n  ') : 'no violations'}`);
    } else {
      // Frame timing while scrolling through the page (headless, software GL: a lower bound).
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      const stats = await page.evaluate(async () => {
        const frames = [];
        let last = performance.now();
        let running = true;
        const tick = (t) => {
          frames.push(t - last);
          last = t;
          if (running) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        const max = document.body.scrollHeight - innerHeight;
        for (let i = 0; i <= 60; i++) {
          window.scrollTo(0, (max * i) / 60);
          await new Promise((r) => setTimeout(r, 50));
        }
        running = false;
        frames.sort((a, b) => a - b);
        const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
        return { fps: Math.round(1000 / avg), p95: Math.round(frames[Math.floor(frames.length * 0.95)]) };
      });
      console.log(`FPS ${route}: avg ${stats.fps} fps, p95 frame ${stats.p95} ms`);
    }
    await context.close();
  }
}

// Keyboard: the first tab stops on the home page.
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + '/', { waitUntil: 'load' });
const order = [];
for (let i = 0; i < 9; i++) {
  await page.keyboard.press('Tab');
  order.push(await page.evaluate(() => {
    const el = document.activeElement;
    const visible = getComputedStyle(el).outlineStyle !== 'none';
    return `${el.tagName.toLowerCase()}:${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 28)}${visible ? '' : ' [NO FOCUS RING]'}`;
  }));
}
console.log('TAB ORDER /:', order.join(' → '));
await browser.close();
