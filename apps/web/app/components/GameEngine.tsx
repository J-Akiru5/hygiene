/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { ToolType, ToolTray } from "./ToolTray";
import { CanvasEraser } from "./CanvasEraser";
import { Modal } from "@repo/ui/modal";
import { useSound } from "../hooks/useSound";

export function GameEngine() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [progress, setProgress] = useState(0);
  const [winState, setWinState] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const { initAudio, isReady, playBGM, playWin, stopBGM, playBlip, setupScrubbing, playScrub } = useSound();

  useEffect(() => {
    if (isReady && hasStarted) {
      playBGM();
      return () => stopBGM();
    }
  }, [isReady, hasStarted, playBGM, stopBGM]);

  useEffect(() => {
    if (progress >= 95 && !winState) {
      setWinState(true);
      setProgress(100);
      playWin();
    }
  }, [progress, winState, playWin]);

  const handleRestart = () => {
    window.location.reload();
  };

  const handleStart = () => {
    initAudio();
    setupScrubbing();
    setHasStarted(true);
  };

  return (
    <>
      {/* Start Screen Overlay to unlock Web Audio API */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm rounded-[3rem]">
          <button 
            onClick={handleStart}
            className="bg-[#4aa5c2] text-white font-black text-4xl px-12 py-6 rounded-3xl border-4 border-white shadow-[0_10px_0_#2b7a94] active:shadow-none active:translate-y-[10px] transition-all"
          >
            PLAY GAME!
          </button>
        </div>
      )}

      <Modal isOpen={winState} onClose={handleRestart} title="100% Goal Met!">
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">✨🏆✨</div>
          <p className="text-gray-700 font-bold text-xl">The messy girl is now sparkling clean!</p>
        </div>
      </Modal>

      {/* Main Canvas - Central Girl */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[clamp(250px,44%,560px)] pointer-events-auto">
          <CanvasEraser activeTool={activeTool} onProgressChange={setProgress} winState={winState} playScrub={playScrub} />
        </div>
      </div>

      {/* Top Left Progress Area */}
      <div className="absolute top-[3.5%] left-[2%] bg-[#f5fbff] border-4 border-black rounded-[1.5rem] p-[clamp(8px,1vw,16px)] w-[clamp(180px,24%,330px)] z-20 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-4">
          <progress className="game-progress flex-1 h-[clamp(18px,3vw,32px)]" max={100} value={Math.round(progress)} />
          <span className="font-extrabold text-[clamp(18px,2vw,32px)]">{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-start gap-[clamp(10px,1.4vw,24px)] mt-3 ml-[clamp(8px,1.2vw,24px)]">
           <img src="/assets/teeth.png" alt="Tooth" className={`w-[clamp(20px,2vw,32px)] h-[clamp(20px,2vw,32px)] object-contain ${progress > 33 ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`} />
           <img src="/assets/eras.png" alt="Ear" className={`w-[clamp(20px,2vw,32px)] h-[clamp(20px,2vw,32px)] object-contain ${progress > 66 ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`} />
           <img src="/assets/face.png" alt="Face" className={`w-[clamp(20px,2vw,32px)] h-[clamp(20px,2vw,32px)] object-contain ${progress > 94 ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`} />
        </div>
      </div>

      {/* Mid Left Instructions */}
      <div className="absolute top-[27%] left-[2%] bg-[#f5fbff] border-4 border-black rounded-[1.2rem] p-[clamp(10px,1.3vw,20px)] w-[clamp(210px,30%,430px)] z-20 shadow-[4px_4px_0px_#000]">
         <p className="font-bold text-[clamp(16px,2vw,48px)] text-center leading-[1.06] tracking-tight text-gray-800">
           Goal: Make the messy girl sparkling clean! Tap a tool on the right to start.
         </p>
      </div>

      {/* Title Badge Top Center */}
      <div className="absolute top-[3.7%] left-1/2 -translate-x-1/2 bg-[#e0f1fa] border-[4px] border-black rounded-3xl px-[clamp(12px,2vw,32px)] py-[clamp(8px,1vw,12px)] z-20 shadow-[4px_4px_0px_#000] text-center w-[clamp(300px,40%,640px)]">
        <h1 className="game-title text-[clamp(28px,4.2vw,58px)] leading-[0.92] font-black uppercase text-[#88cdda] tracking-tight">HYGIENE HERO:</h1>
        <h2 className="text-[clamp(16px,2.2vw,31px)] leading-[0.95] font-black text-black tracking-tight mt-1">The Get-Clean Challenge!</h2>
      </div>

      {/* Right Tool Tray */}
      <div className="absolute top-[2.4%] bottom-[2.4%] right-[1.8%] w-[clamp(145px,18.6%,255px)] z-20">
        <ToolTray activeTool={activeTool} setActiveTool={(t) => { setActiveTool(t); playBlip(); }} />
      </div>
    </>
  );
}
