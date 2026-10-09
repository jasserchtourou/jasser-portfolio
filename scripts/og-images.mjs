// Renders the 1200×630 Open Graph images into public/og/ from an HTML template.
// Usage: node scripts/og-images.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dataUrl = async (rel) => `data:image/webp;base64,${(await fs.readFile(path.join(root, 'public', rel))).toString('base64')}`;

const cards = [
  {
    file: 'home.png',
    eyebrow: 'Hannover, Germany',
    title: 'AI Backend Engineer',
    sub: 'RAG pipelines · multi-agent LLM systems · Python backends',
    accent: '#ff2d55',
    image: null,
  },
  {
    file: 'routeflow.png',
    eyebrow: 'Case study · flagship',
    title: 'RouteFlow',
    sub: 'Logistics platform · agentic RAG assistant · 3D warehouse twin',
    accent: '#60a5fa',
    image: '/images/routeflow/dashboard-800.webp',
  },
  {
    file: 'sentrymesh.png',
    eyebrow: 'Case study',
    title: 'SentryMesh',
    sub: 'LLM security gateway · AI governance by design',
    accent: '#22d3ee',
    image: '/images/sentrymesh/architecture-800.webp',
  },
];

const html = (c, img) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500&family=Inter:wght@400&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#0a0a0b;color:#f4f4f5;font-family:Inter,sans-serif;position:relative;overflow:hidden}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse at 30% 40%,#000 20%,transparent 75%)}
  .glow{position:absolute;width:760px;height:520px;left:-160px;top:-240px;border-radius:50%;background:${c.accent};opacity:.18;filter:blur(120px)}
  .content{position:absolute;left:72px;top:72px;bottom:72px;width:${img ? 560 : 1000}px;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:14px;font-family:'Space Grotesk';font-size:24px}
  .mark{width:44px;height:44px;border-radius:10px;background:#d6103c;display:grid;place-items:center;font-weight:600;font-size:18px;color:#fff}
  .eyebrow{margin-top:auto;font-family:'JetBrains Mono';font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:${c.accent}}
  h1{font-family:'Space Grotesk';font-weight:600;font-size:${img ? 92 : 104}px;line-height:.95;letter-spacing:-.02em;margin-top:18px}
  p{margin-top:22px;font-size:26px;line-height:1.35;color:#a8a8b2}
  .shot{position:absolute;right:-60px;top:110px;width:600px;border-radius:16px;border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 80px rgba(0,0,0,.6);transform:perspective(1400px) rotateY(-14deg) rotateX(4deg)}
</style></head><body>
<div class="grid"></div><div class="glow"></div>
${img ? `<img class="shot" src="${img}">` : ''}
<div class="content">
  <div class="brand"><div class="mark">JC</div>Jasser Chtourou</div>
  <div class="eyebrow">${c.eyebrow}</div>
  <h1>${c.title}</h1>
  <p>${c.sub}</p>
</div></body></html>`;

await fs.mkdir(path.join(root, 'public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  const img = c.image ? await dataUrl(c.image) : null;
  await page.setContent(html(c, img), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'public/og', c.file) });
  console.log('public/og/' + c.file);
}
await browser.close();
