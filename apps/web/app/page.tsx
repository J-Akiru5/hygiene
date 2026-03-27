import React from "react";
import { GameEngine } from "./components/GameEngine";

export default function HygieneHeroPage() {
  return (
    <div className="min-h-screen bg-[#cce9fc] flex items-center justify-center p-4 font-sans touch-none">
      {/* Container to enforce the 16:9 ratio of the game board */}
      <div className="relative w-full max-w-5xl aspect-[16/9] bg-[#dff0f9] overflow-hidden border-[12px] border-white rounded-[3rem] shadow-2xl">
        {/* Placeholder Tile Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/placeholder-tile.png')",
            backgroundSize: "100px 50px"
          }}
        />
        
        {/* Placeholder Bubbles Foreground */}
        <div 
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            backgroundImage: "url('/assets/bubbles1.png')",
            backgroundSize: "cover"
          }}
        />

        <GameEngine />
      </div>
    </div>
  );
}
