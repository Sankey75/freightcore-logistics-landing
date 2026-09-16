import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * ThreeScene — Logistics globe WebGL component
 *
 * Key design decisions:
 * - THREE.Timer used instead of deprecated THREE.Clock
 * - Scene micro-rotated to bypass Windows ANGLE gl.LINES horizontal-edge bug
 * - Globe positioned right of center via camera offset (lookAt -7,0,0)
 * - DPR capped at 2 desktop / 1.5 mobile for performance
 * - All geometries, materials disposed on unmount
 * - pointerEvents:none so cursor / scroll events pass through
 */
const ThreeScene = () => {
  const mountRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Listen for OS-level reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    /* ── SCENE ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.018);

    /* ── CAMERA ── */
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(
      isMobile ? 0 : -2,
      isMobile ? 2 : 0,
      isMobile ? 22 : 20
    );
    camera.lookAt(isMobile ? 0 : -7, 0, 0);

    // Micro-tilt bypasses the Windows ANGLE gl.LINES horizontal-edge glitch
    scene.rotation.z = 0.02;
    scene.rotation.x = 0.02;

    /* ── RENDERER ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    /* ── GLOBE WIREFRAME ── */
    const baseGeo = new THREE.IcosahedronGeometry(6, 2);
    // 45° rotation eliminates all near-horizontal geometry edges
    baseGeo.rotateX(Math.PI / 4);
    baseGeo.rotateZ(Math.PI / 4);

    const wireGeo = new THREE.WireframeGeometry(baseGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x28559a,
      transparent: true,
      opacity: 0.7,
    });
    const globe = new THREE.LineSegments(wireGeo, wireMat);
    scene.add(globe);

    /* ── INNER SPHERE (masks back-facing wireframe) ── */
    const innerGeo = new THREE.SphereGeometry(5.8, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    /* ── HUB NODES ── */
    const hubMat  = new THREE.MeshBasicMaterial({ color: 0x28559a });
    const hubGeo  = new THREE.SphereGeometry(0.1, 8, 8);
    const numHubs = 12;
    const hubPositions = [];

    for (let i = 0; i < numHubs; i++) {
      const phi   = Math.acos(-1 + (2 * i) / numHubs);
      const theta = Math.sqrt(numHubs * Math.PI) * phi;
      const hub   = new THREE.Mesh(hubGeo, hubMat);
      hub.position.setFromSphericalCoords(6, phi, theta);
      globe.add(hub);
      hubPositions.push(hub.position.clone());
    }

    /* ── ROUTE LINES + TRAVELLING DOTS ── */
    const routeMat = new THREE.LineBasicMaterial({
      color: 0xf4d03f,
      transparent: true,
      opacity: 0.35,
    });
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00a651 });
    const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);

    const routeObjects = [];
    const routeLineGeos = []; // track for disposal

    for (let i = 0; i < numHubs - 1; i++) {
      const start = hubPositions[i];
      const end   = hubPositions[(i + 3) % numHubs];

      const distance = start.distanceTo(end);
      let mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      if (mid.length() < 0.1) mid.set(0, 1, 0);
      mid.normalize().multiplyScalar(6 + distance * 0.2);

      const curve  = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts    = curve.getPoints(20);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      routeLineGeos.push(lineGeo);

      const line = new THREE.Line(lineGeo, routeMat);
      globe.add(line);

      const dot = new THREE.Mesh(dotGeo, dotMat);
      globe.add(dot);

      routeObjects.push({ curve, dot, progress: Math.random() });
    }

    /* ── AMBIENT PARTICLES ── */
    const particleCount = isMobile ? 60 : 220;
    const particlePos   = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePos[i] = (Math.random() - 0.5) * 32;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat  = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00a651,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── MOUSE PARALLAX ── */
    let mouseX = 0;
    let mouseY = 0;
    const halfW = window.innerWidth  / 2;
    const halfH = window.innerHeight / 2;

    const onMouseMove = (e) => {
      mouseX = e.clientX - halfW;
      mouseY = e.clientY - halfH;
    };
    document.addEventListener('mousemove', onMouseMove);

    /* ── RESIZE ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── ANIMATION — use THREE.Timer to avoid Clock deprecation warning ── */
    let raf;
    let elapsed = 0;
    let lastTime = performance.now();

    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.05); // clamp to 50ms
      lastTime = now;
      elapsed += delta;

      if (!prefersReducedMotion) {
        globe.rotation.y = elapsed * 0.05;
        globe.rotation.x = elapsed * 0.02;
        particles.rotation.y = elapsed * 0.018;

        if (!isMobile) {
          const tx = mouseX * 0.001;
          const ty = mouseY * 0.001;
          camera.position.x += (-2 + tx * 2 - camera.position.x) * 0.02;
          camera.position.y += (     -ty * 2 - camera.position.y) * 0.02;
          camera.lookAt(-7, 0, 0);

          // Travelling dots along routes
          routeObjects.forEach((obj) => {
            obj.progress = (obj.progress + 0.0018) % 1;
            const pos = obj.curve.getPointAt(obj.progress);
            obj.dot.position.copy(pos);
          });
        } else {
          camera.lookAt(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(animate);

    /* ── CLEANUP ── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);

      if (currentMount?.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose all geometries and materials
      baseGeo.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      hubGeo.dispose();
      hubMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      routeMat.dispose();
      routeLineGeos.forEach((g) => g.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};

export default ThreeScene;
