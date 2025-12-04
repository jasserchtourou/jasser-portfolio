'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/src/components/NavBar';
import projectsData from '@/src/data/projects.json';
import experienceData from '@/src/data/experience.json';
import { getClusterColor } from '@/src/lib/colorMap';
import { Play, ExternalLink, Github, Check, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Projects() {
  const [expandedProjects, setExpandedProjects] = useState({});
  const [projectVideos, setProjectVideos] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

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
            Featured Projects
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A collection of AI engineering projects showcasing expertise in RAG, NLP, Voice AI, Computer Vision, and Time Series
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-12">
          {projectsData.projects.map((project, index) => {
            const showVideo = projectVideos[project.id];
            const hasVideo = project.hasVideo || project.demoVideo || project.demo;
            const hasImages = project.images && project.images.length > 0;
            const color = getClusterColor(project.cluster);
            
            // Find related experience for context
            let projectContext = '';
            if (project.id === 'knowledge-base-management') {
              projectContext = 'Plug&Plai • Final Year Engineering Internship';
            } else {
              const relatedExp = experienceData.experience.find(exp => 
                exp.technologies.some(tech => project.techStack.includes(tech))
              );
              if (relatedExp) {
                projectContext = `${relatedExp.company} • ${relatedExp.position}`;
              }
            }

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-r from-neural-red/10 to-neural-crimson/10 border-2 border-neural-red/30 rounded-xl p-8 hover:border-neural-red/60 transition-all"
              >
                {/* Featured Badge & Title */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-neural-red to-neural-crimson rounded-full text-sm font-bold text-white">
                          🎯 Featured Project
                        </span>
                        {hasVideo && project.demoVideo && (
                          <span 
                            className="px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2"
                            style={{ backgroundColor: `${color}30`, color: color, border: `1px solid ${color}` }}
                          >
                            <Play size={14} />
                            Demo Available
                          </span>
                        )}
                        {hasImages && project.images && project.images.length > 0 && (
                          <span 
                            className="px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2"
                            style={{ backgroundColor: `${color}30`, color: color, border: `1px solid ${color}` }}
                          >
                            <ImageIcon size={14} />
                            Screenshots Available
                          </span>
                        )}
                      </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                    {projectContext && (
                      <p className="text-gray-400 text-base mb-4">{projectContext}</p>
                    )}
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.slice(0, 8).map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-800/70 text-gray-300 rounded-md text-sm border border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 8 && (
                    <span className="px-3 py-1.5 bg-gray-800/50 text-gray-500 rounded-md text-sm">
                      +{project.techStack.length - 8} more
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">{project.description}</p>

                {/* Features List */}
                <div className="mb-6">
                  <h4 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <span className="text-neural-red">⭐</span>
                    Key Features & Achievements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-3 text-gray-300">
                        <Check size={18} className="text-neural-red mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images Gallery - Only show if images exist */}
                {hasImages && project.images && project.images.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <ImageIcon size={18} className="text-neural-red" />
                      Project Screenshots & Media
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-800 hover:border-neural-red/60 transition-all"
                          onClick={() => setSelectedImage(image)}
                        >
                          {image.type === 'image' && image.url ? (
                            <Image
                              src={image.url}
                              alt={`${project.title} - Screenshot ${imgIndex + 1}`}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              unoptimized
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold transition-opacity">
                              Click to enlarge
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Section - Only show if video exists */}
                {hasVideo && project.demoVideo && (
                  <div className="mb-6">
                    {showVideo ? (
                      <div className="bg-black rounded-xl p-4 border-2 border-neural-red/30">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-base font-semibold text-white flex items-center gap-2">
                            <Play size={18} className="text-neural-red" />
                            Demo Video
                          </h4>
                          <button
                            onClick={() => setProjectVideos({ ...projectVideos, [project.id]: false })}
                            className="text-gray-400 hover:text-white transition-colors text-sm px-3 py-1 hover:bg-gray-800 rounded"
                          >
                            Hide
                          </button>
                        </div>
                        {project.demoVideo && project.demoVideo.includes('youtube.com') ? (
                          <div className="w-full rounded-lg overflow-hidden bg-black" style={{ paddingBottom: '56.25%', position: 'relative', height: 0 }}>
                            <iframe 
                              src={project.demoVideo}
                              width="100%" 
                              height="100%"
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute top-0 left-0 w-full h-full"
                              title={`${project.title} Demo Video`}
                            />
                          </div>
                        ) : project.demoVideo && project.demoVideo.includes('linkedin.com') ? (
                          <div className="w-full rounded-lg overflow-hidden bg-black">
                            {(() => {
                              let embedUrl = project.demoVideo;
                              if (embedUrl.includes('/embed/')) {
                                // Already correct format
                              } else if (embedUrl.includes('/posts/')) {
                                embedUrl = embedUrl.replace('/posts/', '/embed/posts/');
                              } else if (embedUrl.includes('/activity-')) {
                                const activityId = embedUrl.match(/activity-(\d+)/)?.[1];
                                if (activityId) {
                                  embedUrl = `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;
                                }
                              }
                              return (
                                <iframe 
                                  src={embedUrl} 
                                  width="100%" 
                                  height="500" 
                                  frameBorder="0" 
                                  allowFullScreen
                                  className="w-full"
                                  title={`${project.title} Demo Video`}
                                />
                              );
                            })()}
                          </div>
                        ) : project.demo ? (
                          <div className="w-full">
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors border-2 border-neural-red/30"
                            >
                              <div className="text-center">
                                <Play size={48} className="text-neural-red mx-auto mb-2" />
                                <p className="text-white font-semibold">Watch Demo on External Link</p>
                                <p className="text-gray-400 text-sm mt-1">Click to open</p>
                              </div>
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <button
                        onClick={() => setProjectVideos({ ...projectVideos, [project.id]: true })}
                        className="w-full bg-black/50 hover:bg-black/70 border-2 border-neural-red/30 hover:border-neural-red/60 rounded-lg p-8 transition-all group"
                      >
                        <div className="flex items-center justify-center gap-4">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Play size={32} style={{ color: color }} className="ml-1" />
                          </div>
                          <div className="text-left">
                            <p className="text-white font-bold text-lg">Watch Demo Video</p>
                            <p className="text-gray-400 text-sm">Click to view project demonstration</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4 pt-6 border-t border-gray-800">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <Github size={18} />
                      GitHub
                    </a>
                  )}
                  {project.demo && !project.demoVideo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
                      style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}50` }}
                    >
                      <ExternalLink size={18} />
                      View Demo
                    </a>
                  )}
                  {project.linkedinProject && (
                    <a
                      href={project.linkedinProject}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors border"
                      style={{ backgroundColor: `${color}10`, color: color, borderColor: `${color}50` }}
                    >
                      <ExternalLink size={18} />
                      View on LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-neural-red transition-colors text-2xl font-bold"
          >
            ×
          </button>
          {selectedImage.type === 'image' && (
            <Image
              src={selectedImage.url}
              alt="Full size image"
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              unoptimized
            />
          )}
        </div>
      )}
    </main>
  );
}

