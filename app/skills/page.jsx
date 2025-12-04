'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/src/components/NavBar';
import skillsData from '@/src/data/skills.json';
import { getClusterColor } from '@/src/lib/colorMap';

export default function Skills() {
  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#0A0A0A' }}>
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neural-red to-neural-crimson bg-clip-text text-transparent">
            Skills & Expertise
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive overview of technical skills, tools, and expertise across AI domains
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {Object.entries(skillsData.skills).map(([key, skill], index) => {
            const color = getClusterColor(key);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 border rounded-xl p-6 hover:border-opacity-60 transition-all"
                style={{ borderColor: `${color}40` }}
              >
                <h3
                  className="text-2xl font-semibold mb-4"
                  style={{ color: color }}
                >
                  {skill.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-md text-sm"
                        style={{ backgroundColor: `${color}15`, color: color, border: `1px solid ${color}40` }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Tools & Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-800 text-gray-400 rounded text-xs"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {skill.experience && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                      Experience: <span className="text-gray-400">{skill.experience}</span>
                    </p>
                    {skill.projects && (
                      <p className="text-xs text-gray-500 mt-1">
                        Projects: <span className="text-gray-400">{skill.projects}</span>
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Core Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-neural-red/10 to-neural-crimson/10 border-2 border-neural-red/30 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">About My Expertise</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {skillsData.core.summary}
          </p>
          
          {skillsData.core.metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {Object.entries(skillsData.core.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-black/30 rounded-lg p-4 border border-neural-red/20"
                >
                  <div className="text-xs text-gray-400 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold text-neural-red">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

