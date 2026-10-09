import { SectionHeading } from '@/src/components/SectionHeading';
import { ProjectCard } from '@/src/components/ProjectCard';
import { projects } from '@/src/data/projects';

export const metadata = {
  title: 'Projects',
  description:
    'RouteFlow, SentryMesh, Plug&Chat and more: RAG systems, multi-agent LLM pipelines, LLM governance and backend platforms by Jasser Chtourou.',
  alternates: { canonical: '/projects' },
  openGraph: { url: '/projects' },
};

export default function ProjectsPage() {
  return (
    <div className="page pb-24 pt-32 sm:pt-40">
      <SectionHeading
        eyebrow="Projects"
        title="Projects and case studies."
        intro="Case studies first, then client work, thesis work and personal projects."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} sizes="(min-width: 768px) 45vw, 100vw" />
        ))}
      </div>
    </div>
  );
}
