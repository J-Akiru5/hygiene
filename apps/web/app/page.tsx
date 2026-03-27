import React from "react";
import { GameEngine } from "./components/GameEngine";

export default function HygieneHeroPage() {
  return (
    <div className="min-h-screen bg-[#a9cde5] flex items-center justify-center p-2 md:p-4 font-sans touch-none">
      {/* Container to enforce the 16:9 ratio of the game board */}
      <div id="hygiene-board" className="relative w-[min(100%,calc((100vh-1rem)*16/9))] max-w-[1366px] aspect-[16/9] overflow-hidden border-[4px] border-black rounded-[1.8rem] shadow-[0_10px_25px_rgba(0,0,0,0.24)] flex flex-col bg-[#d9eff9]">
        {/* Bathroom Wall Tile Background (Pure CSS grid) */}
        <div className="bathroom-wall absolute inset-0 z-0 h-[70%]" />

        {/* Bathroom Floor Background */}
        <div className="bathroom-floor absolute bottom-0 w-full h-[30%] z-0" />
        
        {/* Floating Bubbles */}
        <div className="bathroom-bubbles absolute inset-0 pointer-events-none z-10 opacity-70" />

        <GameEngine />
      </div>
    </div>
  );
}
