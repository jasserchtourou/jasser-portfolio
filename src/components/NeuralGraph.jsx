'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Node } from './Node';
import { Edge } from './Edge';
import { MouseControls } from './MouseControls';
import { createGraphLayout, initializeNodes, createLinks } from '@/src/lib/graphLayout';
import { useStore } from '@/src/store/useStore';
import projectsData from '@/src/data/projects.json';
import skillsData from '@/src/data/skills.json';

function GraphScene() {
  const { nodes: initialNodes } = useMemo(() => {
    const result = initializeNodes(projectsData.projects, skillsData.skills);
    console.log('Initialized nodes:', result.nodes.length, result.nodes);
    return result;
  }, []);

  const initialLinks = useMemo(() => {
    return createLinks(initialNodes, projectsData.projects);
  }, [initialNodes]);

  const [nodes, setNodes] = useState(initialNodes);
  const linksRef = useRef(initialLinks);
  const simulationRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    console.log('Current nodes state:', nodes.length, nodes);
  }, [nodes]);

  useEffect(() => {
    // Use fixed coordinate space instead of window dimensions to prevent nodes from going too far
    const width = 800;
    const height = 800;
    const depth = 800;

    // Reset any nodes that are already too far from center
    initialNodes.forEach(node => {
      if (!node.fixed) {
        const dist = Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z);
        if (dist > 300) {
          // Reset to a position closer to center
          const angle = Math.random() * Math.PI * 2;
          const radius = 100 + Math.random() * 50;
          node.x = Math.cos(angle) * radius;
          node.y = Math.sin(angle) * radius;
          node.z = (Math.random() - 0.5) * 80;
          node.vx = 0;
          node.vy = 0;
          node.vz = 0;
        }
      }
    });

    const simulation = createGraphLayout(initialNodes, initialLinks, width, height, depth);
    simulationRef.current = simulation;
    linksRef.current = initialLinks;

    const animate = () => {
      if (simulationRef.current) {
        simulationRef.current.tick();
        const updatedNodes = [...simulationRef.current.nodes];
        setNodes(updatedNodes);
        
        // Update links to reference current nodes
        linksRef.current = linksRef.current.map(link => ({
          ...link,
          source: updatedNodes.find(n => n.id === link.source.id) || link.source,
          target: updatedNodes.find(n => n.id === link.target.id) || link.target,
        }));
        
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      <Stars radius={300} depth={60} count={1000} factor={4} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#FF0033" />
      <pointLight position={[0, 0, 10]} intensity={0.8} color="#FF0033" />
      
      {nodes.map((node) => (
        <Node key={node.id} node={node} position={node} />
      ))}
      
      {linksRef.current.map((link, index) => (
        <Edge key={`${link.source.id}-${link.target.id}-${index}`} source={link.source} target={link.target} strength={link.strength} />
      ))}
    </>
  );
}

export function NeuralGraph() {
  const { clearSelection } = useStore();

  return (
    <div className="w-full h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            clearSelection();
          }
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 400]} fov={70} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={100}
          maxDistance={1500}
          autoRotate={false}
          autoRotateSpeed={0.5}
          dampingFactor={0.1}
          enableDamping={true}
          rotateSpeed={0.8}
          panSpeed={1.5}
          zoomSpeed={1.2}
        />
        <MouseControls />
        <GraphScene />
      </Canvas>
    </div>
  );
}

