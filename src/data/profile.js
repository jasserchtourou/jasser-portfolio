// Source of truth: Jasser_Chtourou_CV.pdf (+ facts supplied by Jasser, see README "Content sources").

export const SITE_URL = 'https://jasser-portfolio-topaz.vercel.app';

export const profile = {
  name: 'Jasser Chtourou',
  role: 'AI Backend Engineer',
  focus: 'LLM & agentic AI systems · RAG · Python backends',
  location: 'Hannover, Germany',
  workPermit: 'German work permit',
  availability: 'Open to roles across Germany and remote',
  photo: '/images/jasser-photo.webp',
  pitch:
    'I build the backend that puts LLMs into production: RAG pipelines, multi-agent orchestration, REST APIs, data pipelines and async processing, owned end-to-end from architecture to deployment.',
  summary: [
    'AI Backend Engineer with 3+ years of hands-on experience building production backends and LLM-powered systems, including as the sole AI backend engineer at an AI startup.',
    'Engineering Diploma in AI & Data Science, recognised by ZAB as equivalent to a German Master’s degree.',
    'Experience with financial and sensitive-data workflows: securities processing, invoicing and reconciliation, and audit-logged LLM routing.',
  ],
  contact: {
    email: 'jasser.chtourou@web.de',
    linkedin: 'https://www.linkedin.com/in/jasser-chtourou/',
    github: 'https://github.com/jasserchtourou',
    medium: 'https://medium.com/@jasser278',
    article:
      'https://medium.com/@jasser278/the-future-of-ai-search-rag-is-evolving-faster-than-llms-and-that-changes-everything-71477bf3ea60',
  },
};

// Every number here appears in the CV.
export const heroStats = [
  { value: 3, suffix: '+', label: 'years building production backends' },
  { value: 2, suffix: 'M+', label: 'users served by the Keejob backend I contributed to' },
  { value: 1000, suffix: '+', label: 'monthly uses of my multi-tenant RAG system' },
  { value: 80, suffix: '%', label: 'fewer document errors from my rule engine' },
];

export const education = [
  {
    degree: 'Engineering Diploma, Computer Engineering (AI & Data Science)',
    institution: 'ESPRIT, Private Higher School of Engineering and Technology',
    location: 'Tunisia',
    period: '2022 – 2025',
    notes: [
      'Graduated 10/2025',
      'Recognised by ZAB as equivalent to a German Master’s degree',
      'Final-year thesis (PFE): multi-tenant RAG system at Plug&Plai, Stuttgart',
    ],
  },
  {
    degree: 'Exchange Year, Computer Science',
    institution: 'Universität Marburg',
    location: 'Germany',
    period: '2024 – 2025',
    notes: [],
  },
];

export const certifications = {
  // Jasser lists 22 certifications on LinkedIn; only the ones in the CV are named here.
  // TODO(jasser): paste the full list of 22 certifications to show them all.
  total: 22,
  featured: [
    { name: 'Building Transformer-Based NLP Applications', issuer: 'NVIDIA' },
    { name: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft', status: 'In preparation' },
  ],
};

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'French', level: 'Native' },
  { name: 'English', level: 'C1' },
  { name: 'German', level: 'B1' },
];
