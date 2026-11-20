import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ThreeRotatingLogo
 *
 * Renders the authentic MOKIYO crystal/liquid-chrome 3D emblem:
 * - Bold, razor-sharp, brilliant metallic/crystal reflections
 * - Solid volumetric depth using beveled multi-layer slices
 * - High-contrast studio lighting with dynamic specular glints
 * - Continuous 360° rotation around the vertical Y-axis
 * - Organic zero-gravity floating bob with dynamic ground contact shadow
 * - Interactive mouse/touch parallax tilt and manual drag with inertial damping
 * - 100% visible, vibrant, and stunning across all screens and backgrounds
 */
export default function ThreeRotatingLogo({ className = '' }) {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    /* ── 0. WebGL Capability Check ───────────────────────────────────── */
    try {
      const test = document.createElement('canvas');
      const gl = test.getContext('webgl') || test.getContext('experimental-webgl');
      if (!gl) { setHasWebGL(false); return; }
    } catch {
      setHasWebGL(false);
      return;
    }

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── 1. Scene, Camera, Renderer ──────────────────────────────────── */
    const scene = new THREE.Scene();

    const W = container.clientWidth || 480;
    const H = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0, 0, 6.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    /* ── 2. High-Contrast Studio Environment Map for Chrome Reflections  ── */
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ec = envCanvas.getContext('2d');
    if (ec) {
      // Midnight studio background with brilliant silver reflection band
      const bg = ec.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#0a0e17');
      bg.addColorStop(0.35, '#05070c');
      bg.addColorStop(0.48, '#708090');
      bg.addColorStop(0.50, '#ffffff'); // Razor-sharp silver horizon
      bg.addColorStop(0.52, '#708090');
      bg.addColorStop(0.70, '#05070c');
      bg.addColorStop(1, '#020408');
      ec.fillStyle = bg;
      ec.fillRect(0, 0, 1024, 512);

      // Overhead softbox light
      const sb1 = ec.createRadialGradient(512, 80, 10, 512, 80, 240);
      sb1.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      sb1.addColorStop(0.4, 'rgba(230, 240, 255, 0.7)');
      sb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ec.fillStyle = sb1;
      ec.fillRect(200, 0, 624, 280);

      // Cool cyan/blue rim accent light
      const sb2 = ec.createRadialGradient(120, 220, 10, 120, 220, 220);
      sb2.addColorStop(0, 'rgba(180, 220, 255, 0.85)');
      sb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ec.fillStyle = sb2;
      ec.fillRect(0, 60, 320, 320);

      // Warm amber rim accent light (matching canyon tone)
      const sb3 = ec.createRadialGradient(920, 200, 10, 920, 200, 220);
      sb3.addColorStop(0, 'rgba(255, 230, 200, 0.75)');
      sb3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ec.fillStyle = sb3;
      ec.fillRect(700, 60, 324, 320);
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTex;

    /* ── 3. Load High-Resolution Clean Chrome Emblem ─────────────────── */
    const textureLoader = new THREE.TextureLoader();
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Plane geometry matching emblem aspect ratio (920 / 782 ≈ 1.176)
    const PW = 3.2;
    const PH = PW / (920 / 782); // ≈ 2.72
    const planeGeo = new THREE.PlaneGeometry(PW, PH);

    const logoTex = textureLoader.load(
      '/assets/mokiyo-emblem-clean.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        buildVolumetricEmblem(tex);
      }
    );

    /* ── 4. Build Volumetric Solid 3D Emblem ──────────────────────────── */
    function buildVolumetricEmblem(tex) {
      // Front and Back Face: Liquid Chrome Physical Material
      const frontMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.12,
        metalness: 0.95,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 1.0,
        envMapIntensity: 2.6,
        depthWrite: true,
        side: THREE.FrontSide,
      });

      const backMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.12,
        metalness: 0.95,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 1.0,
        envMapIntensity: 2.6,
        depthWrite: true,
        side: THREE.FrontSide,
      });

      // Front Face at +Z
      const frontMesh = new THREE.Mesh(planeGeo, frontMat);
      frontMesh.position.z = 0.14;
      logoGroup.add(frontMesh);

      // Back Face at -Z (rotated 180° around Y)
      const backMesh = new THREE.Mesh(planeGeo, backMat);
      backMesh.position.z = -0.14;
      backMesh.rotation.y = Math.PI;
      logoGroup.add(backMesh);

      // 14 Volumetric Interior Slices for Physical Mass & Beveled Depth
      const coreMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        transparent: true,
        opacity: 0.96,
        metalness: 0.98,
        roughness: 0.12,
        clearcoat: 0.8,
        color: 0xf0f4f8,
        envMapIntensity: 2.2,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const numSlices = 14;
      const depthSpan = 0.26;
      for (let i = 0; i < numSlices; i++) {
        const zPos = -depthSpan / 2 + (i / (numSlices - 1)) * depthSpan;
        if (Math.abs(zPos - 0.14) < 0.015 || Math.abs(zPos + 0.14) < 0.015) continue;

        const sliceMesh = new THREE.Mesh(planeGeo, coreMat);
        sliceMesh.position.z = zPos;
        // Inward bevel taper creates realistic multi-faceted edges
        const bevelScale = 1.0 - Math.abs(zPos / depthSpan) * 0.05;
        sliceMesh.scale.set(bevelScale, bevelScale, 1);
        logoGroup.add(sliceMesh);
      }
    }

    /* ── 5. Ground Contact Shadow ────────────────────────────────────── */
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(256, 128, 10, 256, 128, 200);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.60)');
      sGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.20)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 512, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.6, 0);
    scene.add(shadowMesh);

    /* ── 6. Dynamic Studio Lights ────────────────────────────────────── */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcce6ff, 1.2);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffecd2, 1.5);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Orbiting Caustic Glint Point Light for Diamond Sparkle
    const glintLight = new THREE.PointLight(0xffffff, 2.5, 12);
    glintLight.position.set(1.5, 1.5, 3.5);
    scene.add(glintLight);

    /* ── 7. Interactive Parallax & Drag Controls ─────────────────────── */
    let isDragging = false;
    let prevX = 0;
    let dragVelocity = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const BASE_SPEED = 0.012; // Continuous smooth rotation
    const HOVER_SPEED = 0.020;
    let currentSpeed = BASE_SPEED;
    let targetSpeed = BASE_SPEED;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

      const nx = ((cx - rect.left) / rect.width) * 2 - 1;
      const ny = -(((cy - rect.top) / rect.height) * 2 - 1);

      targetTiltX = ny * 0.25;
      targetTiltY = nx * 0.30;

      if (isDragging) {
        const delta = cx - prevX;
        dragVelocity = delta * 0.009;
        logoGroup.rotation.y += dragVelocity;
        prevX = cx;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      dragVelocity = 0;
      targetSpeed = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
      targetSpeed = BASE_SPEED;
    };

    const onMouseEnter = () => {
      targetSpeed = HOVER_SPEED;
    };

    const onMouseLeave = () => {
      targetSpeed = BASE_SPEED;
      targetTiltX = 0;
      targetTiltY = 0;
      isDragging = false;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    /* ── 8. Resize Handling ──────────────────────────────────────────── */
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── 9. Animation Loop ───────────────────────────────────────────── */
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotation & Drag inertia
      if (isDragging) {
        // Direct manual control
      } else if (Math.abs(dragVelocity) > 0.0004) {
        logoGroup.rotation.y += dragVelocity;
        dragVelocity *= 0.94; // Smooth dampening
      } else {
        currentSpeed += (targetSpeed - currentSpeed) * 0.06;
        if (!prefersReducedMotion) {
          logoGroup.rotation.y += currentSpeed;
        }
      }

      // Parallax Tilt Lerp
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;
      logoGroup.rotation.x = currentTiltX;
      logoGroup.rotation.z = Math.sin(t * 0.8) * 0.02 + currentTiltY * 0.15;

      // Organic Zero-G Floating Bob
      if (!prefersReducedMotion) {
        const floatY = Math.sin(t * 1.5) * 0.08;
        logoGroup.position.y = floatY;

        // Dynamic shadow breathing response
        const shadowScale = 1 - floatY * 0.4;
        shadowMesh.scale.set(shadowScale, 1, shadowScale);
        shadowMat.opacity = 0.45 - floatY * 0.12;

        // Orbiting glint light
        glintLight.position.x = Math.sin(t * 1.2) * 2.5;
        glintLight.position.y = Math.cos(t * 1.0) * 1.5 + 1.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── 10. Cleanup ─────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      envTex.dispose();
      shadowTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      planeGeo.dispose();
      logoTex.dispose();
      logoGroup.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material?.dispose();
        }
      });
    };
  }, []);

  /* ── Fallback ──────────────────────────────────────────────────────── */
  if (!hasWebGL) {
    return (
      <div className={`flex items-center justify-center select-none ${className}`}>
        <img
          src="/assets/mokiyo-emblem-clean.png"
          alt="Mokiyo 3D Chrome Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)] animate-pulse"
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Drag to rotate Mokiyo 3D Chrome Emblem"
    />
  );
}
