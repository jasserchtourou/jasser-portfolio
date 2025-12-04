'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NavBar } from '@/src/components/NavBar';
import { NeuralGraph } from '@/src/components/NeuralGraph';
import { ProjectPanel } from '@/src/components/ProjectPanel';
import { SidebarPanel } from '@/src/components/SidebarPanel';
import { ClusterPanel } from '@/src/components/ClusterPanel';
import { EdgeInfo } from '@/src/components/EdgeInfo';

export default function Universe() {
  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      <NavBar />
      <NeuralGraph />
      <ProjectPanel />
      <SidebarPanel />
      <ClusterPanel />
      <EdgeInfo />
      
      {/* Instructions overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-neural-red/30 max-w-sm"
      >
        <h3 className="text-neural-red font-semibold mb-2">Controls</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>🖱️ Move mouse to navigate</li>
          <li>🖱️ Drag to rotate manually</li>
          <li>🔍 Scroll to zoom in/out</li>
          <li>🖱️ Right-click + drag to pan</li>
          <li>👆 Click nodes to see details</li>
          <li>🔗 Click edges to see connections</li>
          <li>✨ Hover to highlight & show labels</li>
        </ul>
      </motion.div>
    </main>
  );
}

