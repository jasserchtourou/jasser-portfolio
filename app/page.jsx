import { Hero } from '@/src/components/home/Hero';
import { Flagship } from '@/src/components/home/Flagship';
import { SelectedWork, About, Experience, Skills, Education, Contact } from '@/src/components/home/Sections';
import { SITE_URL, profile } from '@/src/data/profile';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  url: SITE_URL,
  email: `mailto:${profile.contact.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Hannover', addressCountry: 'DE' },
  sameAs: [profile.contact.linkedin, profile.contact.github, profile.contact.medium],
  knowsAbout: ['Retrieval-augmented generation', 'Multi-agent systems', 'FastAPI', 'Django', 'PostgreSQL', 'pgvector', 'LangGraph'],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <Flagship />
      <SelectedWork />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
