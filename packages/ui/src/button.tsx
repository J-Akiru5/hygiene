import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Button({ children, active, className, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-6 py-3 font-bold transition-all duration-200 shadow-md transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 ${
        active
          ? "bg-blue-600 text-white shadow-blue-500/50 ring-4 ring-blue-300"
          : "bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600"
      } ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
