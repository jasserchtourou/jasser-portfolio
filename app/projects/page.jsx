import { SectionHeading } from '@/src/components/SectionHeading';
import { ProjectCard } from '@/src/components/ProjectCard';
import { projects } from '@/src/data/projects';

const description =
  'RouteFlow, SentryMesh, Plug&Chat and more: RAG systems, multi-agent LLM pipelines, LLM governance and backend platforms by Jasser Chtourou.';

export const metadata = {
  title: 'Projects',
  description,
  alternates: { canonical: '/projects' },
  openGraph: {
    url: '/projects',
    title: 'Projects | Jasser Chtourou',
    description,
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Jasser Chtourou, AI Backend Engineer' }],
  },
  twitter: { card: 'summary_large_image', title: 'Projects | Jasser Chtourou', description, images: ['/og/home.png'] },
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
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 2} sizes="(min-width: 768px) 45vw, 100vw" />
        ))}
      </div>
    </div>
  );
}
