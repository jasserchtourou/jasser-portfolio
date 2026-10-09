// Decorative "request trace" beside the hero headline: the shape of the systems I build.
// Purely visual (aria-hidden); the same information is in the text around it.
const steps = [
  { op: 'guard', detail: 'validate · authorize · inspect' },
  { op: 'retrieve', detail: 'embeddings → pgvector' },
  { op: 'reason', detail: 'agent plans tool calls' },
  { op: 'act', detail: 'typed, read-only tools' },
  { op: 'respond', detail: 'structured · logged' },
];

export function HeroTrace() {
  return (
    <div aria-hidden="true" className="hero-fade hidden lg:block" style={{ '--i': 3 }}>
      <div className="card relative overflow-hidden p-5 font-mono text-[12.5px] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-line/[0.08] pb-3 text-subtle">
          <span>
            <span className="text-accent-soft">POST</span> /v1/ask
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> live
          </span>
        </div>
        <ol className="relative mt-4 space-y-3.5 pl-6">
          <span className="absolute bottom-1 left-[5px] top-1 w-px bg-line/10" />
          <span className="trace-dot absolute left-[2px] top-0 h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_rgb(var(--accent))]" />
          {steps.map((s, i) => (
            <li key={s.op} className="trace-step relative" style={{ '--i': i }}>
              <span className="absolute -left-[22px] top-[5px] h-[5px] w-[5px] rounded-full bg-line/30" />
              <span className="text-fg">{s.op}</span>
              <span className="ml-3 text-muted">{s.detail}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 border-t border-line/[0.08] pt-3 text-[11px] text-subtle">FastAPI · Celery · PostgreSQL · LLM</div>
      </div>
    </div>
  );
}
