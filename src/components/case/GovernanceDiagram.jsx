import { FlowWalkthrough } from '@/src/components/FlowWalkthrough';
import { sentrymesh } from '@/src/data/sentrymesh';

// Scenarios follow the presentation's lifecycle (slide 4) and routing paths (slide 5).
const scenarios = [
  {
    label: 'Low risk · fast path',
    steps: [
      { node: 'app', caption: 'Intercept: the application sends a general-knowledge request to SentryMesh instead of the LLM.' },
      { node: 'api', caption: 'The FastAPI layer receives the request.' },
      { node: 'pii', caption: 'Inspect: Presidio + spaCy find no PII.' },
      { node: 'policy', caption: 'Decide: the OPA/Rego policy rates it low risk and selects the fast path.' },
      { node: 'cloud', caption: 'Execute: routed directly to Azure OpenAI.' },
      { node: 'audit', caption: 'Audit: decision, risk score and route are logged asynchronously by Celery workers.' },
    ],
  },
  {
    label: 'Sensitive · tokenized path',
    steps: [
      { node: 'app', caption: 'Intercept: a request containing names and IDs arrives at SentryMesh.' },
      { node: 'api', caption: 'The FastAPI layer receives the request.' },
      { node: 'pii', caption: 'Inspect: NER and PII detection identify the sensitive entities.' },
      { node: 'policy', caption: 'Decide: the policy classifies it as sensitive and selects the tokenized path.' },
      { node: 'token', caption: 'Sensitive values are replaced by tenant-scoped tokens.' },
      { node: 'local', caption: 'Execute: the request runs on the local model, Ollama (Llama 3).' },
      { node: 'token', caption: 'The response is securely rehydrated.' },
      { node: 'audit', caption: 'Audit: decision, risk score and route are logged asynchronously.' },
    ],
  },
];

const box = 'rounded-xl border bg-raised/70 px-4 py-3 text-center';
const kicker = 'block font-mono text-[10.5px] uppercase tracking-[0.16em]';

export function GovernanceDiagram() {
  const { architecture: a } = sentrymesh;
  return (
    <FlowWalkthrough scenarios={scenarios} label="Two requests traced through the SentryMesh architecture.">
      <div className="grid gap-4 md:grid-cols-[0.8fr_1fr_1.6fr_1fr] md:items-center md:gap-6">
        <div data-node="app" className={`${box} border-line/10`}>
          <span className={`${kicker} text-subtle`}>Client</span>
          <span className="mt-1 block font-medium">Application</span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <div data-node="api" className={`${box} border-line/10`}>
            <span className={`${kicker} text-cyan-300`}>{a.left[0].kicker}</span>
            <span className="mt-1 block font-medium">{a.left[0].name}</span>
          </div>
          <div data-node="audit" className={`${box} border-line/10`}>
            <span className={`${kicker} text-cyan-300`}>{a.left[1].kicker}</span>
            <span className="mt-1 block font-medium">{a.left[1].name}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-line/20 bg-panel/60 p-4">
          <p className="text-center font-display font-semibold">SentryMesh governance engine</p>
          <div className="mt-3 space-y-2.5">
            {['pii', 'policy', 'token'].map((id, i) => (
              <div key={id} data-node={id} className="rounded-lg border border-cyan-400/30 bg-ink/60 px-3 py-2.5 text-center text-sm">
                {a.engine[i]}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <div data-node="local" className={`${box} border-amber/40`}>
            <span className={`${kicker} text-amber`}>{a.right[0].kicker}</span>
            <span className="mt-1 block font-medium">{a.right[0].name}</span>
          </div>
          <div data-node="cloud" className={`${box} border-cyan-400/40`}>
            <span className={`${kicker} text-cyan-300`}>{a.right[1].kicker}</span>
            <span className="mt-1 block font-medium">{a.right[1].name}</span>
          </div>
        </div>
      </div>
    </FlowWalkthrough>
  );
}
