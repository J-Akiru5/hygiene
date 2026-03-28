/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export type ToolType = "Toothbrush" | "Cotton Swab" | "Washcloth" | null;

interface ToolTrayProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

export function ToolTray({ activeTool, setActiveTool }: ToolTrayProps) {
  // We use the exact layout from the Mockup: Wooden board with 3 compartments.
  return (
    <div className="w-full h-full relative group touch-none select-none">
      {/* Wooden Background Base */}
      <div className="absolute inset-0 bg-[#d1a67a] rounded-[2rem] border-[6px] border-[#9b6840] shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] overflow-hidden">
        <img src="/assets/wooden-platform.png" alt="Tool board" className="absolute inset-0 w-full h-full object-cover opacity-85" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-2 py-6">
        
        {/* Tool 1: Toothbrush */}
        <div 
          onMouseEnter={() => setActiveTool("Toothbrush")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Toothbrush" ? "scale-[1.07] bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          {/* Target Icon */}
          <img src="/assets/teeth.png" alt="Tooth" className="h-[5vh] w-auto drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
          
          <div className="mt-1 flex items-end gap-2">
            <img src="/assets/toothbrush.png" alt="Toothbrush" className="h-[18vh] w-auto object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src = "https://placehold.co/40x120/4ade80/fff?text=Brush" }} />
            <img src="/assets/toothpaste.png" alt="Toothpaste" className="h-[14vh] w-auto translate-y-[1vh] object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src = "https://placehold.co/50x100/38bdf8/fff?text=Paste" }} />
          </div>
        </div>

        {/* Tool 2: Cotton Swabs */}
        <div 
          onMouseEnter={() => setActiveTool("Cotton Swab")}
          className={`relative flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Cotton Swab" ? "scale-[1.07] bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          {/* Pointer Hint - Only shows if no tool is selected yet */}
          {!activeTool && (
            <div className="absolute right-[110%] top-1/2 -translate-y-1/2 flex items-center gap-2 animate-pulse drop-shadow-lg pointer-events-none">
              <span className="font-extrabold text-[clamp(20px,4.5vh,42px)] leading-none text-black whitespace-nowrap hidden lg:block">Tap &amp; Drag</span>
              <img src="/assets/icon-finger.png" alt="Pointer" className="w-[clamp(28px,5.5vh,56px)] h-[clamp(28px,5.5vh,56px)] hidden lg:block" onError={(e) => e.currentTarget.style.display='none'} />
            </div>
          )}

          <img src="/assets/eras.png" alt="Ear" className="h-[5vh] w-auto drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
          <img src="/assets/swabs.png" alt="Cotton Swabs" className="h-[14vh] w-auto object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src = "https://placehold.co/80x100/e2e8f0/64748b?text=Swabs" }} />
        </div>

        {/* Tool 3: Washcloth */}
        <div 
          onMouseEnter={() => setActiveTool("Washcloth")}
          className={`flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Washcloth" ? "scale-[1.07] bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          <img src="/assets/face.png" alt="Face" className="h-[5vh] w-auto drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
          
          <div className="flex items-end gap-[1vh]">
            <img src="/assets/towel.png" alt="Washcloth" className="h-[10vh] w-auto object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src = "https://placehold.co/80x60/f8fafc/94a3b8?text=Cloth" }} />
            <img src="/assets/soap.png" alt="Soap" className="h-[8vh] w-auto object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src = "https://placehold.co/60x40/fcd34d/b45309?text=Soap" }} />
          </div>
        </div>

      </div>
    </div>
  );
}
