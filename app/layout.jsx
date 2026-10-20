import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { SITE_URL, profile } from '@/src/data/profile';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const description =
  'Jasser Chtourou, AI Backend Engineer in Hannover. RAG pipelines, multi-agent LLM systems and Python backends (FastAPI, Django, PostgreSQL/pgvector), owned end-to-end from architecture to deployment.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: ['AI Backend Engineer', 'LLM', 'RAG', 'Multi-agent systems', 'FastAPI', 'Python', 'pgvector', 'LangGraph', 'Hannover'],
  authors: [{ name: profile.name, url: SITE_URL }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: profile.name,
    title: `${profile.name} | ${profile.role}`,
    description,
    locale: 'en_US',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: `${profile.name}, ${profile.role}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} | ${profile.role}`,
    description,
    images: ['/og/home.png'],
  },
  icons: { icon: '/icon.svg' },
};

export const viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
};

// Hides [data-reveal] content only once JS is known to run; if the reveal controller never
// starts (blocked or failed script), content is shown again after 4 s.
const revealBootstrap = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove('js')},4000);`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
