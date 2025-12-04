'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NavBar } from '@/src/components/NavBar';

export default function Landing() {
  return (
    <main className="relative w-full h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
      <NavBar />
      
      {/* Particle background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {typeof window !== 'undefined' && Array.from({ length: 50 }).map((_, i) => {
          const width = window.innerWidth || 1920;
          const height = window.innerHeight || 1080;
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neural-red rounded-full"
              initial={{
                x: Math.random() * width,
                y: Math.random() * height,
                opacity: Math.random(),
              }}
              animate={{
                y: [null, Math.random() * height],
                x: [null, Math.random() * width],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neural-red via-neural-crimson to-neural-hot bg-clip-text text-transparent"
        >
          Welcome to Jasser's NeuroVerse
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          An interactive 3D neural-universe portfolio exploring AI engineering projects, skills, and experience
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-neural-red to-neural-crimson text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-neural-red/50 transition-all transform hover:scale-105"
          >
            Enter the Universe
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

