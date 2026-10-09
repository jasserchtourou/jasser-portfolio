import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SplitWords } from '@/src/components/SplitWords';
import { getProject } from '@/src/data/projects';
import { routeflowFacts } from '@/src/data/routeflow';

const fan = [
  { src: '/images/routeflow/warehouse-3d-night-800.webp', alt: 'RouteFlow 3D warehouse yard at night', cls: '-rotate-6 translate-y-6' },
  { src: '/images/routeflow/dashboard-800.webp', alt: 'RouteFlow operations dashboard', cls: 'z-10 scale-110' },
  { src: '/images/routeflow/routes-800.webp', alt: 'RouteFlow routes ranked by explainable risk score', cls: 'rotate-6 translate-y-6' },
];

export function Flagship() {
  const project = getProject('routeflow');
  return (
    <section aria-labelledby="flagship-title" className="relative overflow-hidden border-y border-line/[0.08] bg-[radial-gradient(ellipse_at_top,rgb(var(--flow)/0.12),transparent_60%)] py-24 sm:py-32">
      <div className="page grid items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="eyebrow !text-flow" data-reveal>
            Flagship project
          </p>
          <h2 id="flagship-title" className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            <SplitWords text="RouteFlow" />
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg/90" data-reveal>
            {project.tagline}.
          </p>
          <p className="mt-4 leading-relaxed text-muted" data-reveal>
            {project.summary}
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4" data-reveal>
            {routeflowFacts.slice(0, 3).map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-semibold tabular-nums" data-count={f.value}>
                    {f.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-muted">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <Link href="/work/routeflow" className="btn-primary">
              Enter the case study <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <Link
          href="/work/routeflow"
          aria-label="Open the RouteFlow case study"
          className="group relative mx-auto flex w-full max-w-xl items-center justify-center py-10"
          data-reveal
        >
          {fan.map((shot) => (
            <div
              key={shot.src}
              className={`relative -mx-[8%] aspect-[4/3] w-[44%] sm:-mx-[12%] sm:w-1/2 overflow-hidden rounded-xl border border-line/10 shadow-2xl shadow-black/60 transition-transform duration-700 ease-out first:group-hover:-translate-x-3 last:group-hover:translate-x-3 ${shot.cls}`}
            >
              <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1024px) 26vw, 50vw" className="object-cover object-left-top" />
            </div>
          ))}
        </Link>
      </div>
    </section>
  );
}
