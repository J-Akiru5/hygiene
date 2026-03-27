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
  const [isDesktop, setIsDesktop] = useState(true);

  const { initAudio, isReady, playBGM, playWin, stopBGM, playBlip, setupScrubbing, playScrub } = useSound();

  useEffect(() => {
    const detectDesktop = () => setIsDesktop(window.innerWidth >= 900);
    detectDesktop();
    window.addEventListener("resize", detectDesktop);
    return () => window.removeEventListener("resize", detectDesktop);
  }, []);

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

      {/* Fixed reference scene to keep every element in one coordinate system */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0">
          {/* Main Canvas - Central Girl */}
          <div className="absolute left-[31.5%] top-[23.7%] z-10 w-[38.9%] pointer-events-auto">
            <CanvasEraser activeTool={activeTool} onProgressChange={setProgress} winState={winState} playScrub={playScrub} />
          </div>

          {/* Top Left Progress Area */}
          <div className="absolute left-[1.9%] top-[2.3%] z-20 w-[23.6%] rounded-[1.6rem] border-[4px] border-black bg-[#f5fbff] px-[5%] py-[4%] shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-3">
              <progress className="game-progress h-[clamp(18px,3.2vh,34px)] flex-1" max={100} value={Math.round(progress)} />
              <span className="text-[clamp(18px,2.2vw,34px)] leading-none font-extrabold text-[#1b1b1b]">{Math.round(progress)}%</span>
            </div>
            <div className="mt-3 ml-1 flex items-center justify-start gap-[clamp(10px,1.2vw,26px)]">
              <img src="/assets/teeth.png" alt="Tooth" className={`h-[clamp(24px,2.5vw,44px)] w-[clamp(24px,2.5vw,44px)] object-contain ${progress > 33 ? "opacity-100 grayscale-0" : "opacity-45 grayscale"}`} />
              <img src="/assets/eras.png" alt="Ear" className={`h-[clamp(24px,2.5vw,44px)] w-[clamp(24px,2.5vw,44px)] object-contain ${progress > 66 ? "opacity-100 grayscale-0" : "opacity-45 grayscale"}`} />
              <img src="/assets/face.png" alt="Face" className={`h-[clamp(24px,2.5vw,44px)] w-[clamp(24px,2.5vw,44px)] object-contain ${progress > 94 ? "opacity-100 grayscale-0" : "opacity-45 grayscale"}`} />
            </div>
          </div>

          {/* Mid Left Instructions */}
          <div className="absolute left-[1.8%] top-[24.5%] z-20 w-[29.9%] rounded-[1.5rem] border-[4px] border-black bg-[#f5fbff] px-[6.5%] py-[5.5%] shadow-[4px_4px_0px_#000]">
            <p className="text-center text-[clamp(16px,2vw,44px)] font-bold leading-[1.06] tracking-tight text-[#1f1f1f]">
              Goal: Make the messy girl sparkling clean! Tap a tool on the right to start.
            </p>
          </div>

          {/* Title Badge Top Center */}
          <div className="absolute left-[35.6%] top-[2.6%] z-20 w-[31.9%] rounded-[1.9rem] border-[4px] border-black bg-[#eefaff] px-[4.3%] py-[2.2%] text-center shadow-[4px_4px_0px_#000]">
            <h1 className="game-title text-[clamp(30px,4.3vw,60px)] leading-[0.84] font-black uppercase tracking-tight text-[#9edff0]">HYGIENE HERO:</h1>
            <h2 className="mt-1 text-[clamp(16px,2.25vw,32px)] leading-[0.95] font-black tracking-tight text-black">The Get-Clean Challenge!</h2>
          </div>

          {/* Right Tool Tray */}
          {isDesktop && (
            <div className="absolute right-[2.1%] top-[2.6%] z-20 h-[94.8%] w-[22.4%]">
              <ToolTray activeTool={activeTool} setActiveTool={(t) => { setActiveTool(t); playBlip(); }} />
            </div>
          )}
        </div>

        {/* Mobile fallback note when desktop tray is intentionally hidden */}
        {!isDesktop && (
          <div className="absolute inset-x-0 bottom-3 z-30 mx-auto w-fit rounded-full border-2 border-black bg-[#f5fbff] px-4 py-2 text-xs font-bold text-black pointer-events-none">
            Best experience on desktop view.
          </div>
        )}
      </div>
    </>
  );
}
