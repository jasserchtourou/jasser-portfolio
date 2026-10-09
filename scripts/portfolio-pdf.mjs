// Generates the PDF portfolio (A4 landscape, dark, same identity as the site) from src/data.
// Usage: node scripts/portfolio-pdf.mjs [outFile=Jasser_Chtourou_Portfolio.pdf]
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = process.cwd();
const outFile = path.resolve(process.argv[2] ?? 'Jasser_Chtourou_Portfolio.pdf');

// The data files are dependency-free ES modules; load them without a bundler.
const load = async (file) => {
  const src = await fs.readFile(path.join(root, 'src/data', file), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(src).toString('base64')}`);
};
const { profile, education, certifications, languages, SITE_URL } = await load('profile.js');
const { experience, internships } = await load('experience.js');
const { skills } = await load('skills.js');
const { projects } = await load('projects.js');
const rf = await load('routeflow.js');
const { sentrymesh: sm } = await load('sentrymesh.js');

const img = async (rel, width = 1100) => {
  const buf = await sharp(path.join(root, 'public', rel)).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const host = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const chips = (list) => `<div class="chips">${list.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>`;
const link = (href, label) => `<a href="${href}">${esc(label ?? host(href))}</a>`;

const P = Object.fromEntries(projects.map((p) => [p.slug, p]));
const total = 10;
const footer = (n, title) =>
  `<footer><span>${esc(profile.name)} · ${esc(profile.role)}</span><span>${esc(title)}</span><span>${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></footer>`;

const images = {
  photo: await img('images/jasser-photo.webp', 400),
  rfDash: await img('images/routeflow/dashboard-1600.webp'),
  rfNight: await img('images/routeflow/warehouse-3d-night-1600.webp', 800),
  rfNetwork: await img('images/routeflow/network-3d-1600.webp', 800),
  rfRoutes: await img('images/routeflow/routes-1600.webp', 800),
  rfShip: await img('images/routeflow/shipments-1600.webp', 800),
  smArch: await img('images/sentrymesh/architecture-1600.webp'),
  plug: await img('images/plug-chat/poster.webp', 700),
  laforet: await img('images/laforet/desktop-1440.webp', 700),
  db: await img('images/projects/db-delay.webp', 700),
  surgical: await img('images/projects/surgical-chatbot.webp', 700),
};

const statsCover = [
  { v: '3+', l: 'years building production backends' },
  { v: '2M+', l: 'users served by the Keejob backend I contributed to' },
  { v: '1,000+', l: 'monthly uses of my multi-tenant RAG system' },
  { v: '80%', l: 'fewer document errors from my rule engine' },
];

const role = (r) => `
  <div class="role">
    <div class="role-meta"><b>${esc(r.period)}</b><span>${esc(r.location ?? '')}</span>${r.current ? '<em>Current</em>' : ''}</div>
    <div>
      <h3>${esc(r.role)} <span class="muted">· ${esc(r.company)}</span></h3>
      <p class="sub">${esc([r.context, r.type].filter(Boolean).join(' · '))}</p>
      <ul>${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      ${r.link ? `<p class="small">${link(r.link.href, r.link.label)}</p>` : ''}
    </div>
  </div>`;

const projectRow = (p, image) => `
  <div class="proj ${image ? '' : 'noimg'}">
    ${image ? `<div class="thumb"><img src="${image}" alt=""></div>` : ''}
    <div>
      <p class="kicker">${esc(p.kind)}</p>
      <h3>${esc(p.title)}</h3>
      <p class="tag">${esc(p.tagline)}</p>
      <p class="body">${esc(p.summary)}</p>
      ${chips(p.stack)}
      <p class="links">${[
        p.caseStudy && link(SITE_URL + p.caseStudy, 'Case study'),
        p.live && link(p.live, 'Live: ' + host(p.live)),
        p.repo && link(p.repo, 'Code on GitHub'),
        p.youtube && link(`https://www.youtube.com/watch?v=${p.youtube.id}`, 'Demo video'),
        p.video && p.post && link(p.post, 'Demo video (LinkedIn)'),
      ]
        .filter(Boolean)
        .join('<i>·</i>')}</p>
    </div>
  </div>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --ink:#0a0a0b; --panel:#121215; --raised:#1a1a1f; --line:rgba(255,255,255,.09); --fg:#f4f4f5; --muted:#a8a8b2; --subtle:#8a8a96; --accent:#ff2d55; --soft:#ff6e82; --flow:#60a5fa; --cyan:#67e8f9; --amber:#fbbf24; }
html, body { background: var(--ink); color: var(--fg); font-family: Inter, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,.25); }
.page { width: 297mm; height: 210mm; padding: 14mm 16mm 12mm; position: relative; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; }
.page::before { content:''; position:absolute; inset:0; background-image: linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size: 9mm 9mm; mask-image: radial-gradient(ellipse at 20% 0%, #000 10%, transparent 60%); pointer-events:none; }
.glow { position:absolute; border-radius:50%; filter: blur(70px); opacity:.18; pointer-events:none; }
footer { margin-top: auto; padding-top: 5mm; display:flex; justify-content:space-between; font: 500 8pt 'JetBrains Mono'; color: var(--subtle); border-top: 1px solid var(--line); }
.eyebrow { font: 500 8pt 'JetBrains Mono'; letter-spacing: .18em; text-transform: uppercase; color: var(--soft); }
.eyebrow.flow { color: var(--flow); } .eyebrow.cyan { color: var(--cyan); }
h1, h2, h3 { font-family: 'Space Grotesk'; letter-spacing: -.01em; }
h2 { font-size: 24pt; font-weight: 600; line-height: 1.05; margin-top: 2.5mm; }
h3 { font-size: 11.5pt; font-weight: 600; }
p, li { font-size: 9pt; line-height: 1.45; color: var(--muted); }
.muted { color: var(--muted); font-weight: 500; }
.small { font-size: 8pt; margin-top: 1.5mm; }
.sub { font-size: 8pt; color: var(--subtle); margin-top: .5mm; }
.card { background: rgba(18,18,21,.85); border: 1px solid var(--line); border-radius: 4mm; padding: 5mm; }
.chips { display:flex; flex-wrap:wrap; gap: 1.2mm; margin-top: 2mm; }
.chip { font: 400 6.8pt 'JetBrains Mono'; color: var(--muted); border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.03); border-radius: 99px; padding: .7mm 2mm; }
.grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.grid3 { display:grid; grid-template-columns: repeat(3,1fr); gap: 4mm; }
.stats { display:grid; grid-template-columns: repeat(4,1fr); border:1px solid var(--line); border-radius: 4mm; overflow:hidden; }
.stats > div { padding: 4.5mm 5mm; border-right: 1px solid var(--line); }
.stats > div:last-child { border-right: 0; }
.stats b { display:block; font: 600 20pt 'Space Grotesk'; color: var(--fg); }
.stats span { font-size: 7.8pt; color: var(--muted); line-height: 1.35; display:block; margin-top: 1mm; }
.shot { border-radius: 3mm; border: 1px solid rgba(255,255,255,.12); overflow:hidden; box-shadow: 0 10mm 20mm rgba(0,0,0,.5); }
.shot img { display:block; width:100%; }
/* cover */
.cover h1 { font-size: 54pt; font-weight: 600; line-height: .95; margin-top: 7mm; }
.cover .lead { font: 500 17pt 'Space Grotesk'; color: var(--muted); margin-top: 4mm; max-width: 175mm; }
.cover .lead b { color: var(--soft); font-weight: 500; }
.contact { display:flex; flex-wrap:wrap; gap: 2mm 6mm; margin-top: 7mm; font-size: 9pt; }
.contact a { color: var(--fg); }
.brand { display:flex; align-items:center; gap: 3mm; font: 600 12pt 'Space Grotesk'; }
.mark { width: 9mm; height: 9mm; border-radius: 2mm; background:#d6103c; display:grid; place-items:center; font-size: 9pt; color:#fff; }
/* experience */
.role { display:grid; grid-template-columns: 34mm 1fr; gap: 5mm; padding: 3.4mm 0; border-top: 1px solid var(--line); }
.role-meta b { display:block; font: 500 8pt 'JetBrains Mono'; color: var(--fg); }
.role-meta span { display:block; font-size: 7.5pt; color: var(--subtle); margin-top: .5mm; }
.role-meta em { display:inline-block; margin-top: 1.5mm; font: normal 500 6.8pt 'JetBrains Mono'; letter-spacing: .14em; text-transform: uppercase; color: var(--soft); }
.role ul { margin-top: 1.2mm; padding-left: 0; list-style: none; }
.role li { position: relative; padding-left: 4mm; font-size: 8.4pt; line-height: 1.4; margin-top: .6mm; }
.role li::before { content:''; position:absolute; left:0; top: 2.1mm; width: 2.3mm; height: 1px; background: var(--accent); }
/* projects */
.proj { display:grid; grid-template-columns: 62mm 1fr; gap: 5mm; padding: 3.2mm 0; border-top: 1px solid var(--line); }
.proj.noimg { grid-template-columns: 1fr; }
.dense .proj { padding: 2.2mm 0; }
.dense .body { font-size: 7.8pt; line-height: 1.4; }
.dense .chips { margin-top: 1.4mm; }
.dense .links { margin-top: 1.2mm; }
.dense h2 { font-size: 21pt; }
.proj .thumb { border-radius: 2.5mm; overflow:hidden; border: 1px solid var(--line); aspect-ratio: 16/9; }
.proj .thumb img { width:100%; height:100%; object-fit: cover; object-position: top; }
.kicker { font: 500 6.8pt 'JetBrains Mono'; letter-spacing: .14em; text-transform: uppercase; color: var(--subtle); }
.proj h3 { margin-top: .8mm; }
.tag { font-size: 8.6pt; color: rgba(244,244,245,.88); }
.body { font-size: 8.2pt; margin-top: 1mm; }
.links { font-size: 7.8pt; margin-top: 1.8mm; color: var(--fg); }
.links i { font-style: normal; color: var(--subtle); margin: 0 2mm; }
.facts { display:grid; grid-template-columns: repeat(3,1fr); gap: 3mm; }
.facts div { background: rgba(18,18,21,.85); border:1px solid var(--line); border-radius: 3mm; padding: 3mm 3.5mm; }
.facts b { display:block; font: 600 16pt 'Space Grotesk'; color: var(--flow); }
.facts span { font-size: 7.4pt; color: var(--muted); }
.mono { font-family: 'JetBrains Mono'; }
.flow { color: var(--flow); }
.arch { display:grid; grid-template-columns: repeat(5, 1fr); gap: 2.5mm; align-items: center; }
.node { border: 1px solid rgba(255,255,255,.14); background: var(--raised); border-radius: 2.5mm; padding: 2.2mm; text-align:center; }
.node b { display:block; font: 600 8.4pt 'Space Grotesk'; }
.node span { font: 400 6.6pt 'JetBrains Mono'; color: var(--muted); }
.node.hot { border-color: rgba(96,165,250,.7); background: rgba(30,41,59,.9); }
.lane { font: 500 6.8pt 'JetBrains Mono'; letter-spacing:.14em; text-transform:uppercase; color: var(--flow); margin: 2.5mm 0 1.2mm; }
.run p { font-size: 8.2pt; }
.run .q { color: var(--fg); }
.tool { font: 400 7.6pt 'JetBrains Mono'; color: var(--muted); margin-top: 1mm; }
.tool b { color: var(--flow); font-weight: 500; }
.tool i { font-style: normal; color: #6ee7b7; margin-left: 2mm; }
.lesson b { display:block; font: 600 9.5pt 'Space Grotesk'; color: var(--fg); margin-bottom: .8mm; }
.lesson .m { font: 600 12pt 'Space Grotesk'; color: var(--flow); }
.lesson .m s { color: var(--subtle); text-decoration-color: var(--accent); margin-right: 2mm; }
.steps { display:grid; grid-template-columns: repeat(5,1fr); gap: 2.5mm; }
.steps div { border:1px solid var(--line); border-radius: 2.5mm; padding: 2.5mm; background: rgba(18,18,21,.85); }
.steps b { display:block; font: 600 9pt 'Space Grotesk'; }
.steps span { font: 500 7pt 'JetBrains Mono'; color: var(--cyan); }
.steps p { font-size: 7.4pt; margin-top: .8mm; }
.path h3 { font-size: 10pt; margin-top: 1.5mm; }
.badge { display:inline-block; font: 500 6.6pt 'JetBrains Mono'; letter-spacing:.12em; text-transform:uppercase; border:1px solid; border-radius: 1.2mm; padding: .5mm 1.5mm; }
.path li { font-size: 7.8pt; list-style: none; margin-top: .6mm; }
.path li::before { content:'→ '; color: var(--subtle); }
.skillgrid { display:grid; grid-template-columns: repeat(4,1fr); border:1px solid var(--line); border-radius: 3mm; overflow:hidden; }
.skillgrid div { padding: 3mm 3.5mm; border-right:1px solid var(--line); border-bottom:1px solid var(--line); }
.skillgrid div:nth-child(4n) { border-right: 0; }
.skillgrid div:nth-last-child(-n+4) { border-bottom: 0; }
.skillgrid h4 { font: 500 6.8pt 'JetBrains Mono'; letter-spacing:.14em; text-transform:uppercase; color: var(--soft); }
.skillgrid p { font-size: 7.8pt; margin-top: 1.2mm; color: rgba(244,244,245,.85); line-height: 1.5; }
.certs { columns: 3; column-gap: 7mm; }
.certs .g { break-inside: avoid; margin-bottom: 3.5mm; }
.certs h4 { font: 500 6.8pt 'JetBrains Mono'; letter-spacing:.14em; text-transform:uppercase; color: var(--subtle); margin-bottom: 1mm; }
.certs li { list-style:none; font-size: 8pt; color: rgba(244,244,245,.88); margin-top: .7mm; line-height: 1.35; }
.certs li span { color: var(--muted); }
</style></head><body>

<!-- 1 · Cover -->
<section class="page cover">
  <div class="glow" style="width:180mm;height:120mm;left:-40mm;top:-60mm;background:var(--accent)"></div>
  <div class="brand"><div class="mark">JC</div>${esc(profile.name)}</div>
  <div style="display:grid;grid-template-columns:1fr 52mm;gap:10mm;align-items:end;margin-top:16mm">
    <div>
      <p class="eyebrow">Portfolio · ${esc(profile.location)}</p>
      <h1>${esc(profile.role)}.</h1>
      <p class="lead">I build the backend that puts <b>LLMs</b> into production.</p>
      <p style="margin-top:5mm;font-size:10pt;max-width:170mm">${esc(profile.summary[0])} RAG pipelines, multi-agent orchestration, REST APIs, data pipelines and async processing, from architecture to deployment.</p>
    </div>
    <div class="shot" style="border-radius:4mm"><img src="${images.photo}" alt=""></div>
  </div>
  <div class="stats" style="margin-top:10mm">${statsCover.map((s) => `<div><b>${s.v}</b><span>${esc(s.l)}</span></div>`).join('')}</div>
  <div class="contact">
    ${link('mailto:' + profile.contact.email, profile.contact.email)}
    ${link(SITE_URL, host(SITE_URL))}
    ${link(profile.contact.linkedin, 'linkedin.com/in/jasser-chtourou')}
    ${link(profile.contact.github, 'github.com/jasserchtourou')}
    <span class="muted">${esc(profile.workPermit)} · ${esc(profile.availability)}</span>
  </div>
  ${footer(1, 'Cover')}
</section>

<!-- 2 · Experience -->
<section class="page">
  <p class="eyebrow">Experience</p>
  <h2>What I built, and where.</h2>
  <div style="margin-top:5mm">${experience.slice(0, 4).map(role).join('')}</div>
  ${footer(2, 'Experience')}
</section>

<!-- 3 · Earlier experience + education -->
<section class="page">
  <div class="grid2" style="grid-template-columns:1.15fr 1fr;gap:10mm">
    <div>
      <p class="eyebrow">Experience, continued</p>
      <div style="margin-top:3mm">${experience.slice(4).map(role).join('')}</div>
      <p class="eyebrow" style="margin-top:6mm">Mandatory university internships</p>
      <div style="margin-top:3mm">${internships.map(role).join('')}</div>
    </div>
    <div>
      <p class="eyebrow">Education</p>
      ${education
        .map(
          (e) => `<div class="card" style="margin-top:3mm;padding:4.5mm">
          <h3>${esc(e.degree)}</h3>
          <p class="sub">${esc(e.institution)} · ${esc(e.location)} · ${esc(e.period)}</p>
          ${e.notes.length ? `<ul style="margin-top:2mm;list-style:none">${e.notes.map((n) => `<li style="font-size:8.4pt;margin-top:.6mm">${esc(n)}</li>`).join('')}</ul>` : ''}
        </div>`,
        )
        .join('')}
      <p class="eyebrow" style="margin-top:7mm">Languages</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-top:3mm">
        ${languages.map((l) => `<div><h3 style="font-size:10pt">${esc(l.name)}</h3><p class="sub">${esc(l.level)}</p></div>`).join('')}
      </div>
    </div>
  </div>
  ${footer(3, 'Experience & education')}
</section>

<!-- 4 · Skills -->
<section class="page">
  <p class="eyebrow">Skills</p>
  <h2>The stack I work in.</h2>
  <div class="skillgrid" style="margin-top:6mm">${skills.map((g) => `<div style="padding:4.5mm 5mm"><h4>${esc(g.group)}</h4><p style="font-size:8.8pt">${g.items.map(esc).join(' · ')}</p></div>`).join('')}</div>
  <p class="eyebrow" style="margin-top:8mm">Highlighted certifications</p>
  <div class="grid3" style="margin-top:3mm">
    ${certifications.featured.map((c) => `<div class="card" style="padding:4mm"><h3 style="font-size:9.5pt">${esc(c.name)}</h3><p class="sub" style="margin-top:1mm">${esc([c.issuer, c.date, c.status].filter(Boolean).join(' · '))}</p></div>`).join('')}
  </div>
  <p class="small" style="margin-top:3mm">All ${certifications.total} certifications are listed on the last page.</p>
  ${footer(4, 'Skills')}
</section>

<!-- 4 · RouteFlow overview -->
<section class="page">
  <div class="glow" style="width:200mm;height:120mm;right:-60mm;top:-50mm;background:var(--flow)"></div>
  <div style="display:grid;grid-template-columns:1fr 1.25fr;gap:9mm">
    <div>
      <p class="eyebrow flow">Flagship case study · solo project</p>
      <h2 style="font-size:36pt">RouteFlow</h2>
      <p style="font-size:11pt;color:var(--fg);margin-top:3mm">${esc(P.routeflow.tagline)}.</p>
      ${rf.routeflowProblem.body.map((b) => `<p style="margin-top:3mm">${esc(b)}</p>`).join('')}
      ${chips(P.routeflow.stack)}
      <p class="links">${link(SITE_URL + '/work/routeflow', 'Interactive case study')}<i>·</i>${link(rf.routeflowRepo, 'github.com/jasserchtourou/RouteFlow')}</p>
    </div>
    <div>
      <div class="shot"><img src="${images.rfDash}" alt=""></div>
      <div class="grid3" style="margin-top:4mm;gap:3mm">
        <div class="shot"><img src="${images.rfNetwork}" alt=""></div>
        <div class="shot"><img src="${images.rfNight}" alt=""></div>
        <div class="shot"><img src="${images.rfRoutes}" alt=""></div>
      </div>
    </div>
  </div>
  <div class="facts" style="margin-top:6mm;grid-template-columns:repeat(6,1fr)">
    ${rf.routeflowFacts.map((f) => `<div><b>${f.value}</b><span>${esc(f.label)}</span></div>`).join('')}
  </div>
  ${footer(5, 'RouteFlow')}
</section>

<!-- 5 · RouteFlow architecture, real run, lessons -->
<section class="page">
  <p class="eyebrow flow">RouteFlow · architecture</p>
  <h2>One monolith, three kinds of traffic.</h2>
  <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:8mm;margin-top:5mm">
    <div>
      <p class="lane">Operations request</p>
      <div class="arch">
        <div class="node hot"><b>Next.js 15 UI</b><span>TanStack Query</span></div>
        <div class="node hot"><b>API router</b><span>/api/v1 · thin</span></div>
        <div class="node hot"><b>Services</b><span>business rules</span></div>
        <div class="node hot"><b>Repositories</b><span>queries only</span></div>
        <div class="node hot"><b>PostgreSQL 16</b><span>async SQLAlchemy</span></div>
      </div>
      <p class="lane">Agentic question</p>
      <div class="arch">
        <div class="node"><b>Question</b><span>POST /assistant/ask</span></div>
        <div class="node"><b>Pydantic AI agent</b><span>Qwen3 4B · Ollama</span></div>
        <div class="node"><b>5 typed tools</b><span>read-only</span></div>
        <div class="node"><b>Same services</b><span>READ ONLY tx</span></div>
        <div class="node"><b>PostgreSQL 16</b><span>no SQL tools</span></div>
      </div>
      <p class="lane">Knowledge lookup</p>
      <div class="arch">
        <div class="node"><b>Agent</b><span>needs a procedure</span></div>
        <div class="node"><b>search_knowledge_base</b><span>tool</span></div>
        <div class="node"><b>Embeddings</b><span>all-minilm · 384-d</span></div>
        <div class="node"><b>pgvector</b><span>HNSW · cosine</span></div>
        <div class="node"><b>Evidence</b><span>passages + sources</span></div>
      </div>
      <div class="card run" style="margin-top:5mm;padding:4mm">
        <p class="eyebrow flow" style="font-size:7pt">A real run · ${esc(rf.routeflowAssistantRun.model)}</p>
        <p class="q" style="margin-top:1.5mm">“${esc(rf.routeflowAssistantRun.question)}”</p>
        ${rf.routeflowAssistantRun.toolCalls.map((c) => `<p class="tool"><b>${esc(c.tool)}</b>(${esc(c.args)})<i>accepted</i></p>`).join('')}
        ${rf.routeflowAssistantRun.answer.map((a) => `<p style="margin-top:1.5mm">${esc(a)}</p>`).join('')}
      </div>
    </div>
    <div>
      <p class="eyebrow" style="color:var(--subtle)">Results & lessons</p>
      ${rf.routeflowLessons
        .map(
          (l) => `<div class="lesson" style="border-top:1px solid var(--line);padding:2.6mm 0">
          ${l.metric ? `<p class="m"><s>${esc(l.metric.from)}</s>→ ${esc(l.metric.to)}</p>` : ''}
          <b>${esc(l.title)}</b><p style="font-size:8pt">${esc(l.body)}</p></div>`,
        )
        .join('')}
    </div>
  </div>
  ${footer(6, 'RouteFlow · architecture')}
</section>

<!-- 6 · SentryMesh -->
<section class="page">
  <div class="glow" style="width:200mm;height:120mm;left:-60mm;top:-60mm;background:#22d3ee"></div>
  <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:9mm">
    <div>
      <p class="eyebrow cyan">Case study · solo project</p>
      <h2 style="font-size:32pt">SentryMesh</h2>
      <p style="font-size:11pt;color:var(--fg);margin-top:2.5mm">${esc(sm.tagline)} AI governance by design.</p>
      <p style="margin-top:3mm">${esc(sm.lede)}</p>
      <div class="grid3" style="grid-template-columns:repeat(3,1fr);margin-top:4mm;gap:2.5mm">
        ${sm.problem.items.map((p) => `<div class="card" style="padding:3mm"><h3 style="font-size:9pt">${esc(p.title)}</h3><p style="font-size:7pt;line-height:1.35;margin-top:1mm">${esc(p.body)}</p></div>`).join('')}
      </div>
    </div>
    <div>
      <div class="shot"><img src="${images.smArch}" alt=""></div>
      <div class="stats" style="margin-top:4mm;grid-template-columns:repeat(4,1fr)">
        ${sm.metrics.map((m) => `<div style="padding:3mm 3.5mm"><b style="font-size:15pt;color:var(--cyan)">${m.prefix ?? ''}${m.value}${m.suffix ?? ''}</b><span>${esc(m.label)}</span></div>`).join('')}
      </div>
    </div>
  </div>
  <p class="lane" style="color:var(--cyan);margin-top:3.5mm">One request, one explainable decision</p>
  <div class="steps">${sm.lifecycle.map((s, i) => `<div><span>0${i + 1}</span><b>${esc(s.step)}</b><p>${esc(s.body)}</p></div>`).join('')}</div>
  <div class="grid3" style="margin-top:3.5mm;gap:3mm">
    ${sm.paths
      .map((p) => {
        const c = { cyan: 'var(--cyan)', amber: 'var(--amber)', red: 'var(--soft)' }[p.tone];
        return `<div class="card path" style="padding:2.4mm 4mm"><span class="badge" style="color:${c};border-color:${c}">${esc(p.risk)}</span><h3>${esc(p.name)}</h3><ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
      })
      .join('')}
  </div>
  <p class="links" style="margin-top:2mm">${link(SITE_URL + '/work/sentrymesh', 'Interactive case study')}<i>·</i>${link(SITE_URL + '/docs/sentrymesh-presentation.pdf', 'Presentation (PDF)')}</p>
  ${footer(7, 'SentryMesh')}
</section>

<!-- 7 · Selected projects -->
<section class="page">
  <p class="eyebrow">Selected work</p>
  <h2>Built end to end.</h2>
  <div class="grid2" style="margin-top:4mm;gap:0 9mm">
    <div>${projectRow(P['plug-chat'], images.plug)}${projectRow(P.laforet, images.laforet)}</div>
    <div>${projectRow(P['db-delay-prediction'], images.db)}${projectRow(P['surgical-chatbot'], images.surgical)}</div>
  </div>
  ${footer(8, 'Selected work')}
</section>

<!-- 8 · More projects -->
<section class="page dense">
  <p class="eyebrow">More projects</p>
  <h2>Agents, ML and data work.</h2>
  <div class="grid2" style="margin-top:4mm;gap:0 9mm">
    <div>${['incident-response', 'abrechnung-ai', 'trading-agent'].map((s) => projectRow(P[s])).join('')}</div>
    <div>${['knowledge-graph', 'order-to-cash', 'intrusion-detection', 'fred-time-series'].map((s) => projectRow(P[s])).join('')}</div>
  </div>
  ${footer(9, 'More projects')}
</section>

<!-- 9 · Certifications + contact -->
<section class="page">
  <div class="glow" style="width:220mm;height:120mm;left:40mm;bottom:-80mm;background:var(--accent)"></div>
  <p class="eyebrow">Certifications</p>
  <h2>${certifications.total} certifications.</h2>
  <div class="certs" style="margin-top:5mm">
    ${certifications.groups.map((g) => `<div class="g"><h4>${esc(g.theme)}</h4><ul>${g.items.map((c) => `<li>${esc(c.name)} <span>· ${esc(c.issuer)}${c.date ? ' · ' + esc(c.date) : ''}</span></li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="card" style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding:6mm 7mm">
    <div>
      <p class="eyebrow">Contact</p>
      <p style="font:600 20pt 'Space Grotesk';color:var(--fg);margin-top:2mm">Need LLMs to work in production? Let’s talk.</p>
      <p style="margin-top:1.5mm">${esc(profile.availability)} · ${esc(profile.location)} · ${esc(profile.workPermit)}</p>
    </div>
    <div style="text-align:right;font-size:9.5pt;line-height:1.9">
      ${link('mailto:' + profile.contact.email, profile.contact.email)}<br>
      ${link(SITE_URL, host(SITE_URL))}<br>
      ${link(profile.contact.linkedin, 'linkedin.com/in/jasser-chtourou')}<br>
      ${link(profile.contact.github, 'github.com/jasserchtourou')}
    </div>
  </div>
  ${footer(10, 'Certifications & contact')}
</section>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Fail loudly if any page's content overflows its A4 box.
const overflow = await page.evaluate(() =>
  [...document.querySelectorAll('.page')]
    .map((p, i) => {
      const page = p.getBoundingClientRect();
      const foot = p.querySelector('footer').getBoundingClientRect();
      const content = [...p.children].filter((c) => c.tagName !== 'FOOTER' && !c.classList.contains('glow'));
      const lowest = Math.max(...content.flatMap((c) => [...c.querySelectorAll('*'), c]).map((e) => e.getBoundingClientRect().bottom));
      return foot.bottom > page.bottom + 0.5 || lowest > foot.top + 0.5 ? i + 1 : null;
    })
    .filter(Boolean),
);
await page.pdf({ path: outFile, printBackground: true, preferCSSPageSize: true });
await browser.close();
const { size } = await fs.stat(outFile);
console.log(`${outFile}  ${Math.round(size / 1024)} KB${overflow.length ? `  OVERFLOW on page(s): ${overflow.join(', ')}` : ''}`);
