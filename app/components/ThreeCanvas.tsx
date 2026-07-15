"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  appState: string;
  themeColor: 'cyan' | 'purple' | 'emerald' | 'amber';
}

export default function ThreeCanvas({ appState, themeColor }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to dynamically update colors of cubes materials without full canvas re-initiations
  const cubesMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Accent Theme color setter effect
  useEffect(() => {
    const getHexColor = (colorName: string) => {
      switch (colorName) {
        case 'purple': return 0xa855f7;
        case 'emerald': return 0x10b981;
        case 'amber': return 0xf59e0b;
        case 'cyan':
        default:
          return 0x00e5ff;
      }
    };
    const activeColor = getHexColor(themeColor);
    if (cubesMaterialRef.current) {
      cubesMaterialRef.current.color.setHex(activeColor);
    }
  }, [themeColor]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8.5;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00e5ff, 3, 40); // Neon Cyan
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 3, 40); // Royal Purple
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // 5. Geometries setup

    // Model 1: Warp Tunnel Starfield (Hero flight)
    const warpCount = 1500;
    const warpGeometry = new THREE.BufferGeometry();
    const warpPositions = new Float32Array(warpCount * 3);
    const warpColors = new Float32Array(warpCount * 3);

    for (let i = 0; i < warpCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 2.8;
      warpPositions[i * 3] = Math.cos(angle) * radius;
      warpPositions[i * 3 + 1] = Math.sin(angle) * radius;
      warpPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const ratio = Math.random();
      warpColors[i * 3] = 0.0;
      warpColors[i * 3 + 1] = 0.6 + ratio * 0.4;
      warpColors[i * 3 + 2] = 1.0;
    }
    warpGeometry.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));
    warpGeometry.setAttribute('color', new THREE.BufferAttribute(warpColors, 3));

    const warpMaterial = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const warpField = new THREE.Points(warpGeometry, warpMaterial);
    scene.add(warpField);

    // Model 2: Gravity Core / Black Hole (Methodology section)
    const coreGroup = new THREE.Group();
    const coreGeometry = new THREE.SphereGeometry(1.3, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    const diskCount = 800;
    const diskGeometry = new THREE.BufferGeometry();
    const diskPositions = new Float32Array(diskCount * 3);
    const diskAngles = new Float32Array(diskCount);
    const diskRadii = new Float32Array(diskCount);

    for (let i = 0; i < diskCount; i++) {
      const r = 1.6 + Math.random() * 2.2;
      const a = Math.random() * Math.PI * 2;
      diskPositions[i * 3] = Math.cos(a) * r;
      diskPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      diskPositions[i * 3 + 2] = Math.sin(a) * r;

      diskRadii[i] = r;
      diskAngles[i] = a;
    }
    diskGeometry.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
    
    const diskMaterial = new THREE.PointsMaterial({
      size: 0.028,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const accretionDisk = new THREE.Points(diskGeometry, diskMaterial);
    coreGroup.add(accretionDisk);
    scene.add(coreGroup);

    // Model 3: Asymmetrical Wireframe Portal Matrix (Specs section)
    const matrixGroup = new THREE.Group();
    const wireBoxes: THREE.Mesh[] = [];
    const colorsList = [0x00e5ff, 0x7c3aed, 0xa855f7];

    for (let i = 0; i < 3; i++) {
      const boxGeom = new THREE.BoxGeometry(2.0 - i * 0.4, 2.0 - i * 0.4, 2.0 - i * 0.4);
      const boxMat = new THREE.MeshPhongMaterial({
        color: colorsList[i],
        wireframe: true,
        transparent: true,
        opacity: 0.0,
        shininess: 120,
        blending: THREE.AdditiveBlending
      });
      const boxMesh = new THREE.Mesh(boxGeom, boxMat);
      boxMesh.rotation.x = Math.random() * Math.PI;
      boxMesh.rotation.y = Math.random() * Math.PI;
      matrixGroup.add(boxMesh);
      wireBoxes.push(boxMesh);
    }
    scene.add(matrixGroup);

    // Model 4: Subtle Dashboard Starfield (User Page Dashboard)
    const dashStarsCount = 200;
    const dashStarsGeometry = new THREE.BufferGeometry();
    const dashStarsPositions = new Float32Array(dashStarsCount * 3);

    for (let i = 0; i < dashStarsCount; i++) {
      dashStarsPositions[i * 3] = (Math.random() - 0.5) * 16;
      dashStarsPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dashStarsPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dashStarsGeometry.setAttribute('position', new THREE.BufferAttribute(dashStarsPositions, 3));

    const getHexColor = (colorName: string) => {
      switch (colorName) {
        case 'purple': return 0xa855f7;
        case 'emerald': return 0x10b981;
        case 'amber': return 0xf59e0b;
        case 'cyan':
        default:
          return 0x00e5ff;
      }
    };
    const initialHexColor = getHexColor(themeColor);

    const dashStarsMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: initialHexColor,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    cubesMaterialRef.current = dashStarsMaterial as any;

    const dashStars = new THREE.Points(dashStarsGeometry, dashStarsMaterial);
    scene.add(dashStars);

    // Background cosmic dust
    const starsCount = 200;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starsPositions[i * 3] = (Math.random() - 0.5) * 16;
      starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.012,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 6. Interactive states
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      scrollProgress = window.scrollY / maxScroll;
    };
    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Mouse interactive parallax with easing
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Animate background stars
      stars.rotation.y = -elapsedTime * 0.01;

      // 3D CAMERA FLIGHT PATHS: Camera zooms, pans and rotates dynamically
      camera.position.x += (mouseX * 1.6 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 1.6 - camera.position.y) * 0.05;
      
      const isLanding = appState === 'landing';
      const isDashboard = appState === 'employee_dashboard' || appState === 'manager_dashboard';

      // Dynamic camera depth and rotation sweeps based on scroll progress (landing only)
      if (isLanding) {
        camera.position.z = 8.5 - scrollProgress * 3.5;
        scene.rotation.y = scrollProgress * Math.PI * 0.6;
        scene.rotation.x = scrollProgress * Math.PI * 0.2;
      } else {
        camera.position.z = 7.5;
        scene.rotation.y = mouseX * 0.15;
        scene.rotation.x = -mouseY * 0.15;
      }

      // ---------------------------------------------------
      // 3D SCENE TRANSITIONS
      // ---------------------------------------------------
      
      // Phase 1: Warp Tunnel Flight (Scroll 0.0 to 0.35)
      if (isLanding && scrollProgress < 0.4) {
        const opacity = Math.max(0, 1 - (scrollProgress / 0.3));
        warpMaterial.opacity = opacity;
        warpMaterial.visible = opacity > 0.01;

        const warpPosAttr = warpGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < warpCount; i++) {
          let z = warpPosAttr.getZ(i);
          z += 0.085;
          if (z > 10) {
            z = -10;
          }
          warpPosAttr.setZ(i, z);
        }
        warpPosAttr.needsUpdate = true;
      } else {
        warpMaterial.opacity = 0;
        warpMaterial.visible = false;
      }

      // Phase 2: Gravity Core / Black Hole (Scroll 0.25 to 0.75)
      if (isLanding && scrollProgress >= 0.2 && scrollProgress < 0.8) {
        let opacity = 0;
        if (scrollProgress < 0.4) {
          opacity = (scrollProgress - 0.2) / 0.2;
        } else if (scrollProgress > 0.6) {
          opacity = 1 - (scrollProgress - 0.6) / 0.2;
        } else {
          opacity = 1.0;
        }

        opacity = Math.max(0, Math.min(1, opacity));
        coreMaterial.opacity = opacity * 0.85;
        diskMaterial.opacity = opacity * 0.75;
        
        const diskPosAttr = diskGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < diskCount; i++) {
          diskAngles[i] += 0.015 * (3.5 / diskRadii[i]);
          const a = diskAngles[i];
          const r = diskRadii[i];
          diskPosAttr.setXYZ(
            i, 
            Math.cos(a) * r, 
            Math.sin(elapsedTime * 2 + r) * 0.05, 
            Math.sin(a) * r
          );
        }
        diskPosAttr.needsUpdate = true;

        coreMesh.rotation.y = elapsedTime * 0.25;
        coreMesh.rotation.x = elapsedTime * 0.1;
      } else {
        coreMaterial.opacity = 0;
        diskMaterial.opacity = 0;
      }

      // Phase 3: Wireframe Matrix (Scroll > 0.6)
      if (isLanding && scrollProgress >= 0.55) {
        const opacity = Math.min(1, (scrollProgress - 0.55) / 0.25);
        
        wireBoxes.forEach((box, idx) => {
          const mat = box.material as THREE.MeshPhongMaterial;
          mat.opacity = opacity * 0.75;
          box.rotation.x = elapsedTime * (0.12 * (idx + 1)) + mouseX * 0.45;
          box.rotation.y = elapsedTime * (0.08 * (idx + 1)) + mouseY * 0.45;
        });

        matrixGroup.rotation.z = elapsedTime * 0.04;
      } else {
        wireBoxes.forEach((box) => {
          (box.material as THREE.MeshPhongMaterial).opacity = 0;
        });
      }

      // Phase 4: Faint Dashboard Starfield (Dashboard Active state)
      const targetStarsOpacity = isDashboard ? 0.35 : 0.0;
      dashStarsMaterial.opacity += (targetStarsOpacity - dashStarsMaterial.opacity) * 0.08;

      if (dashStarsMaterial.opacity > 0.01) {
        dashStars.rotation.y = elapsedTime * 0.003;
        dashStars.rotation.x = elapsedTime * 0.0015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      warpGeometry.dispose();
      warpMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      diskGeometry.dispose();
      diskMaterial.dispose();
      dashStarsGeometry.dispose();
      dashStarsMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      
      wireBoxes.forEach((box) => {
        box.geometry.dispose();
        (box.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
    };
  }, [appState]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" 
    />
  );
}
