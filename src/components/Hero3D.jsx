import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  Lock,
  Download,
  Clock,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero3D = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { setIsCustomOrderOpen, t, language } = useStore();

  const dynamicWords = language === 'EN' ? [
    'Web Scraping Engines',
    'Autonomous AI Agents',
    'Algorithmic Trading Bots',
    'Enterprise SaaS Engines'
  ] : [
    'Veri Kazıma Motorları',
    'Yapay Zeka Asistanları',
    'Borsa Arbitraj Botları',
    'Otonom SaaS Sistemleri'
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.8);

    // High-Fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Professional Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const indigoRimLight = new THREE.DirectionalLight(0x4f46e5, 5.5);
    indigoRimLight.position.set(-7, -4, 4);
    scene.add(indigoRimLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 4.8);
    cyanRimLight.position.set(7, -3, -4);
    scene.add(cyanRimLight);

    const mouseLight = new THREE.PointLight(0xffffff, 3.2, 16);
    mouseLight.position.set(0, 0, 4.5);
    scene.add(mouseLight);

    // Master 3D Fluid Group
    const fluidGroup = new THREE.Group();
    scene.add(fluidGroup);

    // 1. ORGANIC PROCEDURAL LIQUID CHROME SPHERE
    const baseRadius = 1.65;
    const sphereGeo = new THREE.IcosahedronGeometry(baseRadius, 48);
    const origPositions = sphereGeo.attributes.position.clone();

    const fluidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.18,
      roughness: 0.05,
      metalness: 0.38,
      transmission: 0.72,
      thickness: 1.8,
      ior: 1.62,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 0.85,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [100, 450],
    });

    const fluidMesh = new THREE.Mesh(sphereGeo, fluidMaterial);
    fluidGroup.add(fluidMesh);

    // 2. INNER PULSING CORE
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    fluidMesh.add(innerMesh);

    // 3. FLOATING ORBITAL RINGS
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.015, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.32 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.8;
    fluidGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.2, 0.012, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.25 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 5;
    fluidGroup.add(ring2);

    // 4. FLOATING PARTICLES
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pPositions[idx] = (Math.random() - 0.5) * 8;
      pPositions[idx + 1] = (Math.random() - 0.5) * 8;
      pPositions[idx + 2] = (Math.random() - 0.5) * 5;

      const c = new THREE.Color(Math.random() > 0.5 ? 0x4f46e5 : 0x06b6d4);
      pColors[idx] = c.r;
      pColors[idx + 1] = c.g;
      pColors[idx + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    fluidGroup.add(particles);

    // Mouse Tracking Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);

      mouseLight.position.x = mouseX * 4;
      mouseLight.position.y = mouseY * 4;

      if (isDragging) {
        const dX = e.clientX - prevMouse.x;
        const dY = e.clientY - prevMouse.y;
        fluidGroup.rotation.y += dX * 0.008;
        fluidGroup.rotation.x += dY * 0.008;
      }
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = containerRef.current;
    dom.addEventListener('mousemove', onMouseMove);
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

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
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime() * 1.1;

      // 1. Procedural Harmonic Wave Displacement
      const posAttr = sphereGeo.attributes.position;
      const origArr = origPositions.array;
      const arr = posAttr.array;

      for (let i = 0; i < posAttr.count; i++) {
        const idx = i * 3;
        const ox = origArr[idx];
        const oy = origArr[idx + 1];
        const oz = origArr[idx + 2];

        const wave1 = Math.sin(ox * 2.2 + elapsed * 1.8) * Math.cos(oy * 2.0 + elapsed * 1.4);
        const wave2 = Math.sin(oz * 2.5 + elapsed * 1.6) * 0.5;
        const wave3 = Math.cos((ox + oy + oz) * 1.8 + elapsed * 2.0) * 0.3;

        const displacement = (wave1 + wave2 + wave3) * 0.2;

        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const factor = (baseRadius + displacement) / len;

        arr[idx] = ox * factor;
        arr[idx + 1] = oy * factor;
        arr[idx + 2] = oz * factor;
      }
      posAttr.needsUpdate = true;
      sphereGeo.computeVertexNormals();

      // 2. Parallax Rotation
      if (!isDragging) {
        targetRotX += (-mouseY * 0.35 - targetRotX) * 0.05;
        targetRotY += (mouseX * 0.35 - targetRotY) * 0.05;

        fluidGroup.rotation.y += 0.006;
        fluidGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.1 + targetRotX;
        fluidGroup.rotation.z = Math.cos(elapsed * 0.3) * 0.06 + targetRotY;
      }

      // 3. Inner Core Pulse
      const pulse = 1 + Math.sin(elapsed * 2) * 0.06;
      innerMesh.scale.set(pulse, pulse, pulse);
      innerMesh.rotation.y -= 0.012;

      ring1.rotation.z = elapsed * 0.08;
      ring2.rotation.z = -elapsed * 0.06;
      particles.rotation.y = elapsed * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('mousemove', onMouseMove);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 overflow-hidden bg-white border-b border-slate-200/80 pro-grid">
      
      {/* Background Soft Radiance */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-indigo-50/70 via-cyan-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[560px]">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10 space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Authoritative Clean Dynamic Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] min-h-[110px] sm:min-h-[125px]">
              {language === 'EN' ? 'High Performance' : 'Yüksek Performanslı'} <br />
              <span 
                key={wordIndex}
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent inline-block animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                {dynamicWords[wordIndex]}
              </span>
            </h1>

            {/* Concise Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-normal">
              {t('hero.subtitle')}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto pt-1">
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all duration-200"
              >
                <span>{t('hero.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsCustomOrderOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-2xs hover:border-slate-400 transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{t('hero.customOrderBtn')}</span>
              </button>
            </div>

          </div>

          {/* RIGHT 3D VIEWPORT */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[520px]">
            
            <div
              ref={containerRef}
              className="relative w-full h-[520px] max-w-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            >
              {/* WebGL Canvas */}
              <canvas ref={canvasRef} className="w-full h-full block" />

              {/* Clean Corporate Telemetry Badges */}
              <div className="absolute top-6 right-2 sm:right-6 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center gap-3 pointer-events-none">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{t('hero.telemetry1Title')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{t('hero.telemetry1Sub')}</p>
                </div>
              </div>

              <div className="absolute bottom-8 left-2 sm:left-4 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center gap-3 pointer-events-none">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t('hero.telemetry2Title')}</p>
                  <p className="text-[11px] text-emerald-600 font-medium">{t('hero.telemetry2Sub')}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
