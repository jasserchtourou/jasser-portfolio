import { routeflowAssistantRun as run } from '@/src/data/routeflow';

// A recorded, unedited tool trace from the running system (see routeflow.js for provenance).
export function AssistantRun() {
  return (
    <div className="card overflow-hidden" data-reveal>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/[0.08] px-5 py-3 font-mono text-xs text-muted">
        <span>
          <span className="text-flow">POST</span> /api/v1/assistant/ask
        </span>
        <span>{run.model} · local, via Ollama</span>
      </div>
      <ol className="divide-y divide-line/[0.06] text-[15px]">
        <li className="grid gap-2 px-5 py-4 sm:grid-cols-[120px_1fr]">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">Question</span>
          <p className="text-fg">“{run.question}”</p>
        </li>
        {run.toolCalls.map((c, i) => (
          <li key={c.tool} className="grid gap-2 px-5 py-4 sm:grid-cols-[120px_1fr]">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">Tool {i + 1}</span>
            <p className="font-mono text-[13px] text-fg/90">
              <span className="text-flow">{c.tool}</span>
              <span className="text-muted">({c.args})</span>
              <span className="ml-2 rounded bg-emerald-400/10 px-1.5 py-0.5 text-[11px] text-emerald-300">accepted</span>
            </p>
          </li>
        ))}
        <li className="grid gap-2 px-5 py-4 sm:grid-cols-[120px_1fr]">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">Answer</span>
          <div className="space-y-2 leading-relaxed text-muted">
            {run.answer.map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
        </li>
      </ol>
      <p className="border-t border-line/[0.08] px-5 py-3 font-mono text-[11px] text-subtle">
        {run.usage.requests} model requests · {run.usage.toolCalls} tool calls chosen by the model ·{' '}
        {run.usage.inputTokens.toLocaleString('en-US')} input / {run.usage.outputTokens} output tokens · read-only transaction
      </p>
    </div>
  );
}
