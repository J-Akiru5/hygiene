import React from "react";
import { GameEngine } from "./components/GameEngine";

export default function HygieneHeroPage() {
  return (
    <div className="min-h-screen bg-[#cce9fc] flex items-center justify-center p-4 font-sans touch-none">
      {/* Container to enforce the 16:9 ratio of the game board */}
      <div className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden border-[12px] border-white rounded-[3rem] shadow-2xl flex flex-col">
        {/* Bathroom Wall Tile Background (Pure CSS grid) */}
        <div 
          className="absolute inset-0 z-0 h-[70%]"
          style={{
            backgroundColor: "#dff0f9",
            backgroundImage: "linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px)",
            backgroundSize: "100px 50px"
          }}
        />

        {/* Bathroom Floor Background */}
        <div 
          className="absolute bottom-0 w-full h-[30%] z-0"
          style={{
            backgroundColor: "#c5e6f5",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.8) 2px, transparent 2px)",
            backgroundSize: "80px 30px",
            borderTop: "4px solid white"
          }}
        />
        
        {/* Floating Bubbles */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 10%, transparent 12%), radial-gradient(circle, rgba(255,255,255,0.8) 10%, transparent 12%)",
            backgroundSize: "200px 200px, 300px 300px",
            backgroundPosition: "0 0, 50px 50px"
          }}
        />

        <GameEngine />
      </div>
    </div>
  );
}
