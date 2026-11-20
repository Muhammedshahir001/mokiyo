import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * RotatingEarthGlobe
 *
 * - Automatic continuous Y-axis rotation
 * - Manual drag (mouse) + swipe (touch) rotation — overrides auto, resumes after release
 * - Mouse-hover subtle parallax tilt
 * - Luminous cyan dotted continent matrix
 * - Atmospheric corona rim glow
 * - Fully responsive, WebGL-safe
 */
export default function RotatingEarthGlobe({ className = '', interactive = false }) {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    /* ── 0. WebGL Check ─────────────────────────────────────────────── */
    try {
      const test = document.createElement('canvas');
      const gl = test.getContext('webgl') || test.getContext('experimental-webgl');
      if (!gl) { setHasWebGL(false); return; }
    } catch {
      setHasWebGL(false);
      return;
    }

    const W = container.clientWidth || 340;
    const H = container.clientHeight || 340;

    /* ── 1. Scene / Camera / Renderer ──────────────────────────────── */
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0.1, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Remove any default canvas border/outline
    renderer.domElement.style.border = 'none';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.borderRadius = '50%';
    container.appendChild(renderer.domElement);

    /* ── 2. Globe Group ─────────────────────────────────────────────── */
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = 0.22;
    globeGroup.rotation.x = 0.15;
    scene.add(globeGroup);

    /* ── 3. Planetary Core ──────────────────────────────────────────── */
    const coreGeo = new THREE.SphereGeometry(2.18, 48, 48);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x050d1a,
      emissive: 0x040812,
      specular: 0x1e3a8a,
      shininess: 25,
      transparent: true,
      opacity: 0.94,
    });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    /* ── 4. Dotted Continent Matrix ────────────────────────────────── */
    const textureLoader = new THREE.TextureLoader();
    let dotsTexture = null;
    dotsTexture = textureLoader.load('/assets/earth-dots-map.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    const dotsGeo = new THREE.SphereGeometry(2.22, 64, 64);
    const dotsMat = new THREE.MeshStandardMaterial({
      map: dotsTexture,
      transparent: true,
      opacity: 0.98,
      roughness: 0.25,
      metalness: 0.1,
      emissive: 0x38bdf8,
      emissiveMap: dotsTexture,
      emissiveIntensity: 1.4,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    globeGroup.add(new THREE.Mesh(dotsGeo, dotsMat));

    /* ── 5. Atmospheric Rim Glow ────────────────────────────────────── */
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 512; haloCanvas.height = 512;
    const hc = haloCanvas.getContext('2d');
    if (hc) {
      const hg = hc.createRadialGradient(256, 256, 170, 256, 256, 256);
      hg.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      hg.addColorStop(0.35, 'rgba(14, 165, 233, 0.20)');
      hg.addColorStop(0.7, 'rgba(3, 105, 161, 0.08)');
      hg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      hc.fillStyle = hg;
      hc.fillRect(0, 0, 512, 512);
    }
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloGeo = new THREE.PlaneGeometry(6.6, 6.6);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.z = -0.15;
    scene.add(haloMesh);

    /* ── 6. Lights ──────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.8);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    /* ── 7. Interaction State ───────────────────────────────────────── */
    // Parallax tilt (hover)
    let targetTiltX = 0;
    let targetTiltY = 0;

    // Manual drag state
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragVelX = 0;  // momentum
    let dragVelY = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let manualRotY = 0; // cumulative manual Y rotation
    let manualRotX = 0; // cumulative manual X rotation (clamped)
    let autoRotY = globeGroup.rotation.y;

    /* ── 8. Pointer Events (Mouse + Touch) ─────────────────────────── */
    const getClientXY = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const onPointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      const { x, y } = getClientXY(e);
      dragStartX = x;
      dragStartY = y;
      lastDragX = x;
      lastDragY = y;
      dragVelX = 0;
      dragVelY = 0;
      // Capture current auto rotation as the base for manual
      manualRotY = autoRotY;
      manualRotX = globeGroup.rotation.x - 0.15;
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      const { x, y } = getClientXY(e);
      const rect = container.getBoundingClientRect();

      if (isDragging) {
        const dx = x - lastDragX;
        const dy = y - lastDragY;
        dragVelX = dx;
        dragVelY = dy;
        manualRotY += dx * 0.008;
        manualRotX += dy * 0.005;
        // Clamp vertical tilt
        manualRotX = Math.max(-0.5, Math.min(0.5, manualRotX));
        lastDragX = x;
        lastDragY = y;
      } else {
        // Hover parallax
        const nx = ((x - rect.left) / rect.width) * 2 - 1;
        const ny = -(((y - rect.top) / rect.height) * 2 - 1);
        targetTiltX = ny * 0.12;
        targetTiltY = nx * 0.16;
      }
    };

    const onPointerUp = () => {
      if (isDragging) {
        // Sync auto rotation to where we stopped so it continues smoothly
        autoRotY = manualRotY;
        isDragging = false;
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    /* ── 9. Resize ──────────────────────────────────────────────────── */
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── 10. Animation Loop ─────────────────────────────────────────── */
    let raf;
    const AUTO_SPEED = 0.0035;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (isDragging) {
        // Manual control — apply drag rotation directly
        globeGroup.rotation.y = manualRotY;
        globeGroup.rotation.x = 0.15 + manualRotX;
        globeGroup.rotation.z = 0.22;
      } else {
        // Auto rotation with momentum fade
        dragVelX *= 0.92;
        dragVelY *= 0.92;
        autoRotY += AUTO_SPEED + dragVelX * 0.004;
        manualRotY = autoRotY;

        // Hover parallax lerp
        globeGroup.rotation.y += (autoRotY - globeGroup.rotation.y) * 0.08;
        globeGroup.rotation.x += (0.15 + targetTiltX - globeGroup.rotation.x) * 0.05;
        globeGroup.rotation.z += (0.22 + targetTiltY - globeGroup.rotation.z) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── 11. Cleanup ────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onPointerDown);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      haloTex.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      dotsGeo.dispose();
      dotsMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      if (dotsTexture) dotsTexture.dispose();
    };
  }, []);

  /* ── Fallback ───────────────────────────────────────────────────────── */
  if (!hasWebGL) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-sky-950 via-cyan-900 to-sky-600 opacity-60 blur-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`select-none ${interactive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} pointer-events-auto ${className}`}
      style={{ touchAction: 'none', border: 'none', outline: 'none', background: 'transparent' }}
      title={interactive ? 'Drag to rotate the globe' : undefined}
    />
  );
}
