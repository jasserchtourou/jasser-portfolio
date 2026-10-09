// Frame-rate probe for /work/routeflow (3D vs 2D). GPU=1 uses the real GPU via ANGLE/D3D11;
// without it Chromium falls back to SwiftShader software GL, which is far slower than real hardware.
// Usage: [GPU=1] node scripts/qa-fps.mjs <baseUrl> <path> [path ...]
import { chromium } from 'playwright';
const [base, ...variants] = process.argv.slice(2);
const browser = await chromium.launch({ args: process.env.GPU ? ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist', '--enable-gpu'] : ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
for (const v of variants) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + v, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(async () => {
    const measure = async (fn) => {
      const f = []; let last = performance.now(), run = true;
      const tick = (t) => { f.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); await fn(); run = false;
      return Math.round(1000 / (f.reduce((a, b) => a + b, 0) / f.length));
    };
    const idleTop = await measure(() => new Promise((r) => setTimeout(r, 2000)));
    const scrollHero = await measure(async () => { for (let i = 0; i < 40; i++) { scrollTo(0, i * 40); await new Promise((r) => setTimeout(r, 50)); } });
    const arch = document.querySelector('#architecture figure'); arch?.scrollIntoView({ block: 'center' });
    const idleArch = await measure(() => new Promise((r) => setTimeout(r, 2000)));
    const gl = document.createElement('canvas').getContext('webgl2'); const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    return { canvas: !!document.querySelector('canvas'), renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '?', idleTop, scrollHero, idleArch };
  });
  console.log(v, JSON.stringify(r));
  await ctx.close();
}
await browser.close();
