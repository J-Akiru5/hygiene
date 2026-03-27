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
      <div className="absolute inset-0 bg-[#d1a67a] rounded-[2.5rem] border-[8px] border-[#9b6840] shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] overflow-hidden">
        <img src="/assets/wooden-platform.png" alt="Tool board" className="absolute inset-0 w-full h-full object-cover opacity-85" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-8 px-2">
        
        {/* Tool 1: Toothbrush */}
        <div 
          onClick={() => setActiveTool("Toothbrush")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Toothbrush" ? "scale-[1.07] bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          {/* Target Icon */}
          <img src="/assets/teeth.png" alt="Tooth" className="w-9 h-9 drop-shadow-md" onError={(e) => e.currentTarget.style.display='none'} />
          
          <div className="flex items-center gap-2 mt-1">
             <img src="/assets/toothbrush.png" alt="Toothbrush" className="w-12 h-32 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/40x120/4ade80/fff?text=Brush"}} />
             <img src="/assets/toothpaste.png" alt="Toothpaste" className="w-14 h-24 object-contain drop-shadow-xl translate-y-4" onError={(e) => { e.currentTarget.src="https://placehold.co/50x100/38bdf8/fff?text=Paste"}} />
          </div>
        </div>

        {/* Tool 2: Cotton Swabs */}
        <div 
          onClick={() => setActiveTool("Cotton Swab")}
          className={`relative flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Cotton Swab" ? "scale-[1.07] bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          {/* Pointer Hint - Only shows if no tool is selected yet */}
          {!activeTool && (
            <div className="absolute -left-[9.8rem] top-1/2 -translate-y-1/2 flex items-center gap-2 animate-pulse drop-shadow-lg pointer-events-none">
               <span className="font-extrabold text-[46px] leading-none text-black whitespace-nowrap hidden xl:block">Tap &amp; Drag</span>
               <img src="/assets/icon-finger.png" alt="Pointer" className="w-14 h-14 hidden xl:block" onError={(e) => e.currentTarget.style.display='none'} />
            </div>
          )}

          <img src="/assets/eras.png" alt="Ear" className="w-9 h-9 drop-shadow-md" onError={(e) => e.currentTarget.style.display='none'} />
          <img src="/assets/swabs.png" alt="Cotton Swabs" className="w-20 h-24 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/80x100/e2e8f0/64748b?text=Swabs"}} />
        </div>

        {/* Tool 3: Washcloth */}
        <div 
          onClick={() => setActiveTool("Washcloth")}
          className={`flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Washcloth" ? "scale-[1.07] bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          <img src="/assets/face.png" alt="Face" className="w-9 h-9 drop-shadow-md" onError={(e) => e.currentTarget.style.display='none'} />
          
          <div className="flex items-end gap-2">
             <img src="/assets/towel.png" alt="Washcloth" className="w-28 h-24 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/80x60/f8fafc/94a3b8?text=Cloth"}} />
             <img src="/assets/soap.png" alt="Soap" className="w-24 h-16 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/60x40/fcd34d/b45309?text=Soap"}} />
          </div>
        </div>

      </div>
    </div>
  );
}
