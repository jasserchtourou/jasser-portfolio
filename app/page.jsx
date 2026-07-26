'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { NavBar } from '@/src/components/NavBar';
import experienceData from '@/src/data/experience.json';
import skillsData from '@/src/data/skills.json';
import { getClusterColor } from '@/src/lib/colorMap';
import { Play, ExternalLink } from 'lucide-react';
import anime from 'animejs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function About() {
  const core = skillsData.core;
  const [showVideo, setShowVideo] = useState(false);
  const [imageError, setImageError] = useState(false);
  const plugPlaiExp = experienceData.experience.find(exp => exp.company === 'Plug&Plai');

  useEffect(() => {
    anime.timeline({ easing: 'easeOutQuad', duration: 700 })
      .add({ targets: '.hero-title span', translateY: [50, 0], opacity: [0, 1], delay: anime.stagger(80) })
      .add({ targets: '.hero-subtitle', opacity: [0, 1], translateY: [20, 0], duration: 600 }, '-=500')
      .add({ targets: '.hero-links a', opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(100), duration: 500 }, '-=400');
  }, []);

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#0A0A0A' }}>
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/2 top-12 w-[420px] h-[420px] rounded-full bg-red-500/10 blur-3xl -translate-x-1/2 animate-pulse-slow" />
          <div className="absolute right-10 top-40 w-[280px] h-[280px] rounded-full bg-neural-crimson/10 blur-3xl animate-pulse-slow" />
          <div className="absolute left-10 top-32 w-[220px] h-[220px] rounded-full bg-neural-hot/10 blur-3xl animate-pulse-slow" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />
        </div>
        {/* Hero Section with Photo and Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse"
                style={{ 
                  background: 'linear-gradient(135deg, #FF0033, #D00025)',
                  transform: 'scale(1.1)'
                }}
              />
              <div className="relative rounded-full p-1" style={{ background: 'linear-gradient(135deg, #FF0033, #D00025)' }}>
                <div className="relative rounded-full overflow-hidden bg-black w-[200px] h-[200px]">
                  {!imageError ? (
                    <Image
                      src="/images/jasser-photo.png"
                      alt="Jasser Chtourou"
                      width={200}
                      height={200}
                      className="rounded-full object-cover w-full h-full"
                      priority
                      unoptimized
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full rounded-full flex items-center justify-center text-6xl font-bold"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF0033, #D00025)',
                        color: 'white'
                      }}
                    >
                      JC
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-neural-red via-neural-crimson to-neural-hot bg-clip-text text-transparent hero-title">
            <span className="block">Jasser Chtourou</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-6">AI Engineer - Python & Backend Systems</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            {core.summary}
          </p>

          {/* Primary contact buttons removed — the detailed action buttons below are kept */}

          {/* Featured Project Video - Plug&Plai */}
          {plugPlaiExp && plugPlaiExp.hasVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-5xl mx-auto mb-16"
            >
              <div className="bg-gradient-to-r from-neural-red/20 via-neural-crimson/20 to-neural-hot/20 rounded-2xl p-8 border-2 border-neural-red/40 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(255, 0, 51, 0.3)' }}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">🎯 Featured Project</h2>
                    <p className="text-xl text-gray-300">Knowledge Base Management System</p>
                    <p className="text-sm text-gray-400 mt-1">Plug&Plai • Final Year Engineering Internship</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-4 py-2 bg-neural-red/40 border-2 border-neural-red rounded-full text-neural-red text-sm font-bold animate-pulse">
                      ⭐ Latest Work
                    </span>
                    <span className="px-3 py-1 bg-neural-crimson/30 border border-neural-crimson rounded-full text-neural-crimson text-xs">
                      RAG • GPT-4 • FastAPI
                    </span>
                  </div>
                </div>
                
                {plugPlaiExp.featuredProject && (
                  <div className="mb-6 p-4 bg-black/40 rounded-lg border border-neural-red/20">
                    <p className="text-gray-300 mb-3">{plugPlaiExp.featuredProject.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plugPlaiExp.featuredProject.features.map((feature, i) => (
                        <div key={i} className="flex items-start text-sm text-gray-400">
                          <span className="mr-2 text-neural-red">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {showVideo ? (
                  <div className="bg-black rounded-xl overflow-hidden border-2 border-neural-red/50">
                    <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                      {/* Try local video first, then LinkedIn embed */}
                      <video
                        className="absolute top-0 left-0 w-full h-full object-cover hidden"
                        id="local-video"
                        controls
                        onLoadedData={(e) => {
                          // If local video loads, show it and hide iframe
                          e.target.classList.remove('hidden');
                          const iframe = document.getElementById('linkedin-video-iframe');
                          if (iframe) iframe.style.display = 'none';
                        }}
                      >
                        <source src="/videos/plug-plai-demo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* LinkedIn Video Embed */}
                      <iframe
                        id="linkedin-video-iframe"
                        src="https://www.linkedin.com/embed/feed/update/urn:li:activity:7356634435653353474"
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        title="Plug&Plai Knowledge Base System Demo"
                        style={{ border: 'none' }}
                        onLoad={() => {
                          // Check if iframe loaded successfully
                          setTimeout(() => {
                            const iframe = document.getElementById('linkedin-video-iframe');
                            try {
                              // Try to access iframe content (will fail if cross-origin)
                              if (iframe && iframe.contentWindow) {
                                // Iframe loaded
                              }
                            } catch (e) {
                              // Cross-origin - this is normal, iframe might still work
                            }
                          }, 1000);
                        }}
                      />
                      
                      {/* Fallback if embed doesn't work */}
                      <div 
                        id="video-fallback" 
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black hidden"
                      >
                        <div className="text-center p-8 max-w-2xl">
                          <div className="mb-6">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 0, 51, 0.2)' }}>
                              <Play size={40} className="text-neural-red ml-1" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Video Preview</h3>
                            <p className="text-gray-300 mb-6">
                              Click below to watch the complete demonstration on LinkedIn
                            </p>
                          </div>
                          <a
                            href={plugPlaiExp.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neural-red to-neural-crimson hover:from-neural-crimson hover:to-neural-hot rounded-lg transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
                            style={{ boxShadow: '0 0 20px rgba(255, 0, 51, 0.5)' }}
                          >
                            <Play size={24} />
                            Watch on LinkedIn
                          </a>
                          <p className="text-gray-500 text-sm mt-4">
                            Opens in a new tab
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-900/50 flex items-center justify-between border-t border-gray-800">
                      <div>
                        <p className="text-gray-400 text-sm">📹 Complete walkthrough of all 3 features</p>
                        <p className="text-gray-500 text-xs mt-1">Knowledge Base • Release Notes • Gap Identification</p>
                      </div>
                      <button
                        onClick={() => setShowVideo(false)}
                        className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 hover:bg-gray-800 rounded"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="bg-black rounded-xl p-16 border-2 border-neural-red/30 cursor-pointer hover:border-neural-red/80 transition-all group relative overflow-hidden"
                    onClick={() => setShowVideo(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neural-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex flex-col items-center justify-center">
                      <div
                        className="w-32 h-32 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                        style={{ 
                          backgroundColor: 'rgba(255, 0, 51, 0.2)',
                          boxShadow: '0 0 30px rgba(255, 0, 51, 0.5)'
                        }}
                      >
                        <Play size={64} className="text-neural-red ml-3" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Watch Full Demo Video</h3>
                      <p className="text-gray-400 text-center max-w-2xl mb-6 leading-relaxed">
                        See how I built a complete Knowledge Base System with RAG engine, automated release notes generation from video transcripts, and real-time gap identification for Plug&Plai's voice assistants. The system improves accuracy, tracks missing information, and updates itself automatically.
                      </p>
                      <div className="flex gap-4">
                        <button
                          className="px-8 py-3 bg-gradient-to-r from-neural-red to-neural-crimson hover:from-neural-crimson hover:to-neural-hot rounded-lg transition-all transform hover:scale-105 font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowVideo(true);
                          }}
                        >
                          ▶ Play Video
                        </button>
                        <a
                          href={plugPlaiExp.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-6 py-3 rounded-lg transition-colors border-2 flex items-center gap-2"
                          style={{ 
                            backgroundColor: 'rgba(255, 0, 51, 0.1)', 
                            borderColor: '#FF0033',
                            color: '#FF0033'
                          }}
                        >
                          <ExternalLink size={18} />
                          Open on LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-6 flex-wrap"
          >
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
            <Link
              href="/projects"
              className="px-6 py-3 bg-gradient-to-r from-neural-red to-neural-crimson hover:from-neural-crimson hover:to-neural-hot rounded-lg transition-all transform hover:scale-105"
            >
              View Projects →
            </Link>
          </motion.div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-neural-red">Experience</h2>
          <div className="space-y-8">
            {experienceData.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
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

        {/* Education Section */}
        {experienceData.education && experienceData.education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-neural-red">Education</h2>
            <div className="space-y-6">
              {experienceData.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="bg-gradient-to-r from-neural-red/10 to-neural-crimson/10 border-2 border-neural-red/30 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                      <p className="text-neural-red text-lg">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">{edu.period}</p>
                      <p className="text-gray-500 text-sm">{edu.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{edu.description}</p>
                  {edu.achievements && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Achievements:</h4>
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-start">
                            <span className="mr-2 text-neural-red">🏆</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Languages */}
        {experienceData.languages && experienceData.languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-neural-red">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {experienceData.languages.map((language, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-white font-semibold text-lg">{language.name}</h3>
                  <p className="text-gray-400 mt-1">{language.level}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Links to Projects and Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/projects"
              className="bg-gradient-to-r from-neural-red/10 to-neural-crimson/10 border-2 border-neural-red/30 rounded-xl p-8 hover:border-neural-red/60 transition-all group"
            >
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neural-red transition-colors">
                🎯 Featured Projects
              </h3>
              <p className="text-gray-400 mb-4">
                Explore all my AI engineering projects with videos, screenshots, and detailed descriptions
              </p>
              <span className="text-neural-red font-semibold group-hover:underline">
                View All Projects →
              </span>
            </Link>
            
            <Link
              href="/skills"
              className="bg-gradient-to-r from-neural-red/10 to-neural-crimson/10 border-2 border-neural-red/30 rounded-xl p-8 hover:border-neural-red/60 transition-all group"
            >
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neural-red transition-colors">
                ⚡ Skills & Expertise
              </h3>
              <p className="text-gray-400 mb-4">
                Comprehensive overview of technical skills, tools, and expertise across AI domains
              </p>
              <span className="text-neural-red font-semibold group-hover:underline">
                View All Skills →
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

