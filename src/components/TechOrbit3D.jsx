import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { techStack, developerStats } from '../data/techStack';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Activity,
  Code2,
  FileCode2,
  Box,
  Zap,
  Container,
  Database,
  Radio
} from 'lucide-react';
import { soundFX } from '../utils/audio';

const iconMap = {
  FileCode2,
  Cpu,
  Layers,
  Box,
  Zap,
  Container,
  Database,
  Sparkles,
};

export const TechOrbit3D = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeTech, setActiveTech] = useState(techStack[0]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Dynamic 3D Spherical Coordinate Points
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const sphereRadius = 2.4;
    const count = techStack.length;
    const meshItems = [];

    techStack.forEach((tech, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);

      const geo = new THREE.SphereGeometry(0.18, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(tech.color),
        roughness: 0.2,
        metalness: 0.6,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      nodesGroup.add(mesh);
      meshItems.push(mesh);
    });

    // Connecting line network
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.2,
    });

    const linePoints = [];
    meshItems.forEach((m1, idx1) => {
      meshItems.forEach((m2, idx2) => {
        if (idx1 < idx2 && m1.position.distanceTo(m2.position) < 2.5) {
          linePoints.push(m1.position.clone(), m2.position.clone());
        }
      });
    });

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(linesMesh);

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(3, 3, 5);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      nodesGroup.rotation.y += 0.004;
      nodesGroup.rotation.x += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section id="stack" className="py-24 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200/60 mb-3">
            <Radio className="w-3.5 h-3.5 text-indigo-600" />
            KUANTUM ÇEKİRDEK TEKNOLOJİLERİ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kullanılan Diller & 3D Ekosistem
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Projelerimizi modern, ölçeklenebilir ve sektör standardı yüksek dillerle inşa ediyoruz.
          </p>
        </div>

        {/* 3D Visual + Tech Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left: 3D Connected Tech Sphere (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative w-full aspect-square max-w-[420px] rounded-3xl glass-panel p-4 flex items-center justify-center shadow-xl shadow-indigo-950/5 border border-slate-200"
            >
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute bottom-4 text-center">
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-white/95 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  🌐 3D ÇOKLU DÜĞÜM AĞI
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Tech Stack Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {techStack.map((tech) => {
              const Icon = iconMap[tech.icon] || Code2;
              const isSelected = activeTech.name === tech.name;

              return (
                <div
                  key={tech.name}
                  onMouseEnter={() => {
                    setActiveTech(tech);
                    soundFX.playClick();
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${tech.color}15`, color: tech.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tech.name}</h4>
                    <p className="text-xs text-slate-500">{tech.role}</p>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 block mt-0.5">
                      {tech.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Live Developer Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white shadow-2xl border border-slate-800">
          {developerStats.map((stat, idx) => (
            <div key={idx} className="text-center sm:text-left px-4 border-r last:border-none border-white/10">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-300 tracking-tight block font-mono">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
