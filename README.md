# Jasser Chtourou · AI Backend Engineer

Portfolio site: [jasser-portfolio-topaz.vercel.app](https://jasser-portfolio-topaz.vercel.app)

- `/`: hero, RouteFlow flagship, selected work, about, experience, skills, education, contact
- `/work/routeflow`: flagship case study with a panoramic 3D ring and an animated architecture walkthrough
- `/work/sentrymesh`: case study of the LLM security gateway
- `/projects`: all projects

## Stack

Next.js 14 (App Router, static export of every page) · React 18 · Tailwind CSS 3 · anime.js 4 ·
three.js + React Three Fiber 8 · lucide-react. Dev tooling: ESLint, Playwright, sharp, axe-core.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (must pass with no warnings)
npm start          # serve the production build
npm run lint
```

Node 20 is used (Node ≥ 20.17 recommended for npm 11).

## Deploy

The site is a Vercel project (`vercel.json`).

- Push the `portfolio-v2` branch → Vercel builds a **preview URL** for review.
- Merge into `main` → Vercel deploys **production**.
- Without Git integration: `npx vercel` (preview) / `npx vercel --prod`.

If the production domain changes, update `SITE_URL` in `src/data/profile.js` (used for canonical
URLs, Open Graph, sitemap and JSON-LD).

## Content

All copy lives in `src/data/`, so editing content never touches components:

| File | Contents | Source |
|---|---|---|
| `profile.js` | pitch, hero stats, education, 22 certifications, languages, links | CV + LinkedIn |
| `experience.js` | roles and internships | CV + kamka role from LinkedIn |
| `skills.js` | skills grouped as in the CV | CV |
| `projects.js` | 13 project cards | CV, LinkedIn projects, GitHub repos, YouTube demos, live sites |
| `routeflow.js` | RouteFlow facts, features, lessons | RouteFlow repo (README, ARCHITECTURE.md, CONTEXT.md, test collection) |
| `sentrymesh.js` | SentryMesh case study | SentryMesh presentation |

Rule: no invented facts or metrics. Missing information is marked `TODO(jasser)` in the data files.

## Motion, 3D and fallbacks

- **Reveals**: one `RevealController` observes `data-reveal`, `data-reveal-words` and
  `data-count`, and loads anime.js lazily (it is not in the initial bundle). The hero entrance is
  CSS-only, so the largest text never waits for JavaScript.
- **RouteFlow ring**: `src/components/routeflow/PanoramaScene.jsx` (R3F) is a separate chunk,
  requested only on desktops with a fine pointer, WebGL, ≥ 4 cores / 4 GB and no data saver. It
  lowers its pixel ratio if frames are slow and hands over to the 2D strip if the device still
  can't hold ~24 fps. Rendering stops while the hero is off-screen.
- **Fallbacks**: mobile, low-power, no-WebGL and `prefers-reduced-motion` visitors get a swipeable
  2D screenshot strip. Under reduced motion every animation is replaced by its final state, and the
  architecture walkthroughs become numbered lists. Add `?no3d` to the URL to force the 2D version.
- Walkthroughs have pause buttons and pause when scrolled off-screen.

## Assets

```bash
node scripts/optimize-images.mjs <RouteFlowDir> <slidesPngDir>   # WebP conversions
node scripts/capture-laforet.mjs                                  # La Forêt screenshots
node scripts/capture-routeflow.mjs http://localhost:3000 <siteId>  # RouteFlow (docker compose up + seed first)
node scripts/og-images.mjs                                        # public/og/*.png (1200×630)
```

## QA scripts (run against `npm start` on port 3200)

```bash
node scripts/qa-screens.mjs http://localhost:3200 <outDir> / /projects /work/sentrymesh   # 375/768/1440, overflow, console
node scripts/qa-routeflow.mjs http://localhost:3200 <outDir>    # 3D ring, drag, 2D + reduced fallbacks
node scripts/qa-a11y-perf.mjs http://localhost:3200              # axe WCAG 2.1 AA, keyboard order, frame times
GPU=1 node scripts/qa-fps.mjs http://localhost:3200 /work/routeflow
```

On Git Bash for Windows, prefix with `MSYS_NO_PATHCONV=1` so paths starting with `/` are not rewritten.
