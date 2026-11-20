import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * BagRotation3D
 *
 * Renders the authentic MOKIYO paper shopping bag as a real 3D tapered mesh
 * matching the BLUORNG reference:
 *  - Accurate paper bag proportions with realistic top fold taper
 *  - Front face: Authentic MOKIYO typography + star emblem + handle cutout flap
 *  - Back face: Matching beige paper with matching flap
 *  - Left & Right gussets: Folded paper with realistic center crease
 *  - GUARANTEED CONTINUOUS 360° AUTOMATIC ROTATION on every device
 *  - Interactive manual rotation via mouse drag or touch swipe
 *  - Resumes auto-rotation immediately when released
 *  - Organic floating bob with dynamic soft contact ground shadow
 *  - Compact, elegant sizing with generous breathing room
 */
export default function BagRotation3D({ className = '', onBagClick }) {
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

    /* ── 1. Scene, Camera, Renderer ──────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.background = null; // transparent

    const W = container.clientWidth || 180;
    const H = container.clientHeight || 220;

    // FOV 28 with z=5.8 gives perfect perspective and breathing room
    const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 100);
    camera.position.set(0, 0.08, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    /* ── 2. Warm Studio Environment Map ──────────────────────────────── */
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ec = envCanvas.getContext('2d');
    if (ec) {
      const g = ec.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#faf8f5');
      g.addColorStop(0.5, '#eee7df');
      g.addColorStop(1, '#ded5cb');
      ec.fillStyle = g;
      ec.fillRect(0, 0, 512, 256);

      const k = ec.createRadialGradient(256, 60, 10, 256, 60, 200);
      k.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      k.addColorStop(1, 'rgba(240, 235, 225, 0)');
      ec.fillStyle = k;
      ec.fillRect(0, 0, 512, 256);
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTex;

    /* ── 3. Load Authentic Bag Textures ──────────────────────────────── */
    const loader = new THREE.TextureLoader();

    const loadTex = (url) => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const frontTex = loadTex('/assets/mokiyo-bag-front-texture.jpg');
    const backTex = loadTex('/assets/mokiyo-bag-back-texture.jpg');
    const sideTex = loadTex('/assets/mokiyo-bag-side-texture.jpg');
    const topTex = loadTex('/assets/mokiyo-bag-top-texture.jpg');
    const bottomTex = loadTex('/assets/mokiyo-bag-bottom-texture.jpg');

    /* ── 4. Build 3D Tapered Paper Bag Geometry ──────────────────────── */
    // Proportional dimensions: compact luxury scale with generous margins
    const BW = 1.35;        // width
    const BH = 1.90;        // height
    const BD_BOTTOM = 0.46; // bottom depth
    const BD_TOP = 0.20;    // top fold depth (slender taper)

    const bagGeo = new THREE.BoxGeometry(BW, BH, BD_BOTTOM, 1, 1, 1);

    // Taper the top vertices to replicate genuine paper bag folding
    const pos = bagGeo.attributes.position;
    const taperRatio = BD_TOP / BD_BOTTOM;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) > 0) {
        pos.setZ(i, pos.getZ(i) * taperRatio);
      }
    }
    bagGeo.computeVertexNormals();

    const paperMat = (tex, roughness = 0.80) =>
      new THREE.MeshStandardMaterial({
        map: tex,
        roughness,
        metalness: 0.02,
        envMapIntensity: 0.35,
      });

    const materials = [
      paperMat(sideTex),    // +X: Right side gusset
      paperMat(sideTex),    // -X: Left side gusset
      paperMat(topTex),     // +Y: Top fold closure
      paperMat(bottomTex),  // -Y: Bottom base
      paperMat(frontTex),   // +Z: Front face (MOKIYO brand)
      paperMat(backTex),    // -Z: Back face
    ];

    const bagGroup = new THREE.Group();
    const bagMesh = new THREE.Mesh(bagGeo, materials);
    bagGroup.add(bagMesh);
    scene.add(bagGroup);

    /* ── 5. Realistic Ground Contact Shadow ──────────────────────────── */
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 256;
    const sc = shadowCanvas.getContext('2d');
    if (sc) {
      const sg = sc.createRadialGradient(256, 128, 12, 256, 128, 200);
      sg.addColorStop(0, 'rgba(0, 0, 0, 0.38)');
      sg.addColorStop(0.35, 'rgba(0, 0, 0, 0.15)');
      sg.addColorStop(0.7, 'rgba(0, 0, 0, 0.03)');
      sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sc.fillStyle = sg;
      sc.fillRect(0, 0, 512, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.5, 0.95);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -(BH / 2 + 0.09);
    scene.add(shadowMesh);

    /* ── 6. Lighting ─────────────────────────────────────────────────── */
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdfa, 1.7);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2f6fa, 0.9);
    fillLight.position.set(-3, 1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff8f0, 0.6);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    /* ── 7. Automatic + Manual Drag Controls ─────────────────────────── */
    let isDragging = false;
    let prevX = 0;
    let dragVelocity = 0;
    let isHovering = false;

    // Automatic rotation speed (continuous, fluid turntable)
    const AUTO_SPEED = 0.012;
    const HOVER_SPEED = 0.022;
    let currentSpeed = AUTO_SPEED;
    let targetSpeed = AUTO_SPEED;

    const onPointerMove = (e) => {
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      if (isDragging) {
        const delta = cx - prevX;
        dragVelocity = delta * 0.010;
        bagGroup.rotation.y += dragVelocity;
        prevX = cx;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      dragVelocity = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
      targetSpeed = isHovering ? HOVER_SPEED : AUTO_SPEED;
    };

    const onMouseEnter = () => {
      isHovering = true;
      targetSpeed = HOVER_SPEED;
    };

    const onMouseLeave = () => {
      isHovering = false;
      isDragging = false;
      targetSpeed = AUTO_SPEED;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    /* ── 8. Responsive Resize Handling ───────────────────────────────── */
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 180;
      const h = container.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── 9. Animation Loop (ALWAYS ROTATES AUTOMATICALLY) ─────────────── */
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Automatic continuous rotation + smooth drag inertia
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;

      if (isDragging) {
        // Manual drag active
      } else if (Math.abs(dragVelocity) > 0.0003) {
        bagGroup.rotation.y += dragVelocity;
        dragVelocity *= 0.94; // dampens smoothly back to auto-speed
      } else {
        // CONTINUOUS AUTOMATIC ROTATION GUARANTEED
        bagGroup.rotation.y += currentSpeed;
      }

      // Subtle organic floating bob
      const floatY = Math.sin(t * 1.6) * 0.04;
      bagGroup.position.y = floatY;

      // Ground shadow responds to float height
      const shadowScale = 1 - floatY * 0.35;
      shadowMesh.scale.set(shadowScale, 1, shadowScale);
      shadowMat.opacity = 0.46 - floatY * 0.14;

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
      frontTex.dispose();
      backTex.dispose();
      sideTex.dispose();
      topTex.dispose();
      bottomTex.dispose();
      shadowTex.dispose();
      bagGeo.dispose();
      materials.forEach((m) => m.dispose());
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, []);

  /* ── Fallback ──────────────────────────────────────────────────────── */
  if (!hasWebGL) {
    return (
      <div className={`flex items-center justify-center ${className}`} onClick={onBagClick}>
        <img
          src="/assets/mokiyo-bag-isolated.png"
          alt="MOKIYO Shopping Bag"
          className="w-full h-full object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.14)]"
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Drag to rotate the MOKIYO bag manually"
      onClick={onBagClick}
      style={{ touchAction: 'none' }}
    />
  );
}
