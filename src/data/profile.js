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

// All 22 certifications from LinkedIn (supplied by Jasser), grouped by theme.
export const certifications = {
  total: 22,
  featured: [
    { name: 'Building Transformer-Based Natural Language Processing Applications', issuer: 'NVIDIA', date: 'Apr 2024' },
    { name: 'Natural Language Processing Specialization', issuer: 'DeepLearning.AI' },
    { name: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft', status: 'Exam in preparation · 4 Microsoft Azure courses completed' },
  ],
  groups: [
    {
      theme: 'AI, NLP & machine learning',
      items: [
        { name: 'Building Transformer-Based Natural Language Processing Applications', issuer: 'NVIDIA', date: 'Apr 2024' },
        { name: 'Natural Language Processing Specialization', issuer: 'DeepLearning.AI' },
        { name: 'Large Language Models (LLMs) Concepts', issuer: 'DataCamp' },
        { name: 'Working with Hugging Face', issuer: 'DataCamp' },
        { name: 'Image Modeling with Keras', issuer: 'DataCamp' },
        { name: 'Python for Data Science, AI & Development', issuer: 'IBM' },
      ],
    },
    {
      theme: 'Cloud',
      items: [
        { name: 'Preparing for the AZ-900 Microsoft Azure Fundamentals Exam', issuer: 'Microsoft' },
        { name: 'Microsoft Azure Services and Lifecycles', issuer: 'Microsoft' },
        { name: 'Microsoft Azure Management Tools and Security Solutions', issuer: 'Microsoft' },
        { name: 'Introduction to Microsoft Azure Cloud Services', issuer: 'Microsoft' },
        { name: 'Understanding Cloud Computing', issuer: 'DataCamp' },
      ],
    },
    {
      theme: 'Data & statistics',
      items: [
        { name: 'Python Project for Data Engineering', issuer: 'IBM' },
        { name: 'Databases and SQL for Data Science with Python', issuer: 'IBM' },
        { name: 'Fundamentals of Database System', issuer: 'Coursera' },
        { name: 'Data Science Math Skills', issuer: 'Duke University' },
        { name: 'ARIMA Models in R', issuer: 'DataCamp' },
        { name: 'Getting Started with R', issuer: 'Coursera' },
      ],
    },
    {
      theme: 'Software, systems & security',
      items: [
        { name: 'Foundations of Cybersecurity', issuer: 'Google' },
        { name: 'Unix System Basics', issuer: 'Codio' },
        { name: 'Angular for Front End Engineers', issuer: 'Codio' },
        { name: 'C#', issuer: 'w3schools.com' },
      ],
    },
    {
      theme: 'Business',
      items: [{ name: 'Business Analysis & Process Management', issuer: 'Coursera' }],
    },
  ],
};

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'French', level: 'Native' },
  { name: 'English', level: 'C1' },
  { name: 'German', level: 'B1' },
];
