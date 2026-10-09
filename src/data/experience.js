// Roles from the CV; the kamka role was supplied by Jasser (LinkedIn).

export const experience = [
  {
    company: 'kamka (Kamka IT)',
    role: 'IT Business Engineer',
    type: 'Self-employed · one of the first team members',
    period: '01/2026 – Present',
    current: true,
    points: [
      'Delivered the website for Charme Hôtel La Forêt, a 4-star hotel in Aïn Draham, Tunisia, within Kamka IT.',
    ],
    stack: ['Next.js'],
    link: { label: 'laforet.charmehotels.com.tn', href: 'https://laforet.charmehotels.com.tn' },
  },
  {
    company: 'Finest Travel GmbH',
    context: 'Tourism agency',
    role: 'AI / Automation Engineer',
    type: 'Part-time',
    location: 'Hamburg (Remote)',
    period: '11/2025 – 06/2026',
    points: [
      'Designed and built a FastAPI backend that converts Excel-based travel bookings into validated, structured travel-voucher PDFs, exposed via REST endpoints for internal tooling. Automated 65% of the voucher process (~100 vouchers per month).',
      'Architected a business-rule engine for supplier normalisation and preflight validation, cutting document errors by 80% across FIT and group booking formats.',
      'Built ETL pipelines for ingestion, transformation and cleaning, removing manual document-prep bottlenecks.',
      'Integrated third-party supplier tools and external databases, standardising data exchange across booking systems.',
    ],
    stack: ['FastAPI', 'Python', 'ETL', 'REST', 'PDF generation'],
  },
  {
    company: 'AiNext GmbH',
    context: 'Mid-sized AI startup',
    role: 'AI Backend Engineer',
    type: 'Freelance, project-based, alongside final-year thesis',
    location: 'Munich (Remote)',
    period: '01/2025 – 09/2025',
    points: [
      'As the sole AI backend engineer, owned the RAG and NLP backend end-to-end, from architecture to deployment.',
      'Designed and deployed RAG systems using LLMs, vector databases and embeddings to improve search accuracy; built end-to-end workflows for data ingestion, preprocessing and semantic indexing.',
      'Developed backend services with FastAPI and Django exposing NLP and RAG functionality via APIs; integrated Azure OpenAI with prompt engineering for production use.',
      'Shaped the AI architecture and drove pipeline improvements with the team; documented all workflows.',
    ],
    stack: ['FastAPI', 'Django', 'Azure OpenAI', 'Vector DBs', 'Embeddings'],
  },
  {
    company: 'Plug&Plai',
    context: 'Mid-sized startup',
    role: 'AI Engineer',
    type: 'Final-year thesis project (PFE), full-time',
    location: 'Stuttgart, Germany',
    period: '03/2025 – 09/2025',
    points: [
      'Built Plug&Chat, a multi-tenant RAG system (LangChain, pgvector) with per-client knowledge isolation and semantic retrieval with source traceability: 1,000+ uses per month, resolving 70% of company-related issues.',
      'Developed an AI recruitment voice assistant combining speech/NLP pipelines with the RAG backend; built REST APIs for downstream integration.',
      'Set up automated testing and deployment with GitHub Actions; worked in an agile team following responsible-AI review practices.',
    ],
    stack: ['LangChain', 'pgvector', 'REST', 'GitHub Actions', 'Speech/NLP'],
  },
  {
    company: 'Keejob',
    context: 'Large job platform',
    role: 'Python Backend Engineer',
    type: 'Werkstudent during studies',
    location: 'Tunis, Tunisia',
    period: '06/2022 – 09/2024',
    points: [
      'Built recruiter-facing APIs with Django REST Framework (OpenAPI via drf-spectacular, JWT auth, Kafka event consumption) with 95% test coverage.',
      'Contributed to a production backend (PostgreSQL, Redis, RabbitMQ) serving 2M+ users.',
    ],
    stack: ['Django REST Framework', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Kafka', 'JWT'],
  },
];

export const internships = [
  {
    company: 'VALUE Digital Services',
    context: 'Large company',
    role: 'AI Developer Intern',
    location: 'Tunis, Tunisia',
    period: '06/2024 – 08/2024',
    points: [
      'Built a computer-vision market-intelligence platform (CNNs/RNNs), deployed to AWS, Azure and GCP with Docker and CI/CD.',
    ],
  },
  {
    company: 'VERMEG',
    context: 'Financial software for banks & insurers',
    role: 'Web Developer Intern',
    location: 'Tunis, Tunisia',
    period: '06/2023 – 08/2023',
    points: [
      'Built a securities-processing web app (React, Node.js, Express; MySQL, PostgreSQL, MongoDB) with RESTful APIs.',
    ],
  },
];
