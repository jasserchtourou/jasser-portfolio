'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/src/store/useStore';
import { getClusterColor, hexToRgb } from '@/src/lib/colorMap';
import * as THREE from 'three';

export function Edge({ source, target, strength = 0.5 }) {
  const lineRef = useRef();
  const { selectedNode, hoveredNode, setSelectedEdge } = useStore();
  
  const isActive = 
    (selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id)) ||
    (hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id));

  const points = useMemo(() => {
    return [
      new THREE.Vector3(source.x, source.y, source.z),
      new THREE.Vector3(target.x, target.y, target.z),
    ];
  }, [source, target]);

  const color = useMemo(() => {
    const sourceColor = getClusterColor(source.cluster);
    const targetColor = getClusterColor(target.cluster);
    return isActive ? sourceColor : '#330000';
  }, [source, target, isActive]);

  useFrame((state) => {
    if (lineRef.current) {
      // Update line positions
      points[0].set(source.x, source.y, source.z);
      points[1].set(target.x, target.y, target.z);
      lineRef.current.geometry.setFromPoints(points);
      
      // Red neon pulse animation for active edges
      if (isActive) {
        const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
        lineRef.current.material.opacity = pulse;
        lineRef.current.material.emissive = new THREE.Color(color);
        lineRef.current.material.emissiveIntensity = 0.5;
      } else {
        lineRef.current.material.opacity = 0.15;
        lineRef.current.material.emissive = new THREE.Color(0x000000);
        lineRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedEdge({ source, target });
  };

  return (
    <line 
      ref={lineRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
      }}
    >
      <bufferGeometry />
      <lineBasicMaterial
        color={color}
        transparent
        opacity={isActive ? 0.9 : 0.3}
        linewidth={isActive ? 3 : 1}
        emissive={isActive ? color : '#330000'}
      />
    </line>
  );
}

