// RouteFlow facts, verified against the repository (github.com/jasserchtourou/RouteFlow):
//  - 493 backend tests: `pytest --collect-only` (README's "434" predates later phases)
//  - 122 frontend tests: `vitest list`
//  - 13 domain modules: backend/app/modules/*
//  - 5 agent tools: app/ai/agents/assistant.py TOOLS
//  - 8 knowledge documents: app/ai/rag/knowledge/*.md
//  - 384-dimension embeddings, HNSW cosine index: ARCHITECTURE.md / CONTEXT.md
//  - 100 % line + branch coverage, 95 % floor: CONTEXT.md "Testing and quality"
//  - 37–66 s → 4 s per one-tool question: CONTEXT.md, measured on the author's RTX 3050 Ti
//  - 9/9 correct tool choices after the prompt fix: CONTEXT.md "Assistant / agent"

export const routeflowRepo = 'https://github.com/jasserchtourou/RouteFlow';

export const routeflowFacts = [
  { value: 493, label: 'backend tests against real PostgreSQL' },
  { value: 122, label: 'frontend tests (Vitest)' },
  { value: 13, label: 'domain modules in one monolith' },
  { value: 5, label: 'typed, read-only agent tools' },
  { value: 8, label: 'knowledge documents in the RAG base' },
  { value: 384, label: 'dimension embeddings, HNSW index' },
];

export const routeflowShots = [
  { id: 'dashboard', title: 'Dashboard', alt: 'RouteFlow dashboard: live KPIs, logistics flow, delayed shipments and live exception events' },
  { id: 'warehouse-3d-night', title: '3D yard · night', alt: 'Isometric 3D digital twin of a warehouse yard at night with trucks at dock doors, forklifts and metrics panels' },
  { id: 'routes', title: 'Route risk', alt: 'Routes ranked by explainable risk score with delayed status and late shipment counts' },
  { id: 'shipments', title: 'Shipments', alt: 'Shipment list with filters and a side panel showing tracking history and open exceptions' },
  { id: 'tracking', title: 'Fleet map', alt: 'Fleet map of northern Germany with vehicle markers and a filterable vehicle list' },
  { id: 'orders', title: 'Orders', alt: 'Orders table with status and priority filters, sortable columns and pagination' },
  { id: 'warehouse-3d-day', title: '3D yard · day', alt: 'The 3D warehouse yard in the daylight theme' },
  { id: 'events', title: 'Event feed', alt: 'Network-wide tracking event feed with type and time-range filters' },
];

export const routeflowProblem = {
  title: 'Operations live in five places at once.',
  body: [
    'Orders, shipments, routes, fleet and warehouses each tell part of the story. An operator needs one view of the network, a clear answer to “what is at risk right now, and why?”, and procedures at hand when something goes wrong.',
    'RouteFlow is that control centre: a modular FastAPI backend that owns every business rule, a Next.js frontend that only renders, and an assistant that answers from live data and written procedures without ever touching the database directly.',
  ],
  pillars: [
    { title: 'One network view', body: 'Live KPIs, logistics flow, shipments, routes, events and a fleet map, all with filters kept in the URL.' },
    { title: 'Explainable risk', body: 'Routes get a 0–100 risk score with its stated factors, e.g. “2 delayed shipments, worst delay 95 min”.' },
    { title: 'Grounded answers', body: 'Current facts come only from typed tools; procedures only from the pgvector knowledge base.' },
  ],
};

export const routeflowFeatures = [
  {
    shot: 'dashboard',
    kicker: 'Dashboard',
    title: 'The whole network on one screen.',
    body: 'Active and delayed shipments, on-time delivery against the customer promise, open exceptions, capacity-weighted warehouse utilisation and fleet in use. One TanStack Query call fans out to three endpoints and refreshes every 15 s; numbers count up with anime.js and render instantly under reduced motion.',
    points: ['Keeps stale data with a warning when a refresh fails', 'Null KPIs render as a dash, never as zero'],
  },
  {
    shot: 'routes',
    kicker: 'Route risk',
    title: 'A risk score you can argue with.',
    body: 'The score is computed in Python from planned risk, delayed shipments, the worst delay, active high/critical exceptions and the route’s own delay flag, each capped, and it returns the factors that produced it. The same score is citable by the AI agent.',
    points: ['“Highest risk first” ranking via /routes/at-risk', 'Shown as meter + number + level, never colour alone'],
  },
  {
    shot: 'shipments',
    kicker: 'Shipments & events',
    title: 'Status changes only through events.',
    body: 'A shipment’s status moves strictly one step at a time via tracking events. Validate, apply and commit once, under a row lock, so two scanners can’t both pass the next-step check. The side panel shows the full history and open exceptions.',
    points: ['Filters, sort and open item live in the URL', 'Network-wide event feed refreshes every 10 s'],
  },
  {
    shot: 'warehouse-3d-night',
    kicker: '3D digital twin',
    title: 'A warehouse yard that moves on its own timestamps.',
    body: 'Trucks drive in, reverse into dock doors and leave; forklifts carry pallets to the racks and give way to trucks and each other. A visit stores only its planned timestamps. “En route”, “docked” or “loading” is derived from the clock, and the 3D view animates from the same data.',
    points: ['React Three Fiber, orthographic isometric camera, day/night', 'Ops list is the non-WebGL equivalent of the scene'],
  },
  {
    shot: 'tracking',
    kicker: 'Fleet map',
    title: 'Vehicles and sites, synced with a list.',
    body: 'Leaflet map with status filters, pulsing rings for vehicles in transit and red rings for low fuel. The vehicle list beside it is the accessible equivalent, and selection is shared between the two.',
    points: ['Map module loaded client-only with next/dynamic', 'No animation under reduced motion'],
  },
];

export const routeflowStack = [
  { layer: 'Backend', items: ['Python 3.12', 'FastAPI', 'Pydantic v2', 'SQLAlchemy 2 (async)', 'Alembic'] },
  { layer: 'Data', items: ['PostgreSQL 16', 'pgvector (HNSW, cosine)', 'asyncpg'] },
  { layer: 'AI', items: ['Pydantic AI', 'Ollama', 'Qwen3 4B instruct', 'all-minilm embeddings'] },
  { layer: 'Frontend', items: ['Next.js 15 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'TanStack Query', 'anime.js'] },
  { layer: 'Maps & 3D', items: ['Leaflet', 'three.js', 'React Three Fiber'] },
  { layer: 'Quality', items: ['pytest', 'ruff', 'strict mypy', 'Vitest', 'Testing Library', 'ESLint', 'pre-commit'] },
  { layer: 'Ship', items: ['Docker', 'Docker Compose', 'multi-stage non-root images', 'GitHub Actions'] },
];

export const routeflowLessons = [
  {
    title: 'Pick the model for the loop, not the leaderboard.',
    body: 'The thinking variant of Qwen3 4B spent 37–66 s on a one-tool question, and its reasoning couldn’t be switched off through Ollama’s OpenAI API. The instruct variant answered the same question in 4 s on the same 4 GB GPU.',
    metric: { from: '37–66 s', to: '4 s' },
  },
  {
    title: 'Small models need to be told to look things up.',
    body: 'Without “always look it up”, the 4B model answered “SHP-99999 not found” without calling a tool. After the prompt fix it chose the right tool for 9 of 9 test questions, including German and two-tool questions.',
    metric: { from: 'guessed', to: '9/9' },
  },
  {
    title: 'Reproduce races with real transactions.',
    body: 'Two real sessions on committed data (A works without committing, B must block) exposed a deadlock between manual and automatic exception creation. Fix: lock the shipment row before raising a manual exception.',
  },
  {
    title: 'Derive state instead of storing it.',
    body: 'Truck visits store planned timestamps only; their state comes from an injectable clock. The backend, the tests and the 3D animation all read the same truth.',
  },
  {
    title: 'Look at the page.',
    body: 'Unit tests couldn’t see that forklifts drove through trailers. Headless-browser screenshots did, and forklift traffic was revised three times before it was right.',
  },
];
