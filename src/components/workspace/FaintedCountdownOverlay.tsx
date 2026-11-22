import { useState, useEffect } from 'react';
import { Monitor, Sparkles } from 'lucide-react';

interface FaintedCountdownOverlayProps {
  isOpen: boolean;
  onCountdownComplete: () => void;
  title?: string;
  notebookName?: string;
}

export default function FaintedCountdownOverlay({
  isOpen,
  onCountdownComplete,
  title = 'Real-Time Screen Capture',
  notebookName,
}: FaintedCountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!isOpen) {
      setCount(3);
      return;
    }

    setCount(3);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onCountdownComplete();
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, onCountdownComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md text-white select-none transition-all duration-300 p-4">
      {/* Background radial glow */}
      <div className="absolute size-[500px] rounded-full bg-primary/20 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-lg">
        {/* Top Info Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-wider backdrop-blur-xl shadow-lg">
          <Monitor className="size-3.5 text-amber-300 animate-pulse" />
          <span>Starting Screen Capture in</span>
        </div>

        {/* Big Fainted 3-2-1 Circle Countdown */}
        <div className="relative flex items-center justify-center">
          {/* Animated pulse rings */}
          <div className="absolute size-48 sm:size-56 rounded-full border-2 border-primary/30 animate-ping opacity-40" />
          <div className="absolute size-40 sm:size-48 rounded-full border border-white/20 animate-pulse" />

          {/* Semi-transparent / Fainted Countdown Circle */}
          <div className="size-36 sm:size-44 rounded-full bg-white/10 backdrop-blur-2xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
            <span className="text-7xl sm:text-8xl font-black text-white/80 font-mono drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-scale-in">
              {count > 0 ? count : <Sparkles className="size-16 text-emerald-400 animate-spin" />}
            </span>
          </div>
        </div>

        {/* Details & Target Notebook */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
            System will begin extracting notes & slide details once countdown finishes.
          </p>
          {notebookName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-amber-200 font-medium">
              <span>Saving notes to:</span>
              <strong className="text-white">📁 {notebookName}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
