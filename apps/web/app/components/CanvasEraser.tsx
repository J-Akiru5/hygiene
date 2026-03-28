/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ToolType } from "./ToolTray";

interface CanvasEraserProps {
  activeTool: ToolType;
  onProgressChange: (progress: number) => void;
  winState: boolean;
  playScrub?: (isScrubbing: boolean) => void;
}

// Hitboxes tuned to the current character art framing.
const ZONES = [
  { id: "Teeth", tool: "Toothbrush", rects: [{ x: 0.30, y: 0.40, w: 0.30, h: 0.22 }] },
  { id: "Ears", tool: "Cotton Swab", rects: [
    { x: 0.19, y: 0.37, w: 0.17, h: 0.25 }, // Left Ear
    { x: 0.64, y: 0.37, w: 0.17, h: 0.25 }  // Right Ear
  ]},
  { id: "Face", tool: "Washcloth", rects: [{ x: 0.29, y: 0.23, w: 0.43, h: 0.39 }] },
];

export function CanvasEraser({ activeTool, onProgressChange, winState, playScrub }: CanvasEraserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [baselinePixels, setBaselinePixels] = useState<number>(0);
  const [dirtMask, setDirtMask] = useState<Uint8Array | null>(null);
  const [warningMsg, setWarningMsg] = useState<{ x: number, y: number, text: string } | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  interface Particle { id: number; x: number; y: number; size: number; color: string; }
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  const spawnParticle = (x: number, y: number, canvasW: number, canvasH: number) => {
    if (Math.random() > 0.3) return; // 30% spawn chance
    const id = ++particleIdRef.current;
    const newP = { 
      id, 
      x: (x / canvasW) * 100, 
      y: (y / canvasH) * 100,
      size: Math.random() * 20 + 20,
      color: activeTool === "Toothbrush" ? "#ffffff" : activeTool === "Washcloth" ? "#c8f0d8" : "#ffe0cc"
    };
    setParticles(prev => [...prev.slice(-15), newP]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 600);
  };

  // Load and draw the dirt
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const cleanImg = new Image();
    cleanImg.src = "/assets/girl-happy.png";
    const overlayImg = new Image();
    overlayImg.src = "/assets/girl-dirty.png";

    Promise.all([
      new Promise(r => { cleanImg.onload = r; cleanImg.onerror = r; }),
      new Promise(r => { overlayImg.onload = r; overlayImg.onerror = r; })
    ]).then(() => {
      // Use image's intrinsic resolutions for perfect aspect ratio
      canvas.width = overlayImg.width || 800;
      canvas.height = overlayImg.height || 800;

      // Draw dirty overlay entirely
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
      
      const dirtyData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      // Draw clean face on an offscreen canvas to compare
      const baseCanvas = document.createElement("canvas");
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      const baseCtx = baseCanvas.getContext("2d");
      
      if (baseCtx) {
        baseCtx.drawImage(cleanImg, 0, 0, canvas.width, canvas.height);
        const cleanData = baseCtx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        const mask = new Uint8Array(canvas.width * canvas.height);
        let count = 0;
        
        for (let i = 0; i < canvas.width * canvas.height; i++) {
          const idx = i * 4;
          const rDiff = Math.abs(cleanData[idx] - dirtyData[idx]);
          const gDiff = Math.abs(cleanData[idx+1] - dirtyData[idx+1]);
          const bDiff = Math.abs(cleanData[idx+2] - dirtyData[idx+2]);
          const aDiff = Math.abs(cleanData[idx+3] - dirtyData[idx+3]);
          
          if (rDiff > 20 || gDiff > 20 || bDiff > 20 || aDiff > 20) {
            // Check if inside ZONES
            const cx = (i % canvas.width) / canvas.width;
            const cy = Math.floor(i / canvas.width) / canvas.height;
            let inZone = false;
            for (const zone of ZONES) {
              for (const rect of zone.rects) {
                if (cx >= rect.x && cx <= rect.x + rect.w && cy >= rect.y && cy <= rect.y + rect.h) {
                  inZone = true;
                  break;
                }
              }
              if (inZone) break;
            }
            if (inZone) {
              mask[i] = 1;
              count++;
            }
          }
        }
        setDirtMask(mask);
        setBaselinePixels(count > 0 ? count : 1);
      } else {
        setBaselinePixels(canvas.width * canvas.height);
      }
    });
  }, []);

  const calculateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || baselinePixels === 0 || !dirtMask) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let currentOpaque = 0;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    for (let i = 0; i < canvas.width * canvas.height; i++) {
       if (dirtMask[i] === 1) {
          if (imgData[i * 4 + 3] > 128) {
             currentOpaque++;
          }
       }
    }

    const removed = baselinePixels - currentOpaque;
    let progress = (removed / baselinePixels) * 100;
    
    // Cap at 100
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    
    // Smooth to nearest integer
    onProgressChange(progress);
  }, [baselinePixels, onProgressChange, dirtMask]);

  const getCanvasCoords = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const isPointInValidZone = (x: number, y: number) => {
    if (!activeTool) return false;
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Check hitboxes
    for (const zone of ZONES) {
      if (zone.tool === activeTool) {
        for (const rect of zone.rects) {
          const rx = rect.x * canvas.width;
          const ry = rect.y * canvas.height;
          const rw = rect.w * canvas.width;
          const rh = rect.h * canvas.height;
          // Add a generous margin to the hitbox so scrubbing edges doesn't feel completely dead
          const margin = 40; 
          if (x >= rx - margin && x <= rx + rw + margin && y >= ry - margin && y <= ry + rh + margin) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const showWarning = (x: number, y: number, pageX: number, pageY: number) => {
    let targetZone = null;
    let insideAnyRect = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (const zone of ZONES) {
      if (zone.tool !== activeTool) {
        for (const rect of zone.rects) {
          const rx = rect.x * canvas.width;
          const ry = rect.y * canvas.height;
          const rw = rect.w * canvas.width;
          const rh = rect.h * canvas.height;
          const margin = 40;
          if (x >= rx - margin && x <= rx + rw + margin && y >= ry - margin && y <= ry + rh + margin) {
            targetZone = zone;
            insideAnyRect = true;
            break;
          }
        }
      }
      if (insideAnyRect) break;
    }

    if (warningTimer.current) clearTimeout(warningTimer.current);
    
    if (targetZone) {
      setWarningMsg({ x: pageX, y: pageY, text: `Use the ${targetZone.tool} here!` });
    } else {
      setWarningMsg({ x: pageX, y: pageY, text: "Nothing to clean here!" });
    }
    
    warningTimer.current = setTimeout(() => setWarningMsg(null), 1500);
  };

  const startDrawing = (e: React.PointerEvent) => {
    // Need a tool to scrub
    if (!activeTool) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    if (!isPointInValidZone(x, y)) {
      showWarning(x, y, e.clientX, e.clientY);
      return;
    }
    
    setIsDrawing(true);
    setLastPos({ x, y });
    eraseAt(x, y, x, y);
    spawnParticle(x, y, canvas.width, canvas.height);
    playScrub?.(true);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPos || !activeTool) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    
    if (isPointInValidZone(x, y)) {
      eraseAt(lastPos.x, lastPos.y, x, y);
      setLastPos({ x, y });
      spawnParticle(x, y, canvas.width, canvas.height);
    } else {
      // Stop drawing if they stray out of the zone
      setLastPos(null);
      setIsDrawing(false);
      playScrub?.(false);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      // Calculate progress periodically (on mouse up is most efficient)
      calculateProgress();
      playScrub?.(false);
    }
  };

  const eraseAt = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Erase brush size depends on tool
    ctx.lineWidth = activeTool === "Cotton Swab" ? 30 : activeTool === "Toothbrush" ? 50 : 80;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  return (
    <div 
      className={`relative w-full bg-transparent group touch-none select-none overflow-hidden ${activeTool ? 'cursor-none' : 'cursor-crosshair'}`}
    >
      {/* Base Image underneath */}
      <img
        src="/assets/girl-happy.png"
        alt="Clean Face"
        className="w-full h-auto pointer-events-none block"
      />
      
      {/* Dirt overlay canvas on top */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full touch-none duration-1000 ${winState ? 'opacity-0 scale-105' : 'opacity-100'}`}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        onPointerCancel={stopDrawing}
      />

      {/* Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float-fade"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Soft Warning Overlay */}
      {warningMsg && (
        <div 
          className="fixed z-[10000] pointer-events-none bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg border-2 border-white animate-bounce"
          style={{ left: warningMsg.x, top: warningMsg.y - 60, transform: 'translateX(-50%)' }}
        >
          {warningMsg.text}
        </div>
      )}
    </div>
  );
}
