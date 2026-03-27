/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { ToolType, ToolTray } from "./ToolTray";
import { CanvasEraser } from "./CanvasEraser";
import { Modal } from "@repo/ui/modal";

export function GameEngine() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [progress, setProgress] = useState(0);
  const [winState, setWinState] = useState(false);

  useEffect(() => {
    if (progress >= 95 && !winState) {
      setWinState(true);
      setProgress(100);
    }
  }, [progress, winState]);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <>
      <Modal isOpen={winState} onClose={handleRestart} title="100% Goal Met!">
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">✨🏆✨</div>
          <p className="text-gray-700">The messy girl is now sparkling clean!</p>
        </div>
      </Modal>

      {/* Main Canvas - Central Girl */}
      <div className="absolute inset-0 flex flex-col items-center justify-end z-10 w-full h-full pointer-events-none">
         {/* Push the canvas towards the bottom-center as seen in mockup */}
         <div className="relative w-full h-full pointer-events-auto flex items-end justify-center pb-0">
           <CanvasEraser activeTool={activeTool} onProgressChange={setProgress} winState={winState} />
         </div>
      </div>

      {/* Top Left Progress Area */}
      <div className="absolute top-6 left-6 bg-white border-4 border-black rounded-[2rem] p-4 w-72 z-20 shadow-[6px_6px_0px_#000]">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-6 border-2 border-black overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="font-extrabold text-xl">{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-around mt-4 px-2">
           <img src="/assets/teeth.png" alt="Tooth" className={`w-8 h-8 ${progress > 33 ? 'opacity-100' : 'opacity-40'}`} onError={(e) => e.currentTarget.style.display='none'} />
           <img src="/assets/eras.png" alt="Ear" className={`w-8 h-8 ${progress > 66 ? 'opacity-100' : 'opacity-40'}`} onError={(e) => e.currentTarget.style.display='none'} />
           <img src="/assets/face.png" alt="Face" className={`w-8 h-8 ${progress > 94 ? 'opacity-100' : 'opacity-40'}`} onError={(e) => e.currentTarget.style.display='none'} />
        </div>
      </div>

      {/* Mid Left Instructions */}
      <div className="absolute top-44 left-6 bg-[#f0f9ff] border-4 border-black rounded-[1.5rem] p-5 w-[22rem] z-20 shadow-[6px_6px_0px_#000]">
         <p className="font-black text-xl text-center leading-snug tracking-tight">
           Goal: Make the messy girl sparkling clean! Tap a tool on the right to start.
         </p>
      </div>

      {/* Title Badge Top Center-ish */}
      <div className="absolute top-6 left-[30%] bg-white border-[3px] border-black rounded-xl px-4 py-2 transform -rotate-2 z-20 shadow-[4px_4px_0px_#000]">
         <h1 className="text-2xl font-black uppercase text-[#4aa5c2] tracking-tighter leading-none" style={{textShadow: "1px 1px 0 #000"}}>HYGIENE HERO:</h1>
         <h2 className="text-lg font-bold text-black tracking-tight leading-none mt-1">The Get-Clean Challenge!</h2>
      </div>

      {/* Right Tool Tray */}
      <div className="absolute top-6 bottom-6 right-6 w-52 z-20">
        <ToolTray activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>
    </>
  );
}
