'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/src/store/useStore';
import * as THREE from 'three';

export function MouseControls() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ azimuthal: 0, polar: 0 });
  const isDraggingRef = useRef(false);
  const isEnabledRef = useRef(true);
  const { selectedNode } = useStore();
  const sphericalRef = useRef(new THREE.Spherical(400, Math.PI / 2, 0));

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isEnabledRef.current || isDraggingRef.current || selectedNode) return;
      
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate mouse position relative to center (-1 to 1)
      const normalizedX = (clientX - centerX) / centerX;
      const normalizedY = (clientY - centerY) / centerY;
      
      mouseRef.current = { x: normalizedX, y: normalizedY };
      
      // Set target rotation based on mouse position
      const sensitivity = 0.8; // Reduced to allow more manual control
      targetRotationRef.current = {
        azimuthal: normalizedX * Math.PI * sensitivity, // Horizontal rotation
        polar: (Math.PI / 2) + (normalizedY * Math.PI * 0.3 * sensitivity), // Vertical rotation
      };
    };

    const handleMouseDown = (e) => {
      const target = e.target;
      if (target.tagName === 'CANVAS' || target.closest('canvas')) {
        isDraggingRef.current = true;
        isEnabledRef.current = false;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        isEnabledRef.current = true;
      }, 200);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
      targetRotationRef.current = { azimuthal: 0, polar: Math.PI / 2 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [selectedNode]);

  useFrame(() => {
    if (!isEnabledRef.current || isDraggingRef.current || selectedNode) return;

    const { x, y } = mouseRef.current;
    if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05) {
      // If mouse is near center, gradually return to default
      targetRotationRef.current.azimuthal *= 0.95;
      targetRotationRef.current.polar = (targetRotationRef.current.polar * 0.95) + (Math.PI / 2 * 0.05);
    }

    // Smoothly interpolate camera rotation
    const lerpFactor = 0.08; // Faster interpolation for more responsive feel
    
    // Update spherical coordinates
    sphericalRef.current.theta += (targetRotationRef.current.azimuthal - sphericalRef.current.theta) * lerpFactor;
    sphericalRef.current.phi += (targetRotationRef.current.polar - sphericalRef.current.phi) * lerpFactor;
    
    // Clamp phi to prevent flipping
    sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi));
    
    // Update camera position
    camera.position.setFromSpherical(sphericalRef.current);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

