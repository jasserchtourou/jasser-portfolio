// Facts come from: the CV, the RouteFlow repository, the SentryMesh presentation,
// the live La Forêt site, and Jasser's public LinkedIn post / GitHub repositories.

export const projects = [
  {
    slug: 'routeflow',
    title: 'RouteFlow',
    tagline: 'Logistics operations platform with an agentic RAG assistant and a live 3D warehouse twin',
    summary:
      'Modular-monolith FastAPI + PostgreSQL backend with 13 domain modules, a Pydantic AI agent that picks among 5 typed read-only tools, pgvector semantic search, and a Next.js + React Three Fiber digital twin of a warehouse yard.',
    kind: 'Flagship · personal project',
    year: '2026',
    stack: ['FastAPI', 'SQLAlchemy 2 (async)', 'PostgreSQL 16 + pgvector', 'Pydantic AI', 'Ollama', 'Next.js 15', 'React Three Fiber', 'Docker'],
    image: { src: '/images/routeflow/dashboard-1600.webp', alt: 'RouteFlow dashboard with live KPIs, logistics flow, delayed shipments and live events' },
    caseStudy: '/work/routeflow',
    repo: 'https://github.com/jasserchtourou/RouteFlow',
    featured: true,
  },
  {
    slug: 'sentrymesh',
    title: 'SentryMesh',
    tagline: 'LLM security gateway: AI governance by design',
    summary:
      'A security layer between applications and LLM providers that inspects every request before model execution, routes sensitive data to a local model and the rest to Azure OpenAI, and logs every decision for auditability.',
    kind: 'Personal project',
    stack: ['FastAPI', 'Celery', 'Redis', 'Presidio', 'spaCy', 'OPA / Rego', 'Ollama (Llama 3)', 'Azure OpenAI'],
    image: { aspect: 'video', src: '/images/sentrymesh/architecture-1600.webp', alt: 'SentryMesh architecture: FastAPI and Celery workers around a governance engine that routes to Ollama or Azure OpenAI' },
    caseStudy: '/work/sentrymesh',
    metrics: [
      { value: '~120 ms', label: 'avg. inspection overhead' },
      { value: '98.4%', label: 'PII detection recall' },
    ],
    featured: true,
  },
  {
    slug: 'laforet',
    title: 'Charme Hôtel La Forêt',
    tagline: 'Hotel website, delivered with Kamka IT',
    summary:
      'Website for a 4-star, 65-room hotel in the forest of Aïn Draham, Tunisia: rooms, dining, spa, experiences, events, gallery and a booking-request flow confirmed by email, with WhatsApp contact.',
    kind: 'Client project · kamka',
    year: '2026',
    stack: ['Next.js'],
    image: { src: '/images/laforet/desktop-1440.webp', alt: 'Charme Hôtel La Forêt website home page' },
    live: 'https://laforet.charmehotels.com.tn',
    featured: true,
  },
  {
    slug: 'plug-chat',
    title: 'Plug&Chat',
    tagline: 'Multi-tenant RAG knowledge base for voice assistants, built at Plug&Plai',
    summary:
      'Multi-tenant RAG system with per-client knowledge isolation and semantic retrieval with source traceability. It improves the voice assistants’ answers, tracks missing information and updates itself. 1,000+ uses per month, resolving 70% of company-related issues.',
    kind: 'Final-year thesis · Plug&Plai, Stuttgart',
    year: '2025',
    stack: ['Python', 'LangChain', 'pgvector', 'FastAPI', 'REST APIs', 'GitHub Actions'],
    video: {
      src: '/videos/plug-chat-demo.mp4',
      poster: '/images/plug-chat/poster.webp',
      title: 'Plug&Chat knowledge base system demo',
    },
    post: 'https://www.linkedin.com/posts/jasser-chtourou_engineering-automation-ai-activity-7356634435653353474-wuqF',
    featured: true,
  },
  {
    slug: 'order-to-cash',
    title: 'Order-to-Cash Multi-Agent Pipeline',
    tagline: 'LangGraph supervisor-agent architecture for finance operations',
    summary:
      'Supervisor-agent architecture (Azure OpenAI GPT-4o) automating order validation, invoicing and financial reconciliation.',
    kind: 'Project',
    stack: ['LangGraph', 'Azure OpenAI GPT-4o', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL / pgvector'],
  },
  {
    slug: 'incident-response',
    title: 'Multi-Agent Incident Response System',
    tagline: 'Five parallel LLM agents for automated root-cause analysis',
    summary:
      'Five parallel LLM agents for anomaly detection, log analysis and mitigation recommendations, automating root-cause analysis. Solo project.',
    kind: 'Solo project',
    stack: ['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Groq', 'Llama 3.3 70B'],
    repo: 'https://github.com/jasserchtourou/multi-agent-incident-response',
  },
  {
    slug: 'abrechnung-ai',
    title: 'AbrechnungAI',
    tagline: 'AI payroll & tax assistant',
    summary:
      'Automated payslip interpretation with PDF upload and a chatbot interface; salary forecasting, net-salary simulation and tax preview.',
    kind: 'Project',
    stack: ['LLM', 'PDF parsing', 'Chatbot'],
    // TODO(jasser): confirm whether github.com/jasserchtourou/ai_payslip_demo is this project.
  },
  {
    slug: 'knowledge-graph',
    title: 'Knowledge Graph for Project Management',
    tagline: 'PMBOK-based knowledge graph with GNN link prediction',
    summary:
      'PMBOK-based knowledge graph using BERT and graph neural networks for link prediction; semantic retrieval with PyTorch and Pinecone.',
    kind: 'Project',
    stack: ['PyTorch', 'BERT', 'Graph Neural Networks', 'Pinecone'],
  },
  {
    slug: 'db-delay-prediction',
    title: 'Deutsche Bahn Delay Prediction',
    tagline: 'Delay prediction and operational recommendations',
    summary:
      'Delay regression and root-cause classification with XGBoost and LightGBM, SHAP explanations for operators, and a containerised FastAPI backend using the Deutsche Bahn open API for live schedules plus a synthetic dataset for historical delay distributions.',
    kind: 'Project',
    stack: ['FastAPI', 'XGBoost', 'LightGBM', 'SHAP', 'Docker'],
    repo: 'https://github.com/jasserchtourou/AI-powered-Deutsche-Bahn-delay-prediction-operational-recommendations-service',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug) => projects.find((p) => p.slug === slug);
