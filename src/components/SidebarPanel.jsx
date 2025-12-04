'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/src/store/useStore';
import { getClusterColor } from '@/src/lib/colorMap';
import { X } from 'lucide-react';
import skillsData from '@/src/data/skills.json';

export function SidebarPanel() {
  const { selectedNode, clearSelection } = useStore();

  if (!selectedNode || selectedNode.type !== 'core') {
    return null;
  }

  const core = skillsData.core;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-black/95 backdrop-blur-lg border-l border-gray-800 z-40 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Jasser AI Core</h2>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed">{core.summary}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${core.contact.email}`}
                className="block text-neural-purple hover:text-neural-blue transition-colors"
              >
                {core.contact.email}
              </a>
              <a
                href={core.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neural-purple hover:text-neural-blue transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={core.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neural-purple hover:text-neural-blue transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
            <div className="space-y-2">
              <div className="text-gray-300">RAG & NLP</div>
              <div className="text-gray-300">Voice AI</div>
              <div className="text-gray-300">Computer Vision</div>
              <div className="text-gray-300">Time Series</div>
              <div className="text-gray-300">Machine Learning</div>
              <div className="text-gray-300">Full-Stack Development</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

