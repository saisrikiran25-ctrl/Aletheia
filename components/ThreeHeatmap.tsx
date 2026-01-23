import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeHeatmapProps {
  intensity: number; // 0-100
  phase: string;
}

export const ThreeHeatmap: React.FC<ThreeHeatmapProps> = ({ intensity, phase }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Removed fog to keep it clear against the dark background, or keep it subtle
    scene.fog = new THREE.FogExp2(0x020617, 0.02);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry - Increased size for full screen coverage
    const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x22D3EE, 
      wireframe: true,
      transparent: true,
      opacity: 0.15 // Slightly lower opacity for background subtlety
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Particles - Spread out more
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30; // Spread across the larger plane
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x1E3A8A,
        transparent: true,
        opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation Loop
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Slow organic rotation
      plane.rotation.z = time * 0.02;
      particlesMesh.rotation.y = -time * 0.01;

      // Displace vertices for organic wave effect
      const positionAttribute = geometry.getAttribute('position');
      const waveHeight = (intensity / 100) * 2.0;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i); // This is local Y (which is Z in world after rotation)
        
        // Complex organic noise simulation using sin/cos
        const noise = Math.sin(x * 0.5 + time * 0.5) * Math.cos(y * 0.5 + time * 0.3);
        const peak = Math.exp(-(x*x + y*y) * 0.05) * (intensity > 50 ? 2 : 0);
        
        // Update Z (height)
        positionAttribute.setZ(i, noise * 0.5 * waveHeight + peak * 0.5);
      }
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return <div ref={mountRef} className="w-full h-full" />;
};