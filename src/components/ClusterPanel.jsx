'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/src/store/useStore';
import { getClusterColor } from '@/src/lib/colorMap';
import { X } from 'lucide-react';

export function ClusterPanel() {
  const { selectedNode, clearSelection } = useStore();

  if (!selectedNode || selectedNode.type !== 'cluster') {
    return null;
  }

  const cluster = selectedNode.skills;
  const color = getClusterColor(selectedNode.cluster);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-black/95 backdrop-blur-lg border-l border-gray-800 z-40 overflow-y-auto"
        style={{ boxShadow: `-10px 0 30px ${color}20` }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{cluster.name}</h2>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {selectedNode.cluster.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
            <div className="space-y-2">
              {cluster.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
                >
                  <span className="text-gray-200 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {cluster.tools.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {cluster.experience && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Experience</h3>
              <p className="text-gray-300">{cluster.experience}</p>
            </div>
          )}

          {cluster.projects && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
              <p className="text-gray-300">{cluster.projects} projects in this domain</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

