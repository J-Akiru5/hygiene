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

// Approximate hitboxes relative to canvas width/height (0.0 to 1.0)
const ZONES = [
  { id: "Teeth", tool: "Toothbrush", rects: [{ x: 0.35, y: 0.65, w: 0.3, h: 0.15 }] },
  { id: "Ears", tool: "Cotton Swab", rects: [
    { x: 0.05, y: 0.35, w: 0.20, h: 0.25 }, // Left Ear
    { x: 0.75, y: 0.35, w: 0.20, h: 0.25 }  // Right Ear
  ]},
  { id: "Face", tool: "Washcloth", rects: [{ x: 0.25, y: 0.20, w: 0.5, h: 0.45 }] },
];

export function CanvasEraser({ activeTool, onProgressChange, winState, playScrub }: CanvasEraserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [baselinePixels, setBaselinePixels] = useState<number>(0);

  // Load and draw the dirt
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const overlayImg = new Image();
    overlayImg.src = "/assets/girl-dirty.png";
    overlayImg.onload = () => {
      // Use image's intrinsic resolutions for perfect aspect ratio
      canvas.width = overlayImg.width || 800;
      canvas.height = overlayImg.height || 800;

      // Draw dirty overlay entirely
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
      
      // Calculate baseline opaque pixels ONLY inside the target zones
      let count = 0;
      for (const zone of ZONES) {
        for (const rect of zone.rects) {
           const rx = Math.floor(rect.x * canvas.width);
           const ry = Math.floor(rect.y * canvas.height);
           const rw = Math.floor(rect.w * canvas.width);
           const rh = Math.floor(rect.h * canvas.height);
           const imgData = ctx.getImageData(rx, ry, rw, rh);
           for (let i = 3; i < imgData.data.length; i += 4) {
             if (imgData.data[i]! > 128) count++;
           }
        }
      }
      setBaselinePixels(count > 0 ? count : 1);
    };
    overlayImg.onerror = () => {
      canvas.width = 800;
      canvas.height = 800;
      ctx.fillStyle = "rgba(120, 90, 60, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setBaselinePixels(canvas.width * canvas.height);
    };
  }, []);

  const calculateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || baselinePixels === 0) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let currentOpaque = 0;
    for (const zone of ZONES) {
      for (const rect of zone.rects) {
         const rx = Math.floor(rect.x * canvas.width);
         const ry = Math.floor(rect.y * canvas.height);
         const rw = Math.floor(rect.w * canvas.width);
         const rh = Math.floor(rect.h * canvas.height);
         const imgData = ctx.getImageData(rx, ry, rw, rh);
         for (let i = 3; i < imgData.data.length; i += 4) {
           if (imgData.data[i]! > 128) currentOpaque++;
         }
      }
    }

    const removed = baselinePixels - currentOpaque;
    let progress = (removed / baselinePixels) * 100;
    // Cap at 100
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    
    // Scale so that 95% threshold triggers early win easily
    // progress = Math.min(100, progress * 1.05); 
    
    // Smooth to nearest integer
    onProgressChange(progress);
  }, [baselinePixels, onProgressChange]);

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

  const startDrawing = (e: React.PointerEvent) => {
    // Need a tool to scrub
    if (!activeTool) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    if (!isPointInValidZone(x, y)) return;
    
    setIsDrawing(true);
    setLastPos({ x, y });
    eraseAt(x, y, x, y);
    playScrub?.(true);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPos || !activeTool) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    
    if (isPointInValidZone(x, y)) {
      eraseAt(lastPos.x, lastPos.y, x, y);
      setLastPos({ x, y });
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
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto rounded-3xl shadow-2xl bg-transparent group cursor-crosshair touch-none select-none drop-shadow-2xl flex items-end"
    >
      {/* Base Image underneath */}
      <img
        src={winState ? "/assets/girl-happy.png" : "/assets/girl-clean.png"}
        alt="Clean Face"
        className="w-full h-auto object-contain pointer-events-none block"
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
    </div>
  );
}
