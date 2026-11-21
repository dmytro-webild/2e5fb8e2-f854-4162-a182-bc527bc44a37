import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Youtube, GraduationCap, Briefcase, FileText, Keyboard } from 'lucide-react';
import type { ContextMode } from '../../types/workspace';

interface FloatingControlDockProps {
  isRecording: boolean;
  isProcessing: boolean;
  recordingSeconds: number;
  activeMode: ContextMode;
  onSelectMode: (mode: ContextMode) => void;
  onToggleRecording: () => void;
  spacebarShortcut?: boolean;
  altVShortcut?: boolean;
}

const MODES: { id: ContextMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  {
    id: 'youtube',
    label: 'YouTube Mode',
    icon: Youtube,
    desc: 'Scripts, timestamps, hooks & B-roll cues',
  },
  {
    id: 'course',
    label: 'Course Material',
    icon: GraduationCap,
    desc: 'Academic notes, summaries & flashcards',
  },
  {
    id: 'meeting',
    label: 'Meeting Executive',
    icon: Briefcase,
    desc: 'Executive summary & action items checklist',
  },
  {
    id: 'general',
    label: 'General / Freeform',
    icon: FileText,
    desc: 'Clean prose with filler words removed',
  },
];

export default function FloatingControlDock({
  isRecording,
  isProcessing,
  recordingSeconds,
  activeMode,
  onSelectMode,
  onToggleRecording,
}: FloatingControlDockProps) {
  // Animated waveform bars heights generator
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 24, 40, 18, 30, 48, 22, 36, 15, 28, 44, 20, 32, 16]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 38) + 8)
        );
      }, 120);
    } else {
      setWaveHeights([12, 18, 24, 16, 20, 22, 18, 24, 14, 20, 26, 16, 22, 14]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto select-none">
      {/* Mode Selector Pills Above Record Dock */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-card/80 border border-border/80 shadow-md backdrop-blur-xl">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isSelected = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              disabled={isRecording}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground opacity-80 hover:opacity-100'
              } ${isRecording ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <Icon className="size-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Floating Control Card */}
      <div className="w-full p-4 rounded-3xl bg-card border border-border/90 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Background glow when recording */}
        {isRecording && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-amber-500/5 to-cyan-500/5 animate-pulse pointer-events-none" />
        )}

        {/* Left: Recording Info & Timer */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleRecording}
            disabled={isProcessing}
            className={`relative flex items-center justify-center size-14 rounded-2xl transition-all duration-300 shadow-lg cursor-pointer ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700 ring-4 ring-red-500/20 scale-105'
                : 'bg-primary text-primary-foreground hover:opacity-90 ring-4 ring-primary/10'
            } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isRecording ? (
              <Square className="size-6 fill-current animate-pulse" />
            ) : (
              <Mic className="size-7" />
            )}

            {/* Ripple ring effect when active */}
            {isRecording && (
              <span className="absolute inset-0 rounded-2xl border-2 border-red-500 animate-ping opacity-40 pointer-events-none" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`size-2.5 rounded-full ${
                  isRecording ? 'bg-red-500 animate-ping' : isProcessing ? 'bg-cyan-500 animate-spin' : 'bg-emerald-500'
                }`}
              />
              <p className="text-sm font-bold text-foreground">
                {isRecording ? 'Listening Live...' : isProcessing ? 'AI Polishing...' : 'Ready to Dictate'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRecording ? (
                <span className="font-mono text-red-600 font-bold text-sm">{formatTime(recordingSeconds)}</span>
              ) : (
                'Press button or Spacebar to start'
              )}
            </p>
          </div>
        </div>

        {/* Center/Right: Audio Waveform Visualizer */}
        <div className="flex items-center gap-1 h-12 px-4 py-2 rounded-2xl bg-muted/60 border border-border/60 w-full sm:w-48 justify-center">
          {waveHeights.map((h, idx) => (
            <motion.div
              key={idx}
              animate={{ height: `${h}px` }}
              transition={{ duration: 0.1 }}
              className={`w-1.5 rounded-full transition-colors ${
                isRecording ? 'bg-red-500' : 'bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>

        {/* Shortcut Hint Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-[11px] font-medium text-muted-foreground border border-border/40">
          <Keyboard className="size-3.5" />
          <span>Space or Alt+V</span>
        </div>
      </div>
    </div>
  );
}
