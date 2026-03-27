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
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[44%] min-w-[320px] max-w-[560px] pointer-events-auto">
          <CanvasEraser activeTool={activeTool} onProgressChange={setProgress} winState={winState} playScrub={playScrub} />
        </div>
      </div>

      {/* Top Left Progress Area */}
      <div className="absolute top-[3.5%] left-[2%] bg-[#f5fbff] border-4 border-black rounded-[1.5rem] p-4 w-[24%] min-w-[210px] max-w-[330px] z-20 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-4">
          <progress className="game-progress flex-1 h-8" max={100} value={Math.round(progress)} />
          <span className="font-extrabold text-2xl">{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-start gap-6 mt-4 ml-6">
           <img src="/assets/teeth.png" alt="Tooth" className={`w-8 h-8 object-contain ${progress > 33 ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`} />
           <img src="/assets/eras.png" alt="Ear" className={`w-8 h-8 object-contain ${progress > 66 ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`} />
           <img src="/assets/face.png" alt="Face" className={`w-8 h-8 object-contain ${progress > 94 ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`} />
        </div>
      </div>

      {/* Mid Left Instructions */}
      <div className="absolute top-[27%] left-[2%] bg-[#f5fbff] border-4 border-black rounded-[1.2rem] p-5 w-[30%] min-w-[250px] max-w-[430px] z-20 shadow-[4px_4px_0px_#000]">
         <p className="font-bold text-xl text-center leading-snug tracking-tight text-gray-800">
           Goal: Make the messy girl sparkling clean! Tap a tool on the right to start.
         </p>
      </div>

      {/* Title Badge Top Center */}
      <div className="absolute top-[3.7%] left-1/2 -translate-x-1/2 bg-[#e0f1fa] border-[4px] border-black rounded-3xl px-8 py-3 z-20 shadow-[4px_4px_0px_#000] text-center min-w-[380px]">
        <h1 className="game-title text-[58px] leading-[0.92] font-black uppercase text-[#88cdda] tracking-tight">HYGIENE HERO:</h1>
        <h2 className="text-[31px] leading-[0.95] font-black text-black tracking-tight mt-1">The Get-Clean Challenge!</h2>
      </div>

      {/* Right Tool Tray */}
      <div className="absolute top-[2.4%] bottom-[2.4%] right-[1.8%] w-[18.6%] min-w-[190px] max-w-[255px] z-20">
        <ToolTray activeTool={activeTool} setActiveTool={(t) => { setActiveTool(t); playBlip(); }} />
      </div>
    </>
  );
}
