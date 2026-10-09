// Every statement here comes from "SentryMesh — AI Governance by Design" (7-slide presentation)
// or the CV project entry. Nothing is extrapolated.

export const sentrymesh = {
  title: 'SentryMesh',
  tagline: 'A security and governance layer for enterprise AI.',
  lede: 'Routing, auditing and data minimisation between applications and LLMs. Every request is inspected before model execution; sensitive data goes to a local model, the rest to Azure OpenAI, and every decision is logged.',
  metrics: [
    { value: 120, prefix: '~', suffix: ' ms', label: 'average inspection overhead' },
    { value: 98.4, suffix: '%', decimals: 1, label: 'PII detection recall (Presidio + spaCy)' },
    { value: 5, label: 'steps from intercept to audit' },
    { value: 3, label: 'risk-based routing paths' },
  ],
  problem: {
    title: 'Powerful models, weak controls.',
    intro: 'Direct application-to-LLM connections create critical enterprise gaps.',
    items: [
      {
        title: 'Privacy & PII leaks',
        body: 'Sensitive customer data (PII, financial records, legal context) is sent directly to cloud providers without inspection or minimisation.',
      },
      {
        title: 'Compliance gaps',
        body: 'Regulated industries lack deterministic evidence of why specific data was shared, making “AI governance by design” impossible to prove.',
      },
      {
        title: 'Audit blindness',
        body: 'Decision-making logic is often hard-coded or hidden in prompts, leaving no auditable trail for security teams or regulators.',
      },
    ],
  },
  architecture: {
    left: [
      { kicker: 'API layer', name: 'FastAPI' },
      { kicker: 'Async workers', name: 'Celery + Redis' },
    ],
    engine: ['PII detection (Presidio + spaCy)', 'Policy-as-code (OPA / Rego)', 'Tokenization & rehydration'],
    right: [
      { kicker: 'Local model', name: 'Ollama (Llama 3)', tone: 'amber' },
      { kicker: 'Cloud model', name: 'Azure OpenAI', tone: 'cyan' },
    ],
  },
  lifecycle: [
    { step: 'Intercept', body: 'The application sends its request to the SentryMesh API instead of the LLM.' },
    { step: 'Inspect', body: 'NER and PII detection identify sensitive entities in real time.' },
    { step: 'Decide', body: 'An OPA policy evaluates the risk level and selects the routing path.' },
    { step: 'Execute', body: 'The request is routed to the local model or the cloud, with tokenization.' },
    { step: 'Audit', body: 'Decision, risk score and routing are logged asynchronously.' },
  ],
  paths: [
    {
      risk: 'Low risk',
      name: 'Fast path',
      tone: 'cyan',
      points: ['No PII detected', 'General knowledge query', 'Direct Azure OpenAI route', 'Standard audit logging'],
    },
    {
      risk: 'Sensitive',
      name: 'Tokenized path',
      tone: 'amber',
      points: ['PII detected (names, IDs)', 'Tenant-scoped tokenization', 'Local Ollama execution', 'Secure rehydration'],
    },
    {
      risk: 'High risk',
      name: 'Trusted path',
      tone: 'red',
      points: ['Financial / legal context', 'Restricted policy match', 'Private execution zone', 'Full forensic auditing'],
    },
  ],
  tradeoffs: [
    {
      title: 'Detection precision',
      body: 'Too aggressive blocks legitimate work; too loose defeats governance. I treat PII detection as a signal and fall back to conservative policy on uncertainty.',
    },
    {
      title: 'Latency vs. compliance',
      body: 'Inspection adds overhead. I moved auditing to async Celery workers and used structured extraction to prevent context breakage.',
    },
  ],
  alternatives: [
    {
      alternative: 'LLM self-censorship',
      weakness: 'Probabilistic & opaque',
      weaknessBody:
        'Relying on system prompts to block PII is non-deterministic and fails under jailbreaks. There is no auditable “why” behind a refusal.',
      approach: 'Deterministic & auditable',
      approachBody:
        'A dedicated inspection layer with OPA/Rego provides a versioned, testable policy that regulators can inspect and verify.',
    },
    {
      alternative: 'Simple masking',
      weakness: 'Context destruction',
      weaknessBody: 'Naive masking often breaks financial or legal logic.',
      approach: 'Intelligent minimisation',
      approachBody:
        'Structured extraction preserves value-critical fields, and risk-based routing ensures only the necessary data reaches the cloud while sensitive work stays in private execution.',
    },
  ],
  stack: ['Python', 'FastAPI', 'Celery', 'Redis', 'Microsoft Presidio', 'spaCy', 'Open Policy Agent (Rego)', 'Ollama · Llama 3', 'Azure OpenAI'],
  // TODO(jasser): public repository or demo link, and project context (solo? dates?).
  links: [],
};
