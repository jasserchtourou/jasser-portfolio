import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { SplitWords } from '@/src/components/SplitWords';
import { BackLink, CaseSection, Metrics } from '@/src/components/case/CaseParts';
import { Panorama } from '@/src/components/routeflow/Panorama';
import { ArchitectureMap } from '@/src/components/routeflow/ArchitectureMap';
import {
  routeflowFacts,
  routeflowShots,
  routeflowProblem,
  routeflowFeatures,
  routeflowStack,
  routeflowLessons,
  routeflowRepo,
} from '@/src/data/routeflow';

const description =
  'Case study: RouteFlow, a logistics operations platform. Modular FastAPI + PostgreSQL backend, an agentic RAG assistant with typed read-only tools and pgvector search, and a React Three Fiber digital twin of a warehouse yard.';

export const metadata = {
  title: 'RouteFlow: logistics platform with an agentic RAG assistant',
  description,
  alternates: { canonical: '/work/routeflow' },
  openGraph: {
    url: '/work/routeflow',
    title: 'RouteFlow: logistics platform with an agentic RAG assistant',
    description,
    images: [{ url: '/og/routeflow.png', width: 1200, height: 630, alt: 'RouteFlow case study' }],
  },
  twitter: { card: 'summary_large_image', title: 'RouteFlow: logistics platform with an agentic RAG assistant', description, images: ['/og/routeflow.png'] },
};

const shotById = Object.fromEntries(routeflowShots.map((s) => [s.id, s]));

const designRules = [
  'The model never touches the database and there are no SQL tools.',
  'Tools are narrow, typed and read-only; invalid arguments go back to the model as a retry.',
  'Business logic stays in Python services, never in prompts.',
  '“Insufficient evidence” is a valid answer.',
];

export default function RouteFlowPage() {
  return (
    <article className="routeflow">
      <header>
        <Panorama shots={routeflowShots}>
          <BackLink />
          <p className="eyebrow mt-6 !text-flow">Case study · flagship</p>
          <h1 className="mt-4 font-display text-[clamp(3.25rem,11vw,8.5rem)] font-semibold leading-[0.9] tracking-tight">
            <SplitWords text="RouteFlow" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-snug text-fg/90 sm:text-2xl" data-reveal>
            Logistics operations platform with an agentic RAG assistant and a live 3D warehouse twin.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" data-reveal>
            <a href={routeflowRepo} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Github size={16} aria-hidden="true" /> Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="#architecture" className="btn-ghost">
              Architecture walkthrough
            </Link>
          </div>
        </Panorama>
      </header>

      <div className="relative z-10 bg-ink">
        <CaseSection id="problem" index="01" eyebrow="Problem" title={routeflowProblem.title}>
          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {routeflowProblem.body.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {routeflowProblem.pillars.map((p) => (
              <div key={p.title} className="card p-6" data-reveal>
                <h3 className="font-display text-lg font-semibold text-flow">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </CaseSection>

        <CaseSection
          id="architecture"
          index="02"
          eyebrow="Architecture"
          title="One monolith, three kinds of traffic."
          intro="Router → service → repository → database, and an agent whose tools wrap the very same services. Follow a packet through an operations request, an agentic question and a knowledge lookup."
        >
          <div data-reveal>
            <ArchitectureMap />
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div data-reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-flow">Two kinds of truth, kept separate</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Current operational data comes only from typed application tools. Procedures and documentation come only
                from the pgvector knowledge base: 8 documents, chunked per heading section, embedded locally with
                all-minilm (384 dimensions) and searched by cosine distance over an HNSW index.
              </p>
            </div>
            <div data-reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-flow">Design rules for the assistant</h3>
              <ul className="mt-4 space-y-2.5">
                {designRules.map((r) => (
                  <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-flow" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CaseSection>

        <CaseSection id="features" index="03" eyebrow="Features" title="What an operator actually sees.">
          <div className="space-y-20 sm:space-y-28">
            {routeflowFeatures.map((f, i) => {
              const shot = shotById[f.shot];
              return (
                <div key={f.shot} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <a
                    href={`/images/routeflow/${f.shot}-1600.webp`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line/10 bg-raised shadow-2xl shadow-black/50 ${
                      i % 2 ? 'lg:order-2' : ''
                    }`}
                    data-reveal
                  >
                    <Image
                      src={`/images/routeflow/${f.shot}-1600.webp`}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <span className="sr-only">Open full-size screenshot in a new tab</span>
                  </a>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-flow" data-reveal>
                      {f.kicker}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      <SplitWords text={f.title} />
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base" data-reveal>
                      {f.body}
                    </p>
                    <ul className="mt-5 space-y-2" data-reveal>
                      {f.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-sm text-fg/80">
                          <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-flow" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </CaseSection>

        <CaseSection id="stack" index="04" eyebrow="Tech stack" title="Boring where it should be, sharp where it matters.">
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-2">
            {routeflowStack.map((g) => (
              <div key={g.layer} className="bg-ink p-6 last:sm:col-span-2" data-reveal>
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-flow">{g.layer}</dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((t) => (
                    <span key={t} className="chip !text-fg/85">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </CaseSection>

        <CaseSection
          id="results"
          index="05"
          eyebrow="Results & lessons"
          title="Tested like production, measured on real hardware."
          intro="Tests run against real PostgreSQL rebuilt from the Alembic migrations on every run, with warnings as errors and randomised order. The coverage gate reports 100% line and branch coverage (the floor is 95%)."
        >
          <Metrics items={routeflowFacts.slice(0, 4)} tone="flow" />
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {routeflowLessons.map((l) => (
              <div key={l.title} className={`card p-6 ${l.metric ? 'md:col-span-1' : ''}`} data-reveal>
                {l.metric ? (
                  <p className="flex items-baseline gap-3 font-display text-3xl font-semibold">
                    <span className="text-muted line-through decoration-accent/70 decoration-2">{l.metric.from}</span>
                    <ArrowRight size={20} className="self-center text-flow" aria-label="to" />
                    <span className="text-flow">{l.metric.to}</span>
                  </p>
                ) : null}
                <h3 className={`font-display text-lg font-semibold ${l.metric ? 'mt-4' : ''}`}>{l.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{l.body}</p>
              </div>
            ))}
          </div>
        </CaseSection>

        <section id="links" aria-labelledby="links-title" className="relative isolate overflow-hidden border-t border-line/[0.08] py-24 sm:py-32">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[380px] max-w-4xl rounded-full bg-flow/[0.12] blur-[120px]" />
          <div className="page grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow !text-flow" data-reveal>
                06 Links
              </p>
              <h2 id="links-title" className="h-section mt-4">
                <SplitWords text="Read the code. Run it locally." />
              </h2>
              <p className="mt-5 text-muted" data-reveal>
                Everything runs in Docker Compose: PostgreSQL with pgvector, the API and the web app, with migrations on
                start and a seed command for demo data.
              </p>
              <div className="mt-8 flex flex-wrap gap-3" data-reveal>
                <a href={routeflowRepo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Github size={16} aria-hidden="true" /> github.com/jasserchtourou/RouteFlow
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a href={`${routeflowRepo}/blob/main/ARCHITECTURE.md`} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  ARCHITECTURE.md <ArrowUpRight size={15} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
            <pre
              tabIndex={0}
              aria-label="Commands to run RouteFlow locally"
              className="card overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-fg/85"
              data-reveal
            >
              <code>
                <span className="text-subtle"># database + API + web app, migrations run automatically</span>
                {'\n'}cp .env.example .env
                {'\n'}docker compose up -d --build
                {'\n'}docker compose run --rm -e RUN_MIGRATIONS=0 backend python -m app.seed
                {'\n\n'}
                <span className="text-subtle"># http://localhost:3000 · API docs at :8000/docs</span>
              </code>
            </pre>
          </div>
          <div className="page mt-20 flex flex-col items-start justify-between gap-6 border-t border-line/[0.08] pt-10 sm:flex-row sm:items-center" data-reveal>
            <div>
              <p className="eyebrow">Next case study</p>
              <p className="mt-3 font-display text-3xl font-semibold">SentryMesh</p>
              <p className="mt-2 text-muted">LLM security gateway: AI governance by design.</p>
            </div>
            <Link href="/work/sentrymesh" className="btn-ghost">
              Open SentryMesh <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
