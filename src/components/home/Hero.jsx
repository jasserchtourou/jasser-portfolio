import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { profile, heroStats } from '@/src/data/profile';
import { HeroTrace } from '@/src/components/home/HeroTrace';

const headline = ['I', 'build', 'the', 'backend', 'that', 'puts', 'LLMs', 'into', 'production.'];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      <div aria-hidden="true" className="backdrop-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/[0.13] blur-[120px]"
      />

      <div className="page grid gap-12 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-end">
        <div>
          <p className="hero-fade eyebrow flex flex-wrap items-center gap-x-3 gap-y-1" style={{ '--i': 0 }}>
            <span>{profile.name}</span>
            <span aria-hidden="true" className="text-subtle">/</span>
            <span>{profile.location}</span>
          </p>

          <h1 id="hero-title" className="mt-6 max-w-5xl font-display font-semibold tracking-tight">
            <span className="block text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] text-fg">
              <span className="word">
                <span className="hero-rise" style={{ '--i': 0 }}>
                  {profile.role}.
                </span>
              </span>
            </span>
            <span className="mt-5 block max-w-3xl text-[clamp(1.35rem,3vw,2.25rem)] leading-tight text-muted">
              <span className="sr-only">{headline.join(' ')}</span>
              <span aria-hidden="true">
                {headline.map((w, i) => (
                  <span key={i}>
                    <span className="word">
                      <span className={`hero-rise ${w === 'LLMs' ? 'text-accent-soft' : ''}`} style={{ '--i': i + 2 }}>
                        {w}
                      </span>
                    </span>{' '}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg" style={{ '--i': 1 }}>
            3+ years building production backends and LLM-powered systems, including as the sole AI backend engineer at an
            AI startup. Python, FastAPI, Django, PostgreSQL/pgvector, LangGraph and Azure OpenAI.
          </p>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-3" style={{ '--i': 2 }}>
            <Link href="/work/routeflow" className="btn-primary">
              Explore RouteFlow <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/#work" className="btn-ghost">
              Selected work
            </Link>
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              GitHub <ArrowUpRight size={16} aria-hidden="true" />
            </a>
        </div>

        </div>
        <HeroTrace />
        <dl className="lg:col-span-2 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-3">
          {heroStats.map((s, i) => (
            <div key={s.label} className="hero-fade bg-ink p-5 sm:p-6" style={{ '--i': 3 + i }}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span
                  className="block font-display text-3xl font-semibold tabular-nums text-fg sm:text-4xl"
                  data-count={s.value}
                  data-suffix={s.suffix}
                >
                  {s.value.toLocaleString('en-US')}
                  {s.suffix}
                </span>
                <span aria-hidden="true" className="mt-2 block text-sm leading-snug text-muted">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="hero-fade -mt-6 text-sm text-muted lg:col-span-2" style={{ '--i': 7 }}>
          {profile.availability} · {profile.workPermit}
        </p>
      </div>
    </section>
  );
}
