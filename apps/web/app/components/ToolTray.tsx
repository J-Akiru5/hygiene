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
        {/* Placeholder for actual wood grain texture */}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-around h-full py-6">
        
        {/* Tool 1: Toothbrush */}
        <div 
          onClick={() => setActiveTool("Toothbrush")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Toothbrush" ? "scale-110 bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          {/* Target Icon */}
          <img src="/assets/teeth.png" alt="Tooth" className="w-8 h-8 drop-shadow-md" onError={(e) => e.currentTarget.style.display='none'} />
          
          <div className="flex items-center gap-2 mt-1">
             <img src="/assets/toothbrush.png" alt="Toothbrush" className="w-12 h-32 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/40x120/4ade80/fff?text=Brush"}} />
             <img src="/assets/toothpaste.png" alt="Toothpaste" className="w-14 h-24 object-contain drop-shadow-xl translate-y-4" onError={(e) => { e.currentTarget.src="https://placehold.co/50x100/38bdf8/fff?text=Paste"}} />
          </div>
        </div>

        {/* Tool 2: Cotton Swabs */}
        <div 
          onClick={() => setActiveTool("Cotton Swab")}
          className={`relative flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Cotton Swab" ? "scale-110 bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          {/* Pointer Hint - Only shows if no tool is selected yet */}
          {!activeTool && (
            <div className="absolute -left-[9.5rem] top-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse drop-shadow-lg pointer-events-none">
               <span className="font-extrabold text-lg text-black bg-white px-2 py-0.5 rounded-xl border-2 border-black whitespace-nowrap hidden lg:block">Tap & Drag</span>
               <img src="/assets/icon-finger.png" alt="Pointer" className="w-10 h-10 -rotate-90 hidden lg:block" onError={(e) => e.currentTarget.style.display='none'} />
               {/* Arrow */}
               <svg className="w-8 h-8 text-black hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          )}

          <img src="/assets/eras.png" alt="Ear" className="w-8 h-8 drop-shadow-md" onError={(e) => e.currentTarget.style.display='none'} />
          <img src="/assets/swabs.png" alt="Cotton Swabs" className="w-20 h-24 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/80x100/e2e8f0/64748b?text=Swabs"}} />
        </div>

        {/* Tool 3: Washcloth */}
        <div 
          onClick={() => setActiveTool("Washcloth")}
          className={`flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 p-2 rounded-2xl ${activeTool === "Washcloth" ? "scale-110 bg-white/20 ring-4 ring-white/50" : "hover:scale-105"}`}
        >
          <img src="/assets/face.png" alt="Face" className="w-8 h-8 drop-shadow-md" onError={(e) => e.currentTarget.style.display='none'} />
          
          <div className="flex items-end gap-2">
             <img src="/assets/towel.png" alt="Washcloth" className="w-32 h-24 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/80x60/f8fafc/94a3b8?text=Cloth"}} />
             <img src="/assets/soap.png" alt="Soap" className="w-24 h-16 object-contain drop-shadow-xl" onError={(e) => { e.currentTarget.src="https://placehold.co/60x40/fcd34d/b45309?text=Soap"}} />
          </div>
        </div>

      </div>
    </div>
  );
}
