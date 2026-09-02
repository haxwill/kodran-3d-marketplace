import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ProductGrid3DBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Master Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. FLOATING WIREFRAME POLYHEDRA (CYBER NODES)
    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(2.2, 0),
      new THREE.OctahedronGeometry(1.8, 0),
      new THREE.TetrahedronGeometry(2.0, 0),
      new THREE.TorusGeometry(2.5, 0.08, 16, 60),
    ];

    const materialWire = new THREE.MeshBasicMaterial({
      color: 0x6366f1, // Indigo 500
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    const materialCyanWire = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan 500
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });

    for (let i = 0; i < 7; i++) {
      const geo = geometries[i % geometries.length];
      const mat = i % 2 === 0 ? materialWire : materialCyanWire;
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 48,
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 16 - 5
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.006,
      };

      shapes.push({ mesh, rotSpeed });
      group.add(mesh);
    }

    // 2. CONSTELLATION NETWORK (PARTICLES & CONNECTING LINES)
    const particleCount = 65;
    const pPositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pPositions[idx] = (Math.random() - 0.5) * 55;
      pPositions[idx + 1] = (Math.random() - 0.5) * 38;
      pPositions[idx + 2] = (Math.random() - 0.5) * 15;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.01
      });
    }

    const pGeometry = new THREE.BufferGeometry();
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMaterial = new THREE.PointsMaterial({
      color: 0x4f46e5,
      size: 0.18,
      transparent: true,
      opacity: 0.35
    });

    const particleSystem = new THREE.Points(pGeometry, pMaterial);
    group.add(particleSystem);

    // Dynamic Connecting Lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.08
    });

    let linesMesh;

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };

    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Mouse Parallax
      targetX += (mouseX * 2.5 - targetX) * 0.04;
      targetY += (mouseY * 2.5 - targetY) * 0.04;
      group.position.x = targetX;
      group.position.y = targetY;

      // Rotate shapes
      shapes.forEach(({ mesh, rotSpeed }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.rotation.z += rotSpeed.z;
      });

      // Update Particles
      const positions = pGeometry.attributes.position.array;
      const linePositions = [];

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx] += particleVelocities[i].x;
        positions[idx + 1] += particleVelocities[i].y;
        positions[idx + 2] += particleVelocities[i].z;

        // Bounce within bounds
        if (Math.abs(positions[idx]) > 28) particleVelocities[i].x *= -1;
        if (Math.abs(positions[idx + 1]) > 20) particleVelocities[i].y *= -1;
        if (Math.abs(positions[idx + 2]) > 10) particleVelocities[i].z *= -1;

        // Connect nearby points
        for (let j = i + 1; j < particleCount; j++) {
          const jdx = j * 3;
          const dx = positions[idx] - positions[jdx];
          const dy = positions[idx + 1] - positions[jdx + 1];
          const dz = positions[idx + 2] - positions[jdx + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 9.5) {
            linePositions.push(
              positions[idx], positions[idx + 1], positions[idx + 2],
              positions[jdx], positions[jdx + 1], positions[jdx + 2]
            );
          }
        }
      }
      pGeometry.attributes.position.needsUpdate = true;

      // Rebuild lines geometry
      if (linesMesh) group.remove(linesMesh);
      if (linePositions.length > 0) {
        const linesGeo = new THREE.BufferGeometry();
        linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesMesh = new THREE.LineSegments(linesGeo, linesMaterial);
        group.add(linesMesh);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
    </div>
  );
};
