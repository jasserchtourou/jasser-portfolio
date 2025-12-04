'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/src/store/useStore';
import { getClusterColor } from '@/src/lib/colorMap';
import { X, Github, ExternalLink, Play } from 'lucide-react';
import { useState } from 'react';

export function ProjectPanel() {
  const { selectedNode, clearSelection } = useStore();
  const [showVideo, setShowVideo] = useState(false);

  if (!selectedNode || selectedNode.type !== 'project') {
    return null;
  }

  const project = selectedNode.project;
  const color = getClusterColor(selectedNode.cluster);
  const hasVideo = project.hasVideo || project.demoVideo;

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
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {project.cluster.replace('-', ' ').toUpperCase()}
            </span>
            {hasVideo && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
                style={{ backgroundColor: `${color}30`, color: color, border: `1px solid ${color}` }}
              >
                <Play size={14} />
                Demo Available
              </span>
            )}
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Key Achievements</h3>
            <ul className="space-y-2">
              {project.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="mr-2" style={{ color: color }}>▸</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: `${color}15`, color: color, border: `1px solid ${color}40` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Github size={18} />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: `${color}20`, color: color }}
              >
                <ExternalLink size={18} />
                Demo
              </a>
            )}
          </div>

          {hasVideo && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Demo Video</h3>
              {showVideo ? (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  {project.demoVideo && project.demoVideo.includes('linkedin.com') ? (
                    <div className="space-y-4">
                      {/* Try LinkedIn embed first */}
                      <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={`https://www.linkedin.com/embed/feed/update/${project.demoVideo.split('activity-')[1]?.split('-')[0] ? `urn:li:activity:${project.demoVideo.split('activity-')[1]?.split('-')[0]}` : project.demoVideo.replace('/posts/', '/embed/posts/')}`}
                          className="absolute top-0 left-0 w-full h-full"
                          frameBorder="0"
                          allow="autoplay; encrypted-media; fullscreen"
                          allowFullScreen
                          title="Demo Video"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        {/* Fallback */}
                        <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center hidden">
                          <div className="text-center p-6">
                            <p className="text-gray-300 mb-4">Video preview unavailable</p>
                            <a
                              href={project.demoVideo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
                              style={{ backgroundColor: `${color}20`, color: color }}
                            >
                              <Play size={20} />
                              Watch on LinkedIn
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <video
                        controls
                        className="w-full rounded-lg"
                        src={project.demoVideo || '/videos/plug-plai-demo.mp4'}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  <button
                    onClick={() => setShowVideo(false)}
                    className="mt-2 text-sm text-gray-400 hover:text-white"
                  >
                    Hide Video
                  </button>
                </div>
              ) : (
                <div
                  className="bg-gray-900 rounded-lg p-8 border border-gray-800 cursor-pointer hover:border-opacity-50 transition-all group"
                  onClick={() => setShowVideo(true)}
                  style={{ borderColor: `${color}40` }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Play size={32} style={{ color: color }} />
                    </div>
                    <p className="text-gray-300 text-sm">Click to watch demo video</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {project.metrics && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-900 rounded-lg p-3 border border-gray-800"
                    style={{ borderColor: `${color}20` }}
                  >
                    <div className="text-xs text-gray-400 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-lg font-semibold" style={{ color: color }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.architecture && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Architecture</h3>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <div className="text-gray-500 text-sm text-center py-8">
                  Architecture diagram placeholder
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

