import * as React from "react";

export function ProgressBar({ progress, className }: { progress: number, className?: string }) {
  const percentage = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`w-full max-w-md mx-auto relative rounded-full bg-white/80 backdrop-blur-md border-4 border-white/50 shadow-inner h-12 overflow-hidden ${className || ""}`}>
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
      {/* Glossy overlay effect built organically */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20" />
      <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xl text-gray-800 mix-blend-overlay drop-shadow-md tracking-wider">
        {Math.round(percentage)}% CLEAN
      </div>
    </div>
  );
}
