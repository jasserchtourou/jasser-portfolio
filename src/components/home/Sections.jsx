import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ProjectCard } from '@/src/components/ProjectCard';
import { SplitWords } from '@/src/components/SplitWords';
import { profile, education, certifications, languages } from '@/src/data/profile';
import { experience, internships } from '@/src/data/experience';
import { skills } from '@/src/data/skills';
import { homeProjects, projects } from '@/src/data/projects';

export function SelectedWork() {
  const [sentry, ...rest] = homeProjects;
  return (
    <section id="work" aria-labelledby="work-title" className="py-24 sm:py-32">
      <div className="page">
        <SectionHeading
          id="work-title"
          eyebrow="Selected work"
          title="Built end to end."
          intro="An LLM governance gateway, multi-tenant RAG in production, ML services with live data, and client work shipped with Kamka IT."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ProjectCard project={sentry} wide sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          {rest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <div className="mt-10" data-reveal>
          <Link href="/projects" className="btn-ghost">
            All {projects.length} projects <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line/[0.08] py-24 sm:py-32">
      <div className="page grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
        <div data-reveal>
          <div className="relative mx-auto aspect-[480/498] w-56 overflow-hidden rounded-2xl border border-line/10 bg-raised lg:mx-0 lg:w-full">
            <Image src={profile.photo} alt="Portrait of Jasser Chtourou" fill sizes="320px" className="object-cover" />
          </div>
        </div>
        <div>
          <SectionHeading id="about-title" eyebrow="About" title="Backend first. AI where it earns its place." />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p data-reveal>
              Most of my work sits between a product and a model: the ingestion, retrieval, orchestration and APIs that
              make an LLM useful, and the tests, logging and guardrails that make it safe to ship.
            </p>
            {profile.summary.slice(1).map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
            <p data-reveal>
              {profile.location}. {profile.workPermit}. {profile.availability}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Role({ item }) {
  return (
    <li className="relative grid gap-3 border-t border-line/[0.08] py-8 md:grid-cols-[220px_1fr] md:gap-10" data-reveal>
      <div>
        <p className="font-mono text-sm text-fg/90">{item.period}</p>
        {item.location ? <p className="mt-1 text-sm text-muted">{item.location}</p> : null}
        {item.current ? (
          <p className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Current
          </p>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {item.role} <span className="text-muted">· {item.company}</span>
        </h3>
        <p className="mt-1 text-sm text-subtle">{[item.context, item.type].filter(Boolean).join(' · ')}</p>
        <ul className="mt-4 space-y-2.5">
          {item.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-muted">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        {item.link ? (
          <a
            href={item.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-fg hover:text-accent-soft"
          >
            {item.link.label} <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
        {item.stack ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
            {item.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line/[0.08] py-24 sm:py-32">
      <div className="page">
        <SectionHeading
          id="experience-title"
          eyebrow="Experience"
          title="What I built, and where."
          intro="From a 2M+ user Django backend to owning the RAG stack of an AI startup as its only AI backend engineer."
        />
        <ol className="mt-14">
          {experience.map((item) => (
            <Role key={`${item.company}-${item.period}`} item={item} />
          ))}
        </ol>
        <h3 className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-subtle" data-reveal>
          Mandatory university internships
        </h3>
        <ol className="mt-4">
          {internships.map((item) => (
            <Role key={item.company} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-t border-line/[0.08] py-24 sm:py-32">
      <div className="page">
        <SectionHeading id="skills-title" eyebrow="Skills" title="The stack I work in." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group} className="bg-ink p-6" data-reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent-soft">{g.group}</h3>
              <ul className="mt-4 space-y-1.5 text-[15px] text-fg/85">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="border-t border-line/[0.08] py-24 sm:py-32">
      <div className="page grid gap-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading id="education-title" eyebrow="Education" title="Engineering, AI & data science." />
          <ol className="mt-10 space-y-5">
            {education.map((e) => (
              <li key={e.degree} className="card p-6" data-reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{e.degree}</h3>
                  <p className="font-mono text-sm text-muted">{e.period}</p>
                </div>
                <p className="mt-1 text-muted">
                  {e.institution} · {e.location}
                </p>
                {e.notes.length ? (
                  <ul className="mt-4 space-y-1.5 text-[15px] text-fg/80">
                    {e.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-10">
          <div data-reveal>
            <h3 className="eyebrow">Certifications</h3>
            <ul className="mt-5 space-y-4">
              {certifications.featured.map((c) => (
                <li key={c.name}>
                  <p className="font-medium text-fg">{c.name}</p>
                  <p className="text-sm text-muted">{[c.issuer, c.date, c.status].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
            <details className="group mt-6 rounded-xl border border-line/[0.08] bg-panel/60">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
                All {certifications.total} certifications
                <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="space-y-5 border-t border-line/[0.08] px-4 pb-5 pt-4">
                {certifications.groups.map((g) => (
                  <div key={g.theme}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{g.theme}</p>
                    <ul className="mt-2 space-y-1.5">
                      {g.items.map((c) => (
                        <li key={c.name} className="text-sm leading-snug text-fg/85">
                          {c.name} <span className="text-muted">· {c.issuer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>
          <div data-reveal>
            <h3 className="eyebrow">Languages</h3>
            <dl className="mt-5 grid grid-cols-2 gap-4">
              {languages.map((l) => (
                <div key={l.name}>
                  <dt className="text-fg">{l.name}</dt>
                  <dd className="text-sm text-muted">{l.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { contact } = profile;
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line/[0.08] py-28 sm:py-40">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-accent/[0.12] blur-[120px]" />
      <div className="page text-center">
        <p className="eyebrow" data-reveal>
          Contact
        </p>
        <h2 id="contact-title" className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight">
          <SplitWords text="Need LLMs to work in production? Let’s talk." />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted" data-reveal>
          {profile.availability}. Based in {profile.location.split(',')[0]}, with a {profile.workPermit}.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3" data-reveal>
          <a href={`mailto:${contact.email}`} className="btn-primary">
            <Mail size={16} aria-hidden="true" /> {contact.email}
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={contact.article} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Read my article on RAG<span className="sr-only"> (Medium, opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
