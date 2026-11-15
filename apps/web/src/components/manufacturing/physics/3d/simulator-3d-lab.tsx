'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Badge, Button, cn } from '@hackerland/ui';
import {
  RotateCcw,
  Eye,
  Maximize2,
  Minimize2,
  Box,
  Compass,
  Zap,
  Layers,
  Sparkles,
  Camera,
  Activity,
  Flame,
} from 'lucide-react';

export type Lab3DModelType = 'drone' | 'rocket' | 'car' | 'ev' | 'motorbike' | 'bicycle' | 'mcu';

export interface Simulator3DLabProps {
  modelType: Lab3DModelType;
  throttle?: number; // 0 - 100
  speedKmh?: number; // current speed
  altitude?: number; // meters
  pitchDeg?: number; // degrees
  rollDeg?: number; // degrees
  yawDeg?: number; // degrees
  rpm?: number; // engine / motor RPM
  className?: string;
  height?: number | string;
}

export function Simulator3DLab({
  modelType,
  throttle = 50,
  speedKmh = 60,
  altitude = 15,
  pitchDeg = 0,
  rollDeg = 0,
  yawDeg = 0,
  rpm = 4500,
  className,
  height = 420,
}: Simulator3DLabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const rotatingPartsRef = useRef<THREE.Object3D[]>([]);
  const thrustEffectsRef = useRef<THREE.Object3D[]>([]);

  const [wireframe, setWireframe] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'fpv' | 'chase' | 'top'>('orbit');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Setup Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 640;
    const h = typeof height === 'number' ? height : 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0c12);
    scene.fog = new THREE.FogExp2(0x0a0c12, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(5, 3.5, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear existing canvas if any
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 40;
    controls.minDistance = 1.5;
    controls.target.set(0, 0.8, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xff007f, 0.8);
    rimLight.position.set(-10, -5, -10);
    scene.add(rimLight);

    // Procedural Cyber Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e2638);
    grid.position.y = 0;
    scene.add(grid);

    // Create Vehicle Mesh Group
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    rotatingPartsRef.current = [];
    thrustEffectsRef.current = [];

    // Build the specific 3D model
    buildModel(modelType, vehicleGroup, rotatingPartsRef.current, thrustEffectsRef.current);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Controls update
      controls.update();

      // Spin rotating components (props, wheels, fans)
      const spinSpeed = (throttle / 100) * 35 + (speedKmh / 100) * 20 + 2;
      rotatingPartsRef.current.forEach((part) => {
        part.rotation.y += spinSpeed * delta;
      });

      // Update thrust effects
      thrustEffectsRef.current.forEach((effect) => {
        const scale = (throttle / 100) * 1.5 + Math.sin(clock.getElapsedTime() * 20) * 0.1;
        effect.scale.set(1, Math.max(0.2, scale), 1);
        effect.visible = showVectors;
      });

      // Attitude Rotations based on live telemetry
      if (vehicleGroupRef.current) {
        const targetPitch = THREE.MathUtils.degToRad(-pitchDeg);
        const targetRoll = THREE.MathUtils.degToRad(-rollDeg);
        const targetYaw = THREE.MathUtils.degToRad(yawDeg);

        vehicleGroupRef.current.rotation.x = THREE.MathUtils.lerp(vehicleGroupRef.current.rotation.x, targetPitch, 0.1);
        vehicleGroupRef.current.rotation.z = THREE.MathUtils.lerp(vehicleGroupRef.current.rotation.z, targetRoll, 0.1);
        vehicleGroupRef.current.rotation.y = THREE.MathUtils.lerp(vehicleGroupRef.current.rotation.y, targetYaw, 0.1);

        // Hover or altitude float
        if (modelType === 'drone') {
          const hoverY = 1.2 + Math.sin(clock.getElapsedTime() * 3) * 0.05 + Math.min(altitude / 10, 3);
          vehicleGroupRef.current.position.y = hoverY;
        } else if (modelType === 'rocket') {
          const launchY = 0.5 + Math.min(altitude / 5, 6);
          vehicleGroupRef.current.position.y = launchY;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = typeof height === 'number' ? height : 420;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      controls.dispose();
    };
  }, [modelType, height]);

  // Update wireframe mode
  useEffect(() => {
    if (!vehicleGroupRef.current) return;
    vehicleGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  // Update camera presets
  const handlePresetChange = (preset: 'orbit' | 'fpv' | 'chase' | 'top') => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    if (preset === 'orbit') {
      cameraRef.current.position.set(5, 3.5, 6);
      controlsRef.current.target.set(0, 0.8, 0);
    } else if (preset === 'fpv') {
      cameraRef.current.position.set(0, 1.3, 0.8);
      controlsRef.current.target.set(0, 1.2, 5);
    } else if (preset === 'chase') {
      cameraRef.current.position.set(0, 2.5, -5);
      controlsRef.current.target.set(0, 1.0, 3);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 8, 0.01);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  const resetCamera = () => {
    handlePresetChange('orbit');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-hairline overflow-hidden bg-[#0A0C12] shadow-2xl transition-all',
        isFullscreen ? 'fixed inset-4 z-[1000] h-[calc(100vh-2rem)]' : '',
        className
      )}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        style={{ height: isFullscreen ? '100%' : height }}
      />

      {/* Floating HUD Controls Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Model & Physics Mode Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Badge tone="accent" variant="solid" className="font-mono text-[10px] gap-1 shadow-sm">
            <Box className="size-3" />
            <span>3D LAB · {modelType.toUpperCase()}</span>
          </Badge>
          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-fg-subtle bg-surface-1/80 backdrop-blur px-2 py-0.5 rounded border border-hairline">
            <Compass className="size-3 text-accent" />
            <span>Orbit: Drag to Rotate · Scroll to Zoom</span>
          </span>
        </div>

        {/* Right: Camera Presets & Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-surface-1/90 backdrop-blur-md p-1 rounded-xl border border-hairline shadow-md">
          <button
            type="button"
            onClick={() => handlePresetChange('orbit')}
            className={cn(
              'px-2 py-1 rounded-lg text-[10px] font-mono transition-colors',
              cameraPreset === 'orbit' ? 'bg-accent text-on-solid font-bold' : 'text-fg-subtle hover:text-fg'
            )}
          >
            Orbit
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange('chase')}
            className={cn(
              'px-2 py-1 rounded-lg text-[10px] font-mono transition-colors',
              cameraPreset === 'chase' ? 'bg-accent text-on-solid font-bold' : 'text-fg-subtle hover:text-fg'
            )}
          >
            Chase
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange('top')}
            className={cn(
              'px-2 py-1 rounded-lg text-[10px] font-mono transition-colors',
              cameraPreset === 'top' ? 'bg-accent text-on-solid font-bold' : 'text-fg-subtle hover:text-fg'
            )}
          >
            Top
          </button>

          <div className="h-3.5 w-px bg-hairline mx-0.5" />

          {/* Wireframe toggle */}
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Wireframe CAD"
            className={cn(
              'p-1.5 rounded-lg text-[10px] transition-colors',
              wireframe ? 'bg-accent/20 text-accent font-bold' : 'text-fg-subtle hover:text-fg'
            )}
          >
            <Layers className="size-3.5" />
          </button>

          {/* Vectors toggle */}
          <button
            type="button"
            onClick={() => setShowVectors(!showVectors)}
            title="Toggle Thrust & Force Vectors"
            className={cn(
              'p-1.5 rounded-lg text-[10px] transition-colors',
              showVectors ? 'bg-accent/20 text-accent font-bold' : 'text-fg-subtle hover:text-fg'
            )}
          >
            <Zap className="size-3.5" />
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={resetCamera}
            title="Reset 3D Camera"
            className="p-1.5 rounded-lg text-fg-subtle hover:text-fg transition-colors"
          >
            <RotateCcw className="size-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Studio'}
            className="p-1.5 rounded-lg text-fg-subtle hover:text-fg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-surface-1/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-hairline text-caption font-mono text-fg shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <span className="text-fg-subtle text-[11px]">THROTTLE:</span>
            <span className="font-bold text-accent">{throttle}%</span>
          </div>

          <span className="text-hairline">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle text-[11px]">SPEED:</span>
            <span className="font-bold text-fg">{speedKmh.toFixed(1)} km/h</span>
          </div>

          <span className="text-hairline">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle text-[11px]">ALTITUDE:</span>
            <span className="font-bold text-cyan-400">{altitude.toFixed(1)} m</span>
          </div>

          <span className="text-hairline">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle text-[11px]">P/R/Y:</span>
            <span className="text-fg-muted">{pitchDeg}°/{rollDeg}°/{yawDeg}°</span>
          </div>
        </div>

        <div className="pointer-events-auto">
          <span className="text-[10px] font-mono text-fg-subtle bg-surface-1/80 backdrop-blur px-2.5 py-1 rounded-lg border border-hairline">
            WebGL 2.0 · 60 FPS RK4
          </span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Procedural High-Fidelity 3D Model Builders
// -------------------------------------------------------------
function buildModel(
  type: Lab3DModelType,
  parent: THREE.Group,
  rotatingParts: THREE.Object3D[],
  thrustEffects: THREE.Object3D[]
) {
  // Clear group
  while (parent.children.length > 0) {
    parent.remove(parent.children[0]!);
  }

  // Standard Materials
  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x181c24,
    metalness: 0.85,
    roughness: 0.25,
  });

  const cyanAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x0080aa,
    emissiveIntensity: 0.4,
    metalness: 0.5,
    roughness: 0.2,
  });

  const pinkAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0xff007f,
    emissive: 0x990044,
    emissiveIntensity: 0.4,
    metalness: 0.5,
    roughness: 0.2,
  });

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x8892b0,
    metalness: 0.9,
    roughness: 0.15,
  });

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.8,
    metalness: 0.1,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.7,
  });

  if (type === 'drone') {
    // ---------------------------------------------------------
    // QUADCOPTER DRONE (6-DOF)
    // ---------------------------------------------------------
    // Center Carbon Body
    const bodyGeo = new THREE.BoxGeometry(0.8, 0.18, 0.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, carbonMaterial);
    bodyMesh.castShadow = true;
    parent.add(bodyMesh);

    // Battery pack on top
    const batteryGeo = new THREE.BoxGeometry(0.5, 0.25, 0.35);
    const batteryMesh = new THREE.Mesh(batteryGeo, cyanAccentMaterial);
    batteryMesh.position.y = 0.2;
    parent.add(batteryMesh);

    // FPV Camera upfront
    const camGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16);
    const camMesh = new THREE.Mesh(camGeo, pinkAccentMaterial);
    camMesh.rotation.x = Math.PI / 2;
    camMesh.position.set(0, 0.08, 0.45);
    parent.add(camMesh);

    // 4 Diagonal Carbon Arms + Brushless Motors + Props
    const armPositions = [
      { x: 0.9, z: 0.9, rot: Math.PI / 4 },
      { x: -0.9, z: 0.9, rot: -Math.PI / 4 },
      { x: 0.9, z: -0.9, rot: -Math.PI / 4 },
      { x: -0.9, z: -0.9, rot: Math.PI / 4 },
    ];

    armPositions.forEach((pos, idx) => {
      // Carbon Arm
      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12);
      const armMesh = new THREE.Mesh(armGeo, carbonMaterial);
      armMesh.position.set(pos.x / 2, 0, pos.z / 2);
      armMesh.rotation.y = pos.rot;
      armMesh.rotation.z = Math.PI / 2;
      parent.add(armMesh);

      // Motor Bell
      const motorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 16);
      const motorMesh = new THREE.Mesh(motorGeo, metalMaterial);
      motorMesh.position.set(pos.x, 0.1, pos.z);
      parent.add(motorMesh);

      // Propeller (rotating part)
      const propGroup = new THREE.Group();
      propGroup.position.set(pos.x, 0.22, pos.z);

      const bladeGeo = new THREE.BoxGeometry(0.9, 0.015, 0.09);
      const bladeMesh = new THREE.Mesh(bladeGeo, idx % 2 === 0 ? cyanAccentMaterial : pinkAccentMaterial);
      propGroup.add(bladeMesh);

      parent.add(propGroup);
      rotatingParts.push(propGroup);

      // Downward Thrust Vector Cone
      const coneGeo = new THREE.ConeGeometry(0.18, 0.8, 16);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.45 });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.set(pos.x, -0.45, pos.z);
      coneMesh.rotation.x = Math.PI;
      parent.add(coneMesh);
      thrustEffects.push(coneMesh);
    });
  } else if (type === 'rocket') {
    // ---------------------------------------------------------
    // AEROSPACE MULTI-STAGE ROCKET
    // ---------------------------------------------------------
    // Main Fuselage Cylinder
    const fuselageGeo = new THREE.CylinderGeometry(0.4, 0.45, 4.2, 32);
    const rocketMat = new THREE.MeshStandardMaterial({ color: 0xf5f7fb, metalness: 0.6, roughness: 0.2 });
    const fuselageMesh = new THREE.Mesh(fuselageGeo, rocketMat);
    fuselageMesh.position.y = 2.1;
    fuselageMesh.castShadow = true;
    parent.add(fuselageMesh);

    // Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.4, 1.2, 32);
    const noseMesh = new THREE.Mesh(noseGeo, carbonMaterial);
    noseMesh.position.y = 4.8;
    parent.add(noseMesh);

    // Staging Separation Ring
    const ringGeo = new THREE.TorusGeometry(0.43, 0.04, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, pinkAccentMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 2.8;
    parent.add(ringMesh);

    // 4 Base Grid Fins
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const finGeo = new THREE.BoxGeometry(0.04, 0.7, 0.5);
      const finMesh = new THREE.Mesh(finGeo, carbonMaterial);
      finMesh.position.set(Math.cos(angle) * 0.55, 0.45, Math.sin(angle) * 0.55);
      finMesh.rotation.y = angle;
      parent.add(finMesh);
    }

    // Rocket Nozzle Bell
    const nozzleGeo = new THREE.ConeGeometry(0.35, 0.6, 24, 1, true);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, metalMaterial);
    nozzleMesh.position.y = -0.15;
    parent.add(nozzleMesh);

    // Supersonic Exhaust Flame
    const flameGeo = new THREE.ConeGeometry(0.4, 2.2, 24);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.85 });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = -1.3;
    parent.add(flameMesh);
    thrustEffects.push(flameMesh);

    const innerCoreGeo = new THREE.ConeGeometry(0.18, 1.2, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95 });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    innerCoreMesh.position.y = -0.7;
    parent.add(innerCoreMesh);
    thrustEffects.push(innerCoreMesh);
  } else if (type === 'car' || type === 'ev') {
    // ---------------------------------------------------------
    // HIGH-PERFORMANCE CAR / EV CHASSIS
    // ---------------------------------------------------------
    // Chassis Floor
    const chassisGeo = new THREE.BoxGeometry(1.6, 0.25, 3.4);
    const chassisMesh = new THREE.Mesh(chassisGeo, type === 'ev' ? cyanAccentMaterial : carbonMaterial);
    chassisMesh.position.y = 0.4;
    chassisMesh.castShadow = true;
    parent.add(chassisMesh);

    // Cockpit Canopy / Greenhouse
    const canopyGeo = new THREE.BoxGeometry(1.2, 0.55, 1.6);
    const canopyMesh = new THREE.Mesh(canopyGeo, glassMaterial);
    canopyMesh.position.set(0, 0.8, -0.2);
    parent.add(canopyMesh);

    // Front Splitter
    const splitterGeo = new THREE.BoxGeometry(1.7, 0.06, 0.6);
    const splitterMesh = new THREE.Mesh(splitterGeo, carbonMaterial);
    splitterMesh.position.set(0, 0.2, 1.8);
    parent.add(splitterMesh);

    // GT Rear Wing
    const wingGeo = new THREE.BoxGeometry(1.8, 0.08, 0.35);
    const wingMesh = new THREE.Mesh(wingGeo, carbonMaterial);
    wingMesh.position.set(0, 1.1, -1.6);
    parent.add(wingMesh);

    // Wing Struts
    [-0.5, 0.5].forEach((x) => {
      const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
      const strutMesh = new THREE.Mesh(strutGeo, metalMaterial);
      strutMesh.position.set(x, 0.85, -1.6);
      parent.add(strutMesh);
    });

    // EV Battery Pack Skateboard Visualizer
    if (type === 'ev') {
      const packGeo = new THREE.BoxGeometry(1.3, 0.15, 2.6);
      const packMesh = new THREE.Mesh(packGeo, cyanAccentMaterial);
      packMesh.position.y = 0.35;
      parent.add(packMesh);
    }

    // 4 Wheels
    const wheelPositions = [
      { x: 0.9, z: 1.1 },
      { x: -0.9, z: 1.1 },
      { x: 0.9, z: -1.1 },
      { x: -0.9, z: -1.1 },
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, 0.35, pos.z);

      const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.28, 24);
      const tireMesh = new THREE.Mesh(tireGeo, tireMaterial);
      tireMesh.rotation.z = Math.PI / 2;
      wheelGroup.add(tireMesh);

      const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.29, 16);
      const rimMesh = new THREE.Mesh(rimGeo, metalMaterial);
      rimMesh.rotation.z = Math.PI / 2;
      wheelGroup.add(rimMesh);

      parent.add(wheelGroup);
      rotatingParts.push(wheelGroup);
    });
  } else if (type === 'motorbike') {
    // ---------------------------------------------------------
    // SUPERBIKE MOTORCYCLE (60° LEAN)
    // ---------------------------------------------------------
    // Main Spine Frame & Fairing
    const frameGeo = new THREE.BoxGeometry(0.35, 0.7, 2.2);
    const frameMesh = new THREE.Mesh(frameGeo, pinkAccentMaterial);
    frameMesh.position.y = 0.8;
    parent.add(frameMesh);

    // Fuel Tank
    const tankGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.8, 16);
    const tankMesh = new THREE.Mesh(tankGeo, carbonMaterial);
    tankMesh.rotation.x = Math.PI / 2;
    tankMesh.position.set(0, 1.1, 0.2);
    parent.add(tankMesh);

    // Front Fork and Handlebars
    const forkGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 12);
    const forkMesh = new THREE.Mesh(forkGeo, metalMaterial);
    forkMesh.rotation.x = -Math.PI / 8;
    forkMesh.position.set(0, 0.8, 0.85);
    parent.add(forkMesh);

    // Front & Rear Wheels
    [0.95, -0.95].forEach((zPos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0, 0.4, zPos);

      const tireGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.18, 24);
      const tireMesh = new THREE.Mesh(tireGeo, tireMaterial);
      tireMesh.rotation.z = Math.PI / 2;
      wheelGroup.add(tireMesh);

      parent.add(wheelGroup);
      rotatingParts.push(wheelGroup);
    });
  } else if (type === 'bicycle') {
    // ---------------------------------------------------------
    // AERO DIAMOND BICYCLE
    // ---------------------------------------------------------
    // Diamond Frame Tubes
    const frameGroup = new THREE.Group();
    const tubeMat = cyanAccentMaterial;

    // Top Tube
    const topTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 12), tubeMat);
    topTube.rotation.x = Math.PI / 2;
    topTube.position.set(0, 1.1, 0);
    frameGroup.add(topTube);

    // Down Tube
    const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12), tubeMat);
    downTube.rotation.x = Math.PI / 3;
    downTube.position.set(0, 0.7, 0.2);
    frameGroup.add(downTube);

    // Seat Tube
    const seatTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12), tubeMat);
    seatTube.rotation.x = -Math.PI / 10;
    seatTube.position.set(0, 0.8, -0.45);
    frameGroup.add(seatTube);

    parent.add(frameGroup);

    // Wheels
    [0.85, -0.85].forEach((zPos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0, 0.45, zPos);

      const rimGeo = new THREE.TorusGeometry(0.42, 0.03, 12, 32);
      const rimMesh = new THREE.Mesh(rimGeo, carbonMaterial);
      wheelGroup.add(rimMesh);

      parent.add(wheelGroup);
      rotatingParts.push(wheelGroup);
    });
  } else if (type === 'mcu') {
    // ---------------------------------------------------------
    // CYBER-PHYSICAL MICROCONTROLLER & SMT PCB LAB
    // ---------------------------------------------------------
    // 4-Layer Matte Black FR4 PCB Board
    const pcbGeo = new THREE.BoxGeometry(2.4, 0.08, 1.8);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.2 });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.y = 0.04;
    parent.add(pcbMesh);

    // Microcontroller IC Package (ARM Cortex-M4 / ESP32)
    const icGeo = new THREE.BoxGeometry(0.7, 0.06, 0.7);
    const icMesh = new THREE.Mesh(icGeo, carbonMaterial);
    icMesh.position.set(0, 0.1, 0);
    parent.add(icMesh);

    // USB-C Connector Port
    const usbGeo = new THREE.BoxGeometry(0.35, 0.12, 0.3);
    const usbMesh = new THREE.Mesh(usbGeo, metalMaterial);
    usbMesh.position.set(-1.1, 0.1, 0);
    parent.add(usbMesh);

    // Active Status LEDs
    const ledColors = [0x00f0ff, 0x10b981, 0xffaa00, 0xff007f];
    ledColors.forEach((color, i) => {
      const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
      const ledMat = new THREE.MeshBasicMaterial({ color });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(0.6 + i * 0.15, 0.1, 0.6);
      parent.add(ledMesh);
      thrustEffects.push(ledMesh);
    });
  }
}
