import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Github, PlayCircle } from 'lucide-react';

function Links({ project }) {
  const { caseStudy, repo, live, post } = project;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {caseStudy ? (
        <Link href={caseStudy} className="btn-primary !min-h-[40px] !px-4">
          Case study <ArrowRight size={15} aria-hidden="true" />
        </Link>
      ) : null}
      {live ? (
        <a href={live} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[40px] !px-4">
          Live site <ArrowUpRight size={15} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null}
      {repo ? (
        <a href={repo} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[40px] !px-4">
          <Github size={15} aria-hidden="true" /> Code
          <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
        </a>
      ) : null}
      {post ? (
        <a href={post} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[40px] !px-4">
          LinkedIn post <ArrowUpRight size={15} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}

function Media({ project, sizes, priority }) {
  if (project.video) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line/[0.08] bg-black">
        {/* preload="none": nothing is downloaded until the visitor presses play. */}
        <video
          className="h-full w-full object-cover"
          controls
          preload="none"
          playsInline
          poster={project.video.poster}
          aria-label={project.video.title}
        >
          <source src={project.video.src} type="video/mp4" />
          <a href={project.post}>Watch the demo on LinkedIn</a>
        </video>
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] text-fg">
          <PlayCircle size={13} aria-hidden="true" /> Demo video · 7:50
        </span>
      </div>
    );
  }
  if (project.image) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-line/[0.08] bg-raised ${
          project.image.aspect === 'video' ? 'aspect-video' : 'aspect-[16/10]'
        }`}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }
  return null;
}

export function ProjectCard({ project, wide = false, priority = false, sizes = '(min-width: 1024px) 40vw, 100vw' }) {
  return (
    <article
      className={`card group flex h-full flex-col p-4 sm:p-5 ${
        wide ? 'lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-8' : ''
      }`}
      data-reveal
    >
      <Media project={project} sizes={sizes} priority={priority} />
      <div className={`flex flex-1 flex-col px-1 pt-5 ${wide ? 'lg:pt-0' : ''}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{project.kind}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-1 text-[15px] text-fg/85">{project.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
        {project.metrics ? (
          <dl className="mt-4 flex flex-wrap gap-6">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold text-fg">{m.value}</span>
                  <span className="text-xs text-muted">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.stack.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Links project={project} />
        </div>
      </div>
    </article>
  );
}
