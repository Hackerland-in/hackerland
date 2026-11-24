'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type {
  PlacedComponent,
  CopperTraceSegment,
  PcbVia,
  VeroboardTrackCut,
  BoardSubstrate,
  PcbLayer,
  ElectricalNet,
} from './pcb-types';
import { getPinAbsolutePosition } from './pcb-sim-engine';

interface PcbDesignerCanvasProps {
  substrate: BoardSubstrate;
  activeLayer: PcbLayer;
  activeTool: 'select' | 'route' | 'cut' | 'via' | 'delete';
  components: PlacedComponent[];
  traces: CopperTraceSegment[];
  vias: PcbVia[];
  trackCuts: VeroboardTrackCut[];
  nets: ElectricalNet[];
  selectedComponentId: string | null;
  boardWidthMm?: number;
  boardHeightMm?: number;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponentPosition: (id: string, x: number, y: number) => void;
  onAddTrace: (trace: CopperTraceSegment) => void;
  onToggleTrackCut: (x: number, y: number) => void;
  onAddVia: (x: number, y: number) => void;
  onToggleComponentParam?: (id: string, paramKey: string, value: number | boolean | string) => void;
}

export function PcbDesignerCanvas({
  substrate,
  activeLayer,
  activeTool,
  components,
  traces,
  vias,
  trackCuts,
  selectedComponentId,
  boardWidthMm = 140,
  boardHeightMm = 90,
  onSelectComponent,
  onUpdateComponentPosition,
  onAddTrace,
  onToggleTrackCut,
  onAddVia,
  onToggleComponentParam,
}: PcbDesignerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas viewport transform
  const [scale, setScale] = useState(5.5); // px per mm
  const [panX, setPanX] = useState(40);
  const [panY, setPanY] = useState(40);

  // Dragging state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Routing state
  const [routeStartPin, setRouteStartPin] = useState<{
    compId: string;
    pinId: string;
    x: number;
    y: number;
    netId?: string;
  } | null>(null);
  const [mouseBoardPos, setMouseBoardPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Animation frame counter for electron flow
  const [animTime, setAnimTime] = useState(0);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      setAnimTime((t) => (t + 1) % 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Screen to Board mm coordinate converter
  const screenToBoard = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: Number(((screenX - panX) / scale).toFixed(2)),
        y: Number(((screenY - panY) / scale).toFixed(2)),
      };
    },
    [panX, panY, scale]
  );

  // Board mm to Screen coordinate converter
  const boardToScreen = useCallback(
    (boardX: number, boardY: number) => {
      return {
        x: panX + boardX * scale,
        y: panY + boardY * scale,
      };
    },
    [panX, panY, scale]
  );

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.parentElement?.clientHeight || 600;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // 1. Background clear
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Board bounding rectangle
    const bOrigin = boardToScreen(0, 0);
    const bW = boardWidthMm * scale;
    const bH = boardHeightMm * scale;

    // Substrate-specific Board Plate
    if (substrate === 'fr4') {
      // FR4 High-Grade Solder Mask (Deep Emerald Green)
      ctx.fillStyle = '#064e3b';
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 2;
      ctx.fillRect(bOrigin.x, bOrigin.y, bW, bH);
      ctx.strokeRect(bOrigin.x, bOrigin.y, bW, bH);

      // Fine grid dots (1.27mm / 50 mil)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      const step = 2.54;
      for (let x = 0; x <= boardWidthMm; x += step) {
        for (let y = 0; y <= boardHeightMm; y += step) {
          const pt = boardToScreen(x, y);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (substrate === 'veroboard') {
      // Veroboard / Stripboard: Copper strip substrate (Bakelite Amber / Brown)
      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.fillRect(bOrigin.x, bOrigin.y, bW, bH);
      ctx.strokeRect(bOrigin.x, bOrigin.y, bW, bH);

      const GRID = 2.54;
      const numRows = Math.floor(boardHeightMm / GRID);

      // Render continuous copper strips horizontally
      for (let r = 1; r < numRows; r++) {
        const yMm = r * GRID;
        const ptStart = boardToScreen(GRID, yMm);
        const ptEnd = boardToScreen(boardWidthMm - GRID, yMm);

        ctx.fillStyle = 'rgba(217, 119, 6, 0.55)'; // Copper strip
        ctx.fillRect(ptStart.x, ptStart.y - 1.0 * scale, ptEnd.x - ptStart.x, 2.0 * scale);

        // Holes
        const numCols = Math.floor(boardWidthMm / GRID);
        for (let c = 1; c < numCols; c++) {
          const xMm = c * GRID;
          const pt = boardToScreen(xMm, yMm);

          // Plated hole
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 0.45 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Render Veroboard Track Cuts (breaks)
      for (const cut of trackCuts) {
        const pt = boardToScreen(cut.x, cut.y);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.2 * scale, 0, Math.PI * 2);
        ctx.fill();

        // White 'X' symbol for drill cut
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        const d = 0.8 * scale;
        ctx.beginPath();
        ctx.moveTo(pt.x - d, pt.y - d);
        ctx.lineTo(pt.x + d, pt.y + d);
        ctx.moveTo(pt.x + d, pt.y - d);
        ctx.lineTo(pt.x - d, pt.y + d);
        ctx.stroke();
      }
    } else if (substrate === 'breadboard') {
      // Standard Breadboard (Off-white / light cream with power rails)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.fillRect(bOrigin.x, bOrigin.y, bW, bH);
      ctx.strokeRect(bOrigin.x, bOrigin.y, bW, bH);

      // Top power rails (Red + line, Blue - line)
      const topRed = boardToScreen(10, 6);
      const topBlue = boardToScreen(10, 11);
      const endRail = boardToScreen(boardWidthMm - 10, 6);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(topRed.x, topRed.y);
      ctx.lineTo(endRail.x, topRed.y);
      ctx.stroke();

      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(topBlue.x, topBlue.y);
      ctx.lineTo(endRail.x, topBlue.y);
      ctx.stroke();

      // Center divider trough
      const divY = boardToScreen(0, boardHeightMm / 2).y;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(bOrigin.x, divY - 3, bW, 6);

      // Contact holes
      const GRID = 2.54;
      for (let x = 10; x <= boardWidthMm - 10; x += GRID) {
        for (let y = 16; y <= boardHeightMm - 16; y += GRID) {
          if (Math.abs(y - boardHeightMm / 2) < 4) continue;
          const pt = boardToScreen(x, y);
          ctx.fillStyle = '#334155';
          ctx.fillRect(pt.x - 0.4 * scale, pt.y - 0.4 * scale, 0.8 * scale, 0.8 * scale);
        }
      }
    }

    // 2. Copper Traces (Bottom Copper = Blue, Top Copper = Red/Orange)
    for (const trace of traces) {
      const p1 = boardToScreen(trace.startX, trace.startY);
      const p2 = boardToScreen(trace.endX, trace.endY);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (trace.layer === 'bottom_copper') {
        ctx.strokeStyle = '#3b82f6';
      } else {
        ctx.strokeStyle = '#ef4444';
      }

      ctx.lineWidth = Math.max(2, trace.widthMm * scale);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Electron flow animation on active traces
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 12]);
      ctx.lineDashOffset = -animTime * 0.5;
      ctx.stroke();
      ctx.restore();
    }

    // Active in-progress route
    if (routeStartPin) {
      const p1 = boardToScreen(routeStartPin.x, routeStartPin.y);
      const p2 = boardToScreen(mouseBoardPos.x, mouseBoardPos.y);

      ctx.save();
      ctx.strokeStyle = activeLayer === 'bottom_copper' ? '#60a5fa' : '#f87171';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      // 45-degree dogleg
      const dx = mouseBoardPos.x - routeStartPin.x;
      const dy = mouseBoardPos.y - routeStartPin.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        const mid = boardToScreen(routeStartPin.x + Math.sign(dx) * (Math.abs(dx) - Math.abs(dy)), routeStartPin.y);
        ctx.lineTo(mid.x, mid.y);
      }
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Vias
    for (const via of vias) {
      const pt = boardToScreen(via.x, via.y);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (via.outerDiameterMm / 2) * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (via.drillDiameterMm / 2) * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Placed Components
    for (const comp of components) {
      const center = boardToScreen(comp.x, comp.y);
      const isSelected = comp.id === selectedComponentId;

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate((comp.rotationDeg * Math.PI) / 180);

      const compW = comp.footprint.widthMm * scale;
      const compH = comp.footprint.heightMm * scale;

      // Selection halo
      if (isSelected) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-compW / 2 - 4, -compH / 2 - 4, compW + 8, compH + 8);
        ctx.setLineDash([]);
      }

      // Component Silkscreen / Body
      if (comp.footprint.packageType === 'DIP') {
        // Dual In-line Package (IC)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-compW / 2, -compH / 2, compW, compH);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-compW / 2, -compH / 2, compW, compH);

        // Pin 1 Notch
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(-compW / 2, 0, 0.8 * scale, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
        ctx.stroke();

        // Text label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comp.id, 0, -2);
        ctx.font = '8px monospace';
        ctx.fillText(comp.value, 0, 8);
      } else if (comp.typeId.startsWith('led_')) {
        // LED with Dynamic Radiant Glow!
        const illum = comp.simState.illumination || 0;
        const color = comp.typeId.includes('green')
          ? '#22c55e'
          : comp.typeId.includes('blue')
          ? '#3b82f6'
          : comp.typeId.includes('yellow')
          ? '#eab308'
          : '#ef4444';

        if (illum > 0.05) {
          // Radial glowing gradient
          const glowRadius = Math.max(12, 24 * illum);
          const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, glowRadius);
          grad.addColorStop(0, color);
          grad.addColorStop(0.4, color + 'aa');
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // LED Dome
        ctx.fillStyle = illum > 0.1 ? color : '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, (comp.footprint.widthMm / 2) * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Anode flat cathode notch
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo((comp.footprint.widthMm / 2) * scale, -2 * scale);
        ctx.lineTo((comp.footprint.widthMm / 2) * scale, 2 * scale);
        ctx.stroke();
      } else if (comp.typeId === 'btn_push' || comp.typeId === 'sw_spst') {
        // Interactive Button / Switch
        const isClosed = Boolean(comp.userParams?.isClosed ?? false);
        ctx.fillStyle = isClosed ? '#15803d' : '#334155';
        ctx.fillRect(-compW / 2, -compH / 2, compW, compH);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-compW / 2, -compH / 2, compW, compH);

        // Center actuator
        ctx.fillStyle = isClosed ? '#22c55e' : '#dc2626';
        ctx.beginPath();
        ctx.arc(0, 0, (compW / 3) * (isClosed ? 0.8 : 1.0), 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard Passive / Module / Transistor
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-compW / 2, -compH / 2, compW, compH);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(-compW / 2, -compH / 2, compW, compH);

        // Label
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comp.id, 0, -1);
      }

      // Draw Pins & Pads
      for (const pin of comp.footprint.pins) {
        const pinPxX = pin.relativeX * scale;
        const pinPxY = pin.relativeY * scale;

        // Copper annular ring pad
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pinPxX, pinPxY, (pin.padWidthMm / 2) * scale, 0, Math.PI * 2);
        ctx.fill();

        // Drill hole
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(pinPxX, pinPxY, ((pin.drillDiameterMm || 0.8) / 2) * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }, [
    substrate,
    activeLayer,
    activeTool,
    components,
    traces,
    vias,
    trackCuts,
    selectedComponentId,
    boardWidthMm,
    boardHeightMm,
    panX,
    panY,
    scale,
    animTime,
    routeStartPin,
    mouseBoardPos,
    boardToScreen,
  ]);

  // Pointer event handlers for drag, route, cut, and click
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const boardPos = screenToBoard(screenX, screenY);

    if (e.button === 1 || e.shiftKey) {
      // Pan
      setIsPanning(true);
      setPanStart({ x: screenX - panX, y: screenY - panY });
      return;
    }

    if (activeTool === 'cut' && substrate === 'veroboard') {
      // Toggle track cut snapped to nearest 2.54mm grid
      const GRID = 2.54;
      const snapX = Number((Math.round(boardPos.x / GRID) * GRID).toFixed(2));
      const snapY = Number((Math.round(boardPos.y / GRID) * GRID).toFixed(2));
      onToggleTrackCut(snapX, snapY);
      return;
    }

    if (activeTool === 'via') {
      onAddVia(boardPos.x, boardPos.y);
      return;
    }

    // Check hit on component pins for routing
    for (const comp of components) {
      for (const pin of comp.footprint.pins) {
        const pinPos = getPinAbsolutePosition(comp, pin.id);
        if (pinPos && Math.hypot(pinPos.x - boardPos.x, pinPos.y - boardPos.y) < 1.5) {
          if (activeTool === 'route') {
            if (!routeStartPin) {
              setRouteStartPin({ compId: comp.id, pinId: pin.id, x: pinPos.x, y: pinPos.y });
            } else if (routeStartPin.compId !== comp.id || routeStartPin.pinId !== pin.id) {
              // Complete route trace
              onAddTrace({
                id: `trace_${Date.now()}`,
                netId: `${comp.id}_${pin.id}`,
                layer: activeLayer === 'bottom_copper' ? 'bottom_copper' : 'top_copper',
                startX: routeStartPin.x,
                startY: routeStartPin.y,
                endX: pinPos.x,
                endY: pinPos.y,
                widthMm: 0.35,
              });
              setRouteStartPin(null);
            }
            return;
          }
        }
      }
    }

    // Check hit on components for selection or interactive toggle
    let hitComp: PlacedComponent | null = null;
    for (let i = components.length - 1; i >= 0; i--) {
      const c = components[i];
      if (!c) continue;
      const hw = c.footprint.widthMm / 2;
      const hh = c.footprint.heightMm / 2;
      if (
        boardPos.x >= c.x - hw &&
        boardPos.x <= c.x + hw &&
        boardPos.y >= c.y - hh &&
        boardPos.y <= c.y + hh
      ) {
        hitComp = c;
        break;
      }
    }

    if (hitComp) {
      onSelectComponent(hitComp.id);

      // Interactive click for push buttons / switches
      if (hitComp.typeId === 'btn_push' || hitComp.typeId === 'sw_spst') {
        const current = Boolean(hitComp.userParams?.isClosed ?? false);
        onToggleComponentParam?.(hitComp.id, 'isClosed', !current);
      }

      if (activeTool === 'select') {
        setDraggingCompId(hitComp.id);
        setDragOffset({ x: boardPos.x - hitComp.x, y: boardPos.y - hitComp.y });
      }
    } else {
      onSelectComponent(null);
      if (activeTool === 'route') {
        setRouteStartPin(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const boardPos = screenToBoard(screenX, screenY);
    setMouseBoardPos(boardPos);

    if (isPanning) {
      setPanX(screenX - panStart.x);
      setPanY(screenY - panStart.y);
      return;
    }

    if (draggingCompId) {
      // Snap to 2.54mm grid if on breadboard or veroboard
      const GRID = substrate === 'fr4' ? 0.5 : 2.54;
      const targetX = Math.round((boardPos.x - dragOffset.x) / GRID) * GRID;
      const targetY = Math.round((boardPos.y - dragOffset.y) / GRID) * GRID;
      onUpdateComponentPosition(draggingCompId, Number(targetX.toFixed(2)), Number(targetY.toFixed(2)));
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prev) => Math.max(2.0, Math.min(25.0, prev * zoomFactor)));
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Floating Canvas Quick HUD */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded px-2.5 py-1.5 text-xs text-slate-300 flex items-center space-x-3 pointer-events-none">
        <span>Substrate: <strong className="text-amber-400 capitalize">{substrate}</strong></span>
        <span>Layer: <strong className={activeLayer === 'top_copper' ? 'text-red-400' : 'text-blue-400'}>{activeLayer}</strong></span>
        <span>Cursor: ({mouseBoardPos.x}mm, {mouseBoardPos.y}mm)</span>
        <span>Zoom: {Math.round(scale * 10)}%</span>
      </div>
    </div>
  );
}
