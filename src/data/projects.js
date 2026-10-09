// Facts come from: the CV, Jasser's LinkedIn project entries, the RouteFlow repository, the
// SentryMesh presentation, the live La Forêt site and Jasser's public GitHub / YouTube.
// `home: true` puts a project in the home page's "Selected work" grid.

export const projects = [
  {
    slug: 'routeflow',
    title: 'RouteFlow',
    tagline: 'Logistics operations platform with an agentic RAG assistant and a live 3D warehouse twin',
    summary:
      'Modular-monolith FastAPI + PostgreSQL backend with 13 domain modules, a Pydantic AI agent that picks among 5 typed read-only tools, pgvector semantic search, and a Next.js + React Three Fiber digital twin of a warehouse yard.',
    kind: 'Flagship · solo project',
    year: '2026',
    stack: ['FastAPI', 'SQLAlchemy 2 (async)', 'PostgreSQL 16 + pgvector', 'Pydantic AI', 'Ollama', 'Next.js 15', 'React Three Fiber', 'Docker'],
    image: { src: '/images/routeflow/dashboard-1600.webp', alt: 'RouteFlow dashboard with live KPIs, logistics flow, delayed shipments and live events' },
    caseStudy: '/work/routeflow',
    repo: 'https://github.com/jasserchtourou/RouteFlow',
  },
  {
    slug: 'sentrymesh',
    title: 'SentryMesh',
    tagline: 'LLM security gateway: AI governance by design',
    summary:
      'A security layer between applications and LLM providers that inspects every request before model execution, routes sensitive data to a local model and the rest to Azure OpenAI, and logs every decision for auditability.',
    kind: 'Solo project',
    stack: ['FastAPI', 'Celery', 'Redis', 'Presidio', 'spaCy', 'OPA / Rego', 'Ollama (Llama 3)', 'Azure OpenAI'],
    image: { aspect: 'video', src: '/images/sentrymesh/architecture-1600.webp', alt: 'SentryMesh architecture: FastAPI and Celery workers around a governance engine that routes to Ollama or Azure OpenAI' },
    caseStudy: '/work/sentrymesh',
    deck: '/docs/sentrymesh-presentation.pdf',
    metrics: [
      { value: '~120 ms', label: 'avg. inspection overhead' },
      { value: '98.4%', label: 'PII detection recall' },
    ],
    home: true,
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
      duration: '7:50',
    },
    post: 'https://www.linkedin.com/posts/jasser-chtourou_engineering-automation-ai-activity-7356634435653353474-wuqF',
    home: true,
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
    home: true,
  },
  {
    slug: 'db-delay-prediction',
    title: 'Deutsche Bahn Delay Prediction',
    tagline: 'Delay prediction and operational recommendations for rail',
    summary:
      'Live schedules and station data from the Deutsche Bahn open API, scored by XGBoost and LightGBM models that regress delay times and classify root causes (weather, infrastructure, operations). SHAP shows operators the factors behind each prediction. Because historical root-cause data isn’t public, the models train on a synthetic dataset that mimics real DB delay distributions.',
    kind: 'Solo project',
    stack: ['Python', 'FastAPI', 'XGBoost', 'LightGBM', 'SHAP', 'Docker', 'Kafka-ready', 'Vite', 'anime.js'],
    youtube: { id: 'xWl3-AuxnOM', title: 'Deutsche Bahn delay prediction demo', thumb: '/images/projects/db-delay.webp' },
    repo: 'https://github.com/jasserchtourou/AI-powered-Deutsche-Bahn-delay-prediction-operational-recommendations-service',
    home: true,
  },
  {
    slug: 'surgical-chatbot',
    title: 'AI-Powered Surgical Chatbot',
    tagline: 'Voice-enabled RAG assistant with 3D anatomy',
    summary:
      'An AI chatbot built with RAG, LangChain, pgvector and Django that delivers real-time, voice-enabled surgical information, with 3D anatomy visualisation and live voice chat for surgeons, students and patients.',
    kind: 'Project',
    stack: ['Python', 'Django', 'LangChain', 'pgvector', 'RAG', 'Voice'],
    youtube: { id: 'ImrJ5dxrb9M', title: 'AI-powered surgical chatbot demo', thumb: '/images/projects/surgical-chatbot.webp' },
    home: true,
  },
  {
    slug: 'incident-response',
    title: 'Multi-Agent Incident Response System',
    tagline: 'Five parallel LLM agents that write the root-cause analysis for you',
    summary:
      'A Celery beat detection service polls metrics and logs every 60 s. When it finds an incident, five agents run in parallel (monitoring, log analysis, root cause with confidence scores, mitigation, reporter) and a supervisor merges their output into an RCA report shown on a dashboard.',
    kind: 'Solo project',
    stack: ['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Groq', 'Llama 3.3 70B', 'Docker Compose'],
    repo: 'https://github.com/jasserchtourou/multi-agent-incident-response',
  },
  {
    slug: 'abrechnung-ai',
    title: 'AbrechnungAI',
    tagline: 'AI payroll & tax assistant for German payslips',
    summary:
      'Born from not understanding my own first German payslip: upload a Lohnabrechnung PDF for an AI explanation of each item, ask a chatbot about it, simulate net salary for a new job or a raise, preview the tax return, and see where deductions go in charts. Open source with a live demo.',
    kind: 'Solo project',
    stack: ['Python', 'Flask', 'PDF upload', 'Chatbot', 'ReportLab', 'Tailwind CSS'],
    live: 'https://ai-payslip-demo.onrender.com',
    repo: 'https://github.com/jasserchtourou/ai_payslip_demo',
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
    slug: 'knowledge-graph',
    title: 'Knowledge Graph for Project Management',
    tagline: 'Graph-based recommendations for risk and decision-making',
    summary:
      'A knowledge graph built from PMI standards, PMBOK 6 & 7, a risk-management glossary and real-world case studies, with two recommendation systems: BERT embeddings with a custom link predictor, and BERT + RGCN embeddings refined by a link predictor. Indexed and retrieved with Pinecone.',
    kind: 'Team project · ESPRIT · Sep – Nov 2024',
    stack: ['PyTorch', 'BERT', 'RGCN', 'Link prediction', 'GPT-4 mini', 'Pinecone'],
  },
  {
    slug: 'trading-agent',
    title: 'Intelligent Trading Agent',
    tagline: 'Team project in partnership with VALUE',
    summary:
      'Intelligent trading agents built with VALUE, set in a study of how digital services shape financial and business consulting in Tunisia: helping clients define digital and data strategies and execute their business plans.',
    kind: 'Team project · ESPRIT × VALUE',
    stack: ['Python', 'XGBoost', 'Quantitative analysis'],
  },
  {
    slug: 'intrusion-detection',
    title: 'Anomaly & Intrusion Detection System',
    tagline: 'Network security with GMM, Decision Trees and KNN',
    summary:
      'Gaussian Mixture Models flag anomalous network traffic; Decision Tree and KNN classifiers trained on NSL-KDD (with ANOVA feature selection) classify intrusions as DoS, U2R, R2L or Probe, compared on accuracy, precision, recall and F-score.',
    kind: 'Team project · ESPRIT',
    stack: ['Python', 'scikit-learn', 'GMM', 'Decision Tree', 'KNN', 'Jupyter'],
    repo: 'https://github.com/jasserchtourou/Anomaly-Detection-and-Intrusion-Detection-System',
  },
  {
    slug: 'fred-time-series',
    title: 'Time Series Modelling (FRED)',
    tagline: 'Three-phase ARIMA methodology on US economic data',
    summary:
      'Statistical and graphical analysis, adjustment and residual modelling of two FRED series (book-store retail sales; housing starts in the US Northeast), ending with an argued choice of the optimal ARIMA model.',
    kind: 'Team project · ESPRIT',
    stack: ['R', 'ARIMA', 'Time series', 'Statistics'],
    repo: 'https://github.com/jasserchtourou/Time-Series-Project-Federal-Reserve-Economic-Data-FRED-',
  },
];

export const homeProjects = projects.filter((p) => p.home);
export const getProject = (slug) => projects.find((p) => p.slug === slug);
