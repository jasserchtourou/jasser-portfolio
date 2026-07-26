'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import skillsData from '@/src/data/skills.json';

export function NavBar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neural-red/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold mr-12 bg-gradient-to-r from-neural-red to-neural-crimson bg-clip-text text-transparent">
            Jasser Chtourou
          </Link>
        </div>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-8 whitespace-nowrap">
            <li>
              <Link href="/" className="text-gray-300 hover:text-neural-red transition-colors px-2 py-1">
                About
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-gray-300 hover:text-neural-red transition-colors px-2 py-1">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/skills" className="text-gray-300 hover:text-neural-red transition-colors px-2 py-1">
                Skills
              </Link>
            </li>
            <li>
              <a href={skillsData.core.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-neural-red transition-colors px-2 py-1">
                GitHub
              </a>
            </li>
            <li>
              <a href={skillsData.core.contact.medium} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-neural-red transition-colors px-2 py-1">
                Medium
              </a>
            </li>
            <li>
              <a href={skillsData.core.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-neural-red transition-colors px-2 py-1">
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.nav>
  );
}

