import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jasser Portfolio — Jasser Chtourou | AI Engineer',
  description: 'AI Engineer Portfolio - Data Science Engineer with Highest Honors. Specialized in RAG, NLP, Voice AI, Computer Vision, and Time Series.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

