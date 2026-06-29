"use client";

import React, { useEffect } from "react";
import { XCircle, AlertTriangle, CheckCircle2, X } from "lucide-react";

export type ToastType = "error" | "warning" | "success";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "error", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    error: {
      icon: <XCircle className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-red-500/10 border-red-500/30",
      text: "text-red-600 dark:text-red-400",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-green-500/10 border-green-500/30",
      text: "text-green-600 dark:text-green-400",
    },
  }[type];

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-start gap-3 px-5 py-4 rounded-xl border shadow-xl backdrop-blur-sm max-w-md w-full mx-4 animate-scale-up font-sans ${config.bg} ${config.text}`}
      role="alert"
    >
      {config.icon}
      <p className="text-sm leading-relaxed flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
