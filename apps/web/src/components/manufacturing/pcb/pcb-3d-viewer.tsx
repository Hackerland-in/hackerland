'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { PlacedComponent, CopperTraceSegment, PcbVia, BoardSubstrate } from './pcb-types';

interface Pcb3DViewerProps {
  substrate: BoardSubstrate;
  components: PlacedComponent[];
  traces: CopperTraceSegment[];
  vias: PcbVia[];
  boardWidthMm?: number;
  boardHeightMm?: number;
}

export function Pcb3DViewer({
  substrate,
  components,
  traces,
  vias,
  boardWidthMm = 140,
  boardHeightMm = 90,
}: Pcb3DViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [solderMaskColor, setSolderMaskColor] = useState<'rosepaper' | 'green' | 'black' | 'blue' | 'purple'>('rosepaper');
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcf9fb);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 100, 120);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(60, 100, 50);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.6);
    dirLight2.position.set(-60, 50, -50);
    scene.add(dirLight2);

    // Coordinate conversion: PCB center at (0, 0, 0)
    const to3DX = (xMm: number) => xMm - boardWidthMm / 2;
    const to3DZ = (yMm: number) => yMm - boardHeightMm / 2;

    // Board Substrate Mesh
    const boardThickness = 1.6;
    const boardGeo = new THREE.BoxGeometry(boardWidthMm, boardThickness, boardHeightMm);

    const maskColors = {
      rosepaper: 0xdb2777,
      green: 0x065f46,
      black: 0x18181b,
      blue: 0x1d4ed8,
      purple: 0x6d28d9,
    };

    const boardMat = new THREE.MeshStandardMaterial({
      color: substrate === 'veroboard' ? 0x78350f : maskColors[solderMaskColor],
      roughness: 0.35,
      metalness: 0.1,
    });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.receiveShadow = true;
    scene.add(boardMesh);

    // Render Copper Traces in 3D
    for (const trace of traces) {
      const x1 = to3DX(trace.startX);
      const z1 = to3DZ(trace.startY);
      const x2 = to3DX(trace.endX);
      const z2 = to3DZ(trace.endY);

      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1);

      const traceGeo = new THREE.BoxGeometry(length, 0.08, trace.widthMm);
      const traceMat = new THREE.MeshStandardMaterial({
        color: trace.layer === 'bottom_copper' ? 0x3b82f6 : 0xd97706,
        metalness: 0.8,
        roughness: 0.25,
      });

      const traceMesh = new THREE.Mesh(traceGeo, traceMat);
      const yOffset = trace.layer === 'bottom_copper' ? -boardThickness / 2 - 0.04 : boardThickness / 2 + 0.04;
      traceMesh.position.set((x1 + x2) / 2, yOffset, (z1 + z2) / 2);
      traceMesh.rotation.y = -angle;
      scene.add(traceMesh);
    }

    // Render Components in 3D
    for (const comp of components) {
      const cx = to3DX(comp.x);
      const cz = to3DZ(comp.y);
      const compGroup = new THREE.Group();
      compGroup.position.set(cx, boardThickness / 2, cz);
      compGroup.rotation.y = (-comp.rotationDeg * Math.PI) / 180;

      if (comp.footprint.packageType === 'DIP') {
        // Dual In-line IC Body
        const bodyGeo = new THREE.BoxGeometry(
          comp.footprint.widthMm,
          3.2,
          comp.footprint.heightMm
        );
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.5,
          metalness: 0.2,
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 2.0;
        body.castShadow = true;
        compGroup.add(body);

        // IC pins
        for (const pin of comp.footprint.pins) {
          const pinGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5);
          const pinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
          const pinMesh = new THREE.Mesh(pinGeo, pinMat);
          pinMesh.position.set(pin.relativeX, 0.5, pin.relativeY);
          compGroup.add(pinMesh);
        }
      } else if (comp.typeId.startsWith('led_')) {
        // Glowing 3D LED Dome
        const domeGeo = new THREE.SphereGeometry(2.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const illum = comp.simState.illumination || 0;
        const ledColor = comp.typeId.includes('green')
          ? 0x22c55e
          : comp.typeId.includes('blue')
          ? 0x3b82f6
          : comp.typeId.includes('yellow')
          ? 0xeab308
          : 0xef4444;

        const domeMat = new THREE.MeshStandardMaterial({
          color: ledColor,
          emissive: ledColor,
          emissiveIntensity: illum * 2.5,
          roughness: 0.2,
          transparent: true,
          opacity: 0.9,
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = 2.5;
        compGroup.add(dome);

        // Base ring
        const baseGeo = new THREE.CylinderGeometry(2.6, 2.6, 2.5, 16);
        const base = new THREE.Mesh(baseGeo, domeMat);
        base.position.y = 1.25;
        compGroup.add(base);
      } else if (comp.footprint.packageType === 'RADIAL') {
        // Can Electrolytic Capacitor
        const canGeo = new THREE.CylinderGeometry(3.0, 3.0, 8.0, 16);
        const canMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 });
        const can = new THREE.Mesh(canGeo, canMat);
        can.position.y = 4.0;
        can.castShadow = true;
        compGroup.add(can);

        // Aluminum top
        const topGeo = new THREE.CylinderGeometry(2.9, 2.9, 0.2, 16);
        const topMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.2 });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 8.1;
        compGroup.add(top);
      } else if (comp.footprint.packageType === 'AXIAL') {
        // Axial Resistor Cylinder
        const resGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.0, 12);
        const resMat = new THREE.MeshStandardMaterial({ color: 0xd7b98e, roughness: 0.6 });
        const res = new THREE.Mesh(resGeo, resMat);
        res.rotation.z = Math.PI / 2;
        res.position.y = 2.0;
        res.castShadow = true;
        compGroup.add(res);
      } else {
        // Generic component box
        const genGeo = new THREE.BoxGeometry(
          comp.footprint.widthMm,
          2.0,
          comp.footprint.heightMm
        );
        const genMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        const gen = new THREE.Mesh(genGeo, genMat);
        gen.position.y = 1.0;
        compGroup.add(gen);
      }

      scene.add(compGroup);
    }

    // Animation Loop
    let reqId: number;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [substrate, components, traces, vias, boardWidthMm, boardHeightMm, solderMaskColor]);

  const resetCamera = (view: 'top' | 'iso' | 'bottom') => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (view === 'top') {
      cameraRef.current.position.set(0, 140, 0.001);
    } else if (view === 'bottom') {
      cameraRef.current.position.set(0, -140, 0.001);
    } else {
      cameraRef.current.position.set(0, 90, 110);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full bg-sunken overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls */}
      <div className="absolute top-3 left-3 bg-surface-1/95 backdrop-blur border border-hairline rounded-xl p-2.5 flex items-center space-x-2 text-xs text-fg shadow-md">
        <span className="font-semibold text-fg-muted">View:</span>
        <button
          type="button"
          onClick={() => resetCamera('iso')}
          className="px-2.5 py-1 bg-sunken hover:bg-surface-2 rounded-lg text-fg border border-hairline font-medium"
        >
          Perspective
        </button>
        <button
          type="button"
          onClick={() => resetCamera('top')}
          className="px-2.5 py-1 bg-sunken hover:bg-surface-2 rounded-lg text-fg border border-hairline font-medium"
        >
          Top
        </button>
        <button
          type="button"
          onClick={() => resetCamera('bottom')}
          className="px-2.5 py-1 bg-sunken hover:bg-surface-2 rounded-lg text-fg border border-hairline font-medium"
        >
          Bottom
        </button>

        <span className="font-semibold text-fg-muted ml-2">Solder Mask:</span>
        {(['rosepaper', 'green', 'black', 'blue', 'purple'] as const).map((color) => (
          <button
            type="button"
            key={color}
            aria-label={`Solder mask ${color}`}
            onClick={() => setSolderMaskColor(color)}
            className={`w-4 h-4 rounded-full border border-hairline transition ${
              solderMaskColor === color ? 'ring-2 ring-accent scale-110' : 'opacity-75 hover:opacity-100'
            }`}
            style={{
              backgroundColor:
                color === 'rosepaper'
                  ? '#db2777'
                  : color === 'green'
                  ? '#065f46'
                  : color === 'black'
                  ? '#18181b'
                  : color === 'blue'
                  ? '#1d4ed8'
                  : '#6d28d9',
            }}
          />
        ))}
      </div>
    </div>
  );
}
