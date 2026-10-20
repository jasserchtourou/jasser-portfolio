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

Editable copy lives in `content/*.json` and is managed from the **back office** (`/admin`).
`src/data/*.js` re-export it, so components never change when content does:

| File | Contents | Edited in |
|---|---|---|
| `content/profile.json` | pitch, hero stats, education, certifications, languages, links | `/admin/profile` |
| `content/experience.json` | roles and internships | `/admin/experience` |
| `content/skills.json` | skills grouped as in the CV | `/admin/skills` |
| `content/projects.json` | project cards (order, home-page flag, media, links) | `/admin/projects` |
| `src/data/routeflow.js` | RouteFlow facts, features, lessons | code |
| `src/data/sentrymesh.js` | SentryMesh case study | code |

Rule: no invented facts or metrics.

## Back office (`/admin`)

Password-protected admin to add, edit, reorder and delete projects, experience, skills and profile
data, upload images, and see visitor analytics.

- **Auth:** one password (`ADMIN_PASSWORD`), a signed, `httpOnly`, `SameSite=Strict` session cookie
  (HMAC with `ADMIN_SECRET`, 12 h), checked in `middleware.js` for every `/admin` and `/api/admin`
  route. Failed logins are rate-limited; admin pages are `noindex` and never tracked.
- **Saving:** every save is validated server-side (`src/lib/admin/validate.js`).
  - Locally (no GitHub variables) it writes `content/*.json` directly and the dev server hot-reloads.
  - In production it **commits** the JSON (and uploaded images) to GitHub through the Contents API;
    Vercel sees the commit and redeploys (~1 min). The site stays fully static and every edit is in
    git history, so any change can be reverted. Concurrent edits are caught (409) instead of lost.

Environment variables (copy `.env.example` to `.env.local` for local use, set them in Vercel for production):

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | back-office password (use a long, unique one) |
| `ADMIN_SECRET` | ≥ 32 random chars for signing sessions: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GITHUB_TOKEN` | fine-grained token, **this repository only**, permission *Contents: Read and write* |
| `GITHUB_REPO` / `GITHUB_BRANCH` | e.g. `jasserchtourou/jasser-portfolio` / `main` (the branch Vercel deploys) |

## Analytics (Umami)

Visitor tracking uses [Umami](https://github.com/umami-software/umami): open source, **cookieless**,
no personal data stored, GDPR-compliant without a cookie banner. The script loads only on the public
site (`app/(site)/layout.jsx`), only when configured, and only counts the production domain
(`data-domains`), so local dev and preview deployments don't skew the numbers. Clicks on the email
button and external links (LinkedIn, GitHub, demos) are recorded as events
(`src/components/OutboundTracker.jsx`). `/admin/analytics` shows live visitors, visitors, visits,
page views, bounce rate, visit time, top pages, referrers, countries, devices, browsers, OS and clicks.

**1. Get an Umami instance** (pick one)

- *Umami Cloud* (simplest, free Hobby plan): sign up at umami.is and add the website. Hobby has no
  API keys, so turn on its **Share URL** (Websites → Edit → Share URL) and use that for the stats.
- *Self-hosted* (full data ownership): deploy Umami on Vercel or Docker with a free Postgres
  (e.g. Neon/Supabase), following the Umami docs. Change the default `admin` password immediately,
  then create a **separate view-only user** for the API.

**2. Add the website in Umami** with the production domain and copy its *Website ID*.

**3. Set the variables**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_UMAMI_URL` | where `script.js` is served: your Umami URL, or `https://cloud.umami.is` |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | the Website ID |
| `NEXT_PUBLIC_UMAMI_DOMAINS` | optional, comma-separated hosts to count (defaults to the `SITE_URL` host) |
| `UMAMI_SHARE_URL` | the website's share link, e.g. `https://cloud.umami.is/share/<id>/…`; works on every plan; replaces `UMAMI_API_URL` and the credentials below |
| `UMAMI_SHARE_API_URL` | optional; the API behind the share link. Default: Umami Cloud's EU/US gateways (`https://gateway-eu.umami.is/api`), or `<origin>/api` for self-hosted |
| `UMAMI_API_URL` | self-hosted: `https://<umami>/api` · Cloud: `https://api.umami.is/v1` |
| `UMAMI_USERNAME` / `UMAMI_PASSWORD` | self-hosted: the view-only user (no 2FA) |
| `UMAMI_API_KEY` | Cloud paid plans: the API key (instead of username/password) |
| `UMAMI_DASHBOARD_URL` | optional link to the full Umami dashboard |

API credentials are server-only (no `NEXT_PUBLIC_`): the browser talks to `/api/admin/analytics`,
never to Umami directly. With `UMAMI_SHARE_URL`, the server gets a read-only share token from the
link (the same one Umami's share page uses); if that ever fails, the page embeds the share dashboard
instead. Note that a share link is public: anyone who has it can see the stats, so don't post it. Redeploy after changing `NEXT_PUBLIC_*` variables, since they are inlined at build time.

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
node scripts/portfolio-pdf.mjs <out.pdf>                          # 10-page PDF portfolio from content/ + src/data
```

## QA scripts (run against `npm start` on port 3200)

```bash
node scripts/qa-screens.mjs http://localhost:3200 <outDir> / /projects /work/sentrymesh   # 375/768/1440, overflow, console
node scripts/qa-routeflow.mjs http://localhost:3200 <outDir>    # 3D ring, drag, 2D + reduced fallbacks
node scripts/qa-a11y-perf.mjs http://localhost:3200              # axe WCAG 2.1 AA, keyboard order, frame times
GPU=1 node scripts/qa-fps.mjs http://localhost:3200 /work/routeflow
```

On Git Bash for Windows, prefix with `MSYS_NO_PATHCONV=1` so paths starting with `/` are not rewritten.
