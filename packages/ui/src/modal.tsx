import * as React from "react";

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95 duration-300 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-4 text-center">
          {title}
        </h2>
        <div className="mb-8 w-full text-center text-gray-600 font-medium text-lg">
          {children}
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-500/30 transform transition active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
