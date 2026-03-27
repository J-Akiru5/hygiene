"use client";

import { useRef, useCallback, useState } from "react";

// Procedural Audio Engine using Web Audio API
export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgmOscRef = useRef<OscillatorNode | null>(null);
  const scrubNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const scrubGainRef = useRef<GainNode | null>(null);
  const bgmGainRef = useRef<GainNode | null>(null);

  const [isReady, setIsReady] = useState(false);

  // Initialize context on first user interaction
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      setIsReady(true);
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  // Cute blip for selecting tools
  const playBlip = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  // Generate continuous scrubbing noise (filtered white noise)
  const setupScrubbing = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || scrubNoiseRef.current) return;

    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to make it sound like suds / scrubbing
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    
    const gain = ctx.createGain();
    gain.gain.value = 0; // Start silenced

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start();
    
    scrubNoiseRef.current = noiseSource;
    scrubGainRef.current = gain;
  }, []);

  const playScrub = useCallback((isScrubbing: boolean) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !scrubGainRef.current) return;

    if (isScrubbing) {
        // fade in
        scrubGainRef.current.gain.setTargetAtTime(0.2, ctx.currentTime, 0.05);
    } else {
        // fade out
        scrubGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    }
  }, []);

  // Triumphant Win Arpeggio
  const playWin = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const now = ctx.currentTime;
    
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "square";
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.6);
    });
  }, []);

  // Simple Happy BGM (pentatonic loop)
  const playBGM = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || bgmOscRef.current) return;

    const bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.03; // Very quiet background music
    bgmGain.connect(ctx.destination);
    bgmGainRef.current = bgmGain;

    const melody = [
        261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66 // C4, D4, E4, G4, A4, G4, E4, D4
    ];
    let noteIndex = 0;

    // We'll use setInterval to trigger notes for simplicity in this retro engine
    const interval = setInterval(() => {
        if (ctx.state === "suspended") return;
        
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.type = "triangle";
        osc.frequency.value = melody[noteIndex] || 261.63;
        
        noteGain.gain.setValueAtTime(1, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.connect(noteGain);
        noteGain.connect(bgmGain);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        noteIndex = (noteIndex + 1) % melody.length;
    }, 400); // 150 BPM

    // Store a dummy oscillator just to track state (so we don't start it twice)
    bgmOscRef.current = ctx.createOscillator();

    return () => clearInterval(interval);
  }, []);
  
  const stopBGM = useCallback(() => {
    if (bgmGainRef.current) {
        bgmGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime || 0, 0.5);
    }
  }, []);

  return { initAudio, isReady, playBlip, setupScrubbing, playScrub, playWin, playBGM, stopBGM };
}
