'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/src/store/useStore';
import { getClusterColor } from '@/src/lib/colorMap';
import { X } from 'lucide-react';

export function EdgeInfo() {
  const { selectedEdge, clearEdgeSelection } = useStore();

  if (!selectedEdge) {
    return null;
  }

  const { source, target } = selectedEdge;
  const sourceColor = getClusterColor(source.cluster);
  const targetColor = getClusterColor(target.cluster);

  const getConnectionType = () => {
    if (source.type === 'core' && target.type === 'project') {
      return 'Project Connection';
    }
    if (source.type === 'core' && target.type === 'cluster') {
      return 'Skill Domain Connection';
    }
    if (source.type === 'project' && target.type === 'cluster') {
      return 'Project-Skill Association';
    }
    return 'Connection';
  };

  const getDescription = () => {
    if (source.type === 'core' && target.type === 'project') {
      return `This project is part of ${source.label}'s portfolio.`;
    }
    if (source.type === 'core' && target.type === 'cluster') {
      return `This skill domain represents a core expertise area.`;
    }
    if (source.type === 'project' && target.type === 'cluster') {
      return `This project utilizes skills from the ${target.label} domain.`;
    }
    return 'Connection between nodes';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-lg border border-gray-800 rounded-lg z-50 p-4 min-w-[300px]"
        style={{ boxShadow: `0 10px 30px ${sourceColor}20` }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{getConnectionType()}</h3>
          <button
            onClick={clearEdgeSelection}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sourceColor }}
            />
            <span className="text-gray-300 text-sm">{source.label}</span>
          </div>
          <div className="text-center text-gray-400">↓</div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: targetColor }}
            />
            <span className="text-gray-300 text-sm">{target.label}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-3">{getDescription()}</p>
      </motion.div>
    </AnimatePresence>
  );
}

