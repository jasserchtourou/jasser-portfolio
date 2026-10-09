// RouteFlow facts, verified against the repository (github.com/jasserchtourou/RouteFlow):
//  - 493 backend tests: `pytest --collect-only` (README's "434" predates later phases)
//  - 122 frontend tests: `vitest list`
//  - 13 domain modules: backend/app/modules/*
//  - 5 agent tools: app/ai/agents/assistant.py TOOLS
//  - 8 knowledge documents: app/ai/rag/knowledge/*.md
//  - 384-dimension embeddings, HNSW cosine index: ARCHITECTURE.md / CONTEXT.md
//  - 37–66 s → 4 s per one-tool question: CONTEXT.md, measured on the author's RTX 3050 Ti

export const routeflowFacts = [
  { value: 493, label: 'backend tests against real PostgreSQL' },
  { value: 122, label: 'frontend tests (Vitest)' },
  { value: 13, label: 'domain modules in one monolith' },
  { value: 5, label: 'typed, read-only agent tools' },
  { value: 8, label: 'knowledge documents in the RAG base' },
  { value: 384, label: 'dimension embeddings, HNSW index' },
];

export const routeflowRepo = 'https://github.com/jasserchtourou/RouteFlow';

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
