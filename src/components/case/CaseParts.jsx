import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SplitWords } from '@/src/components/SplitWords';

export function BackLink() {
  return (
    <Link href="/#work" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted hover:text-fg">
      <ArrowLeft size={16} aria-hidden="true" /> All work
    </Link>
  );
}

export function Metrics({ items, tone = 'accent' }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] lg:grid-cols-4">
      {items.map((m) => (
        <div key={m.label} className="bg-ink p-5 sm:p-6" data-reveal>
          <dt className="sr-only">{m.label}</dt>
          <dd>
            <span
              className={`block font-display text-3xl font-semibold tabular-nums sm:text-4xl ${tone === 'flow' ? 'text-flow' : 'text-fg'}`}
              data-count={m.value}
              data-prefix={m.prefix}
              data-suffix={m.suffix}
              data-decimals={m.decimals}
            >
              {m.prefix}
              {m.value.toLocaleString('en-US', { minimumFractionDigits: m.decimals ?? 0 })}
              {m.suffix}
            </span>
            <span aria-hidden="true" className="mt-2 block text-sm leading-snug text-muted">
              {m.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseSection({ id, index, eyebrow, title, intro, children, className = '' }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-line/[0.08] py-20 sm:py-28 ${className}`}>
      <div className="page">
        <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle" data-reveal>
            {index ? <span className="text-accent-soft">{index} </span> : null}
            {eyebrow}
          </p>
          <div className="max-w-3xl">
            <h2 id={`${id}-title`} className="h-section">
              <SplitWords text={title} />
            </h2>
            {intro ? (
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg" data-reveal>
                {intro}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-12 lg:ml-[204px]">{children}</div>
      </div>
    </section>
  );
}

const tones = {
  cyan: 'border-cyan-400/40 text-cyan-300',
  amber: 'border-amber/50 text-amber',
  red: 'border-accent/50 text-accent-soft',
};

export function ToneBadge({ tone, children }) {
  return (
    <span className={`inline-flex rounded-md border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${tones[tone]}`}>
      {children}
    </span>
  );
}
