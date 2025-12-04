'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/src/components/NavBar';
import experienceData from '@/src/data/experience.json';
import skillsData from '@/src/data/skills.json';
import { getClusterColor } from '@/src/lib/colorMap';

export default function About() {
  const core = skillsData.core;

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#0A0A0A' }}>
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neural-red via-neural-crimson to-neural-hot bg-clip-text text-transparent">
            Jasser Chtourou
          </h1>
          <p className="text-2xl text-gray-300 mb-6">AI Engineer</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {core.summary}
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center gap-6">
            <a
              href={`mailto:${core.contact.email}`}
              className="px-6 py-3 bg-neural-red/20 hover:bg-neural-red/30 border border-neural-red/50 rounded-lg transition-colors"
              >
                Email
              </a>
              <a
                href={core.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-neural-crimson/20 hover:bg-neural-crimson/30 border border-neural-crimson/50 rounded-lg transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={core.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-neural-hot/20 hover:bg-neural-hot/30 border border-neural-hot/50 rounded-lg transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-neural-red">Experience</h2>
          <div className="space-y-8">
            {experienceData.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-neural-red/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exp.position}</h3>
                    <p className="text-neural-red">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">{exp.period}</p>
                    <p className="text-gray-500 text-sm">{exp.location}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{exp.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start">
                        <span className="mr-2 text-neural-red">▸</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-neural-red">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skillsData.skills).map(([key, skill]) => {
              const color = getClusterColor(key);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-gray-900/50 border rounded-lg p-6"
                  style={{ borderColor: `${color}40` }}
                >
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: color }}
                  >
                    {skill.name}
                  </h3>
                  <div className="space-y-2">
                    {skill.skills.map((s, i) => (
                      <div key={i} className="text-gray-300 text-sm">
                        • {s}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-2">Tools:</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

