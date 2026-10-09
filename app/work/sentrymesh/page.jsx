import Link from 'next/link';
import { ArrowRight, Check, FileText, X } from 'lucide-react';
import { SplitWords } from '@/src/components/SplitWords';
import { BackLink, CaseSection, Metrics, ToneBadge } from '@/src/components/case/CaseParts';
import { GovernanceDiagram } from '@/src/components/case/GovernanceDiagram';
import { sentrymesh as sm } from '@/src/data/sentrymesh';

const description =
  'Case study: SentryMesh, an LLM security gateway. PII detection with Presidio + spaCy, OPA/Rego policy-as-code and risk-based routing between a local Llama 3 and Azure OpenAI, with ~120 ms inspection overhead.';

export const metadata = {
  title: 'SentryMesh: AI governance by design',
  description,
  alternates: { canonical: '/work/sentrymesh' },
  openGraph: {
    url: '/work/sentrymesh',
    title: 'SentryMesh: AI governance by design',
    description,
    images: [{ url: '/og/sentrymesh.png', width: 1200, height: 630, alt: 'SentryMesh case study' }],
  },
  twitter: { card: 'summary_large_image', title: 'SentryMesh: AI governance by design', description, images: ['/og/sentrymesh.png'] },
};

export default function SentryMeshPage() {
  return (
    <article>
      <header className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-36">
        <div aria-hidden="true" className="backdrop-grid absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -top-32 right-0 -z-10 h-[460px] w-[640px] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
        <div className="page">
          <BackLink />
          <p className="eyebrow mt-10" data-reveal>
            Case study · solo project · LLM security gateway
          </p>
          <h1 className="mt-5 font-display text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.92] tracking-tight">
            <SplitWords text="SentryMesh" />
          </h1>
          <p className="mt-6 max-w-3xl font-display text-2xl leading-snug text-fg/90 sm:text-3xl" data-reveal>
            {sm.tagline} <span className="text-muted">AI governance by design.</span>
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg" data-reveal>
            {sm.lede}
          </p>
          <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Tech stack" data-reveal>
            {sm.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8" data-reveal>
            <a href="/docs/sentrymesh-presentation.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <FileText size={16} aria-hidden="true" /> Presentation (PDF, 7 slides)
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
          <div className="mt-12">
            <Metrics items={sm.metrics} />
          </div>
        </div>
      </header>

      <CaseSection id="problem" index="01" eyebrow="Problem" title={sm.problem.title} intro={sm.problem.intro}>
        <div className="grid gap-4 md:grid-cols-3">
          {sm.problem.items.map((p) => (
            <div key={p.title} className="card p-6" data-reveal>
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection
        id="approach"
        index="02"
        eyebrow="Approach"
        title="Deterministic governance, not probabilistic self-censorship."
        intro="Instead of asking the model to police itself, SentryMesh puts a dedicated, versioned inspection and policy layer in front of every model call."
      >
        <div className="space-y-4">
          {sm.alternatives.map((alt) => (
            <div key={alt.alternative} className="grid gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] md:grid-cols-2" data-reveal>
              <div className="bg-ink p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Alternative: {alt.alternative}</p>
                <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-semibold">
                  <X size={18} className="text-muted" aria-hidden="true" /> {alt.weakness}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{alt.weaknessBody}</p>
              </div>
              <div className="bg-panel p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-300">SentryMesh approach</p>
                <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-semibold">
                  <Check size={18} className="text-cyan-300" aria-hidden="true" /> {alt.approach}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{alt.approachBody}</p>
              </div>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection
        id="architecture"
        index="03"
        eyebrow="Architecture"
        title="A decoupled governance layer built for scale and auditability."
        intro="Watch two requests take different paths through the same layer: one with no personal data, one with names and IDs."
      >
        <div data-reveal>
          <GovernanceDiagram />
        </div>
      </CaseSection>

      <CaseSection id="lifecycle" index="04" eyebrow="Lifecycle" title="One request, one explainable decision.">
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-2 lg:grid-cols-5">
          {sm.lifecycle.map((s, i) => (
            <li key={s.step} className="bg-ink p-6" data-reveal>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-400/50 font-mono text-sm text-cyan-300">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.step}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection
        id="routing"
        index="05"
        eyebrow="Routing"
        title="Risk-based routing, not one-size-fits-all."
        intro="Dynamic path selection based on real-time data sensitivity."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {sm.paths.map((p) => (
            <div key={p.name} className="card p-6" data-reveal>
              <ToneBadge tone={p.tone}>{p.risk}</ToneBadge>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.name}</h3>
              <ul className="mt-4 space-y-2 text-[15px] text-muted">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-subtle">
                      →
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection
        id="tradeoffs"
        index="06"
        eyebrow="Trade-offs"
        title="The hardest trade-off: detection accuracy vs. latency."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {sm.tradeoffs.map((t, i) => (
            <div key={t.title} className="card p-6" data-reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Challenge 0{i + 1}</p>
              <h3 className="mt-3 font-display text-xl font-semibold">{t.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="outcome" index="07" eyebrow="Role & outcome" title="What I designed, and what it delivers.">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg" data-reveal>
            <p>
              I designed the governance layer: the FastAPI interception point, Presidio + spaCy
              inspection, OPA/Rego policies, tokenization with rehydration and asynchronous audit logging. I also made
              the trade-offs above: PII detection is treated as a signal with a conservative fallback, and auditing runs
              in Celery workers so it stays off the request path.
            </p>
            <p>
              The result is governance a security team can verify: every request gets one deterministic decision, a risk
              score and a route, all logged. Sensitive work stays in private execution and only the necessary data
              reaches the cloud.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-start" data-reveal>
            {sm.metrics.slice(0, 2).map((m) => (
              <div key={m.label} className="card p-6">
                <dt className="text-sm text-muted">{m.label}</dt>
                <dd className="mt-2 font-display text-4xl font-semibold text-cyan-300">
                  {m.prefix}
                  {m.value}
                  {m.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </CaseSection>

      <section aria-label="Next case study" className="border-t border-line/[0.08] py-20">
        <div className="page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center" data-reveal>
          <div>
            <p className="eyebrow !text-flow">Next case study</p>
            <p className="mt-3 font-display text-3xl font-semibold sm:text-4xl">RouteFlow</p>
            <p className="mt-2 text-muted">Logistics platform, agentic RAG assistant and a live 3D warehouse twin.</p>
          </div>
          <Link href="/work/routeflow" className="btn-primary">
            Open RouteFlow <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </article>
  );
}
