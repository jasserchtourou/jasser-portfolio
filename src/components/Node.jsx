'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useStore } from '@/src/store/useStore';
import { getClusterColor, hexToRgb } from '@/src/lib/colorMap';
import * as THREE from 'three';

export function Node({ node, position }) {
  const meshRef = useRef();
  const { selectedNode, hoveredNode, setSelectedNode, setHoveredNode } = useStore();
  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;
  const color = getClusterColor(node.cluster);
  const rgb = hexToRgb(color);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.5 : isHovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      
      // Red neon pulse animation - more intense on hover/select
      const basePulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      if (isHovered || isSelected) {
        const hoverPulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
        meshRef.current.material.emissiveIntensity = 1.5 * hoverPulse;
      } else {
        meshRef.current.material.emissiveIntensity = 0.8 * basePulse;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedNode(node);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHoveredNode(node);
  };

  const handlePointerOut = () => {
    setHoveredNode(null);
  };

  const hasVideo = node.project?.hasVideo || node.project?.demoVideo;

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[node.radius || 20, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
      
      {/* Red neon glow effect */}
      <mesh>
        <sphereGeometry args={[(node.radius || 15) * 1.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 1.0 : 0.4}
          transparent
          opacity={isHovered || isSelected ? 0.6 : 0.3}
        />
      </mesh>
      
      {/* White highlight bloom on hover */}
      {isHovered && (
        <mesh>
          <sphereGeometry args={[(node.radius || 15) * 1.8, 32, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Video badge indicator - red pulsing ring */}
      {hasVideo && node.type === 'project' && (
        <mesh position={[0, (node.radius || 15) + 5, 0]}>
          <ringGeometry args={[8, 10, 16]} />
          <meshStandardMaterial
            color="#FF0033"
            emissive="#FF0033"
            emissiveIntensity={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Node label - show on hover/select or for cluster/core nodes */}
      {(isHovered || isSelected || node.type === 'cluster' || node.type === 'core') && (
        <Text
          position={[0, -(node.radius || 20) - 12, 0]}
          fontSize={isHovered || isSelected ? 12 : node.type === 'core' ? 14 : 8}
          color={isHovered || isSelected ? "#FFFFFF" : color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={1}
          outlineColor="#000000"
          maxWidth={150}
        >
          {node.label || node.title || node.project?.title || 'Node'}
        </Text>
      )}
    </group>
  );
}

