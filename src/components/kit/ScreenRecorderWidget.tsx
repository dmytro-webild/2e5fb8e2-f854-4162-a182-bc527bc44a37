import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Circle,
  Square,
  Pause,
  Play,
  Mic,
  FileText,
  Printer,
  Sparkles,
  Monitor,
  CheckCircle2,
  RefreshCw,
  Layers,
  Radio
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type CaptureMode = "all" | "audio" | "visuals";
type SourceType = "coursera" | "zoom" | "youtube";

interface NoteEntry {
  id: string;
  time: string;
  type: "audio" | "visual" | "ppt" | "summary";
  title: string;
  detail: string;
}

const SAMPLE_NOTES: NoteEntry[] = [
  {
    id: "n1",
    time: "00:04",
    type: "summary",
    title: "Session Topic Overview",
    detail: "Multi-Modal Information Comprehension: Real-time processing of synchronized video, spoken audio, and presentation slides."
  },
  {
    id: "n2",
    time: "00:15",
    type: "audio",
    title: "Audio Extraction: Lecturer Speech",
    detail: "“Instead of manually writing down formulas, the AI extracts key equations directly from audio frequency and video frame alignment.”"
  },
  {
    id: "n3",
    time: "00:32",
    type: "visual",
    title: "Visual OCR Capture: Slide #3",
    detail: "Diagram detected: Transformer Multi-Head Attention Architecture. Key parameters logged and indexed."
  },
  {
    id: "n4",
    time: "00:48",
    type: "ppt",
    title: "Key Formula & Concept",
    detail: "Attention(Q, K, V) = softmax(Q Kᵀ / √dₖ) V — Matrix multiplication applied across query/key pairs."
  },
  {
    id: "n5",
    time: "01:05",
    type: "summary",
    title: "Automated Summary Point",
    detail: "Zero manual intervention required. Notes format continuously into structured study units for printing."
  }
];

export default function ScreenRecorderWidget({ className }: { className?: string }) {
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(72);
  const [captureMode, setCaptureMode] = useState<CaptureMode>("all");
  const [sourceType, setSourceType] = useState<SourceType>("coursera");
  const [visibleNotes, setVisibleNotes] = useState<NoteEntry[]>(SAMPLE_NOTES.slice(0, 3));
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      const timer = setTimeout(() => {
        if (visibleNotes.length < SAMPLE_NOTES.length) {
          setVisibleNotes(SAMPLE_NOTES.slice(0, visibleNotes.length + 1));
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isRecording, isPaused, visibleNotes.length]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsPaused(false);
    } else {
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      setVisibleNotes(SAMPLE_NOTES.slice(0, 2));
      setSavedSuccess(false);
    }
  };

  const togglePause = () => {
    if (isRecording) {
      setIsPaused((prev) => !prev);
    }
  };

  const handleSaveOrPrint = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, "0") + ":" : ""}${String(displayMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className={cn("w-full rounded-[var(--radius-card)] bg-card border border-border shadow-xl overflow-hidden text-foreground", className)}>
      {/* SCREEN RECORDING TOOLBAR HEADER */}
      <div className="bg-[#1e1d1a] text-white p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800">
        
        {/* Left: Status & REC indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 rounded-full border border-neutral-700/60">
            {isRecording ? (
              <>
                <span className="relative flex size-3">
                  <span className={cn("absolute inline-flex size-full rounded-full bg-red-500 opacity-75", !isPaused && "animate-ping")} />
                  <span className="relative inline-flex size-3 rounded-full bg-red-600" />
                </span>
                <span className="text-xs font-semibold tracking-wider text-red-400 uppercase">
                  {isPaused ? "PAUSED" : "REC"}
                </span>
                <span className="text-neutral-500 font-mono text-xs">|</span>
                <span className="font-mono text-xs text-neutral-200 font-medium">
                  {formatTime(seconds)}
                </span>
              </>
            ) : (
              <>
                <span className="size-2.5 rounded-full bg-neutral-500" />
                <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                  STANDBY
                </span>
              </>
            )}
          </div>

          {/* Target Source Dropdown pills */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-900/70 p-1 rounded-lg border border-neutral-800">
            <span className="text-[11px] text-neutral-400 px-2 font-medium flex items-center gap-1">
              <Monitor className="size-3" /> Source:
            </span>
            {(
              [
                { id: "coursera", label: "Coursera / Web" },
                { id: "zoom", label: "Zoom Meeting" },
                { id: "youtube", label: "Playlist" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setSourceType(s.id)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md transition-all font-medium cursor-pointer",
                  sourceType === s.id
                    ? "bg-neutral-800 text-amber-300 shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Primary Action: START / STOP SCREEN RECORDING BUTTON */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop Note Recording" : "Start Note Recording"}
            className={cn(
              "relative group inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-md active:scale-95 cursor-pointer",
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/40 border border-red-500 ring-2 ring-red-500/20"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 border border-emerald-400 ring-2 ring-emerald-500/20"
            )}
          >
            {isRecording ? (
              <>
                <Square className="size-4 fill-current text-white animate-pulse" />
                <span>STOP RECORDING</span>
              </>
            ) : (
              <>
                <Circle className="size-4 fill-red-500 text-red-500 animate-pulse" />
                <span>START RECORDING</span>
              </>
            )}
          </button>

          {isRecording && (
            <button
              onClick={togglePause}
              aria-label={isPaused ? "Resume Recording" : "Pause Recording"}
              className="p-2 sm:p-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700 cursor-pointer"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play className="size-4 fill-current" /> : <Pause className="size-4 fill-current" />}
            </button>
          )}
        </div>

        {/* Right: Multi-Modal Modality Options */}
        <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
          {(
            [
              { id: "all", label: "Video + Audio", icon: Layers },
              { id: "audio", label: "Audio Only", icon: Mic },
              { id: "visuals", label: "Slides Only", icon: FileText },
            ] as const
          ).map((m) => {
            const IconComp = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setCaptureMode(m.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-all font-medium cursor-pointer",
                  captureMode === m.id
                    ? "bg-amber-400 text-neutral-900 font-semibold shadow"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <IconComp className="size-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT SPLIT GRID: VIDEO FEED PREVIEW + LIVE NOTEBOOK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] bg-background">
        
        {/* Left Column: Lecture Video Feed & Screen Recording Viewfinder */}
        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-5 flex flex-col justify-between bg-muted/40 relative isolate overflow-hidden">
          
          {/* Viewfinder Header info */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-card text-foreground border border-border text-xs font-mono font-medium">
                <Radio className="size-3 text-red-500 animate-pulse" />
                {sourceType === "coursera" ? "Coursera Lecture #4" : sourceType === "zoom" ? "Live Zoom Seminar" : "Playlist Stream"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">1080p • 60 FPS</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-card/80 px-2 py-0.5 rounded border border-border">
              <span>MODALITY:</span>
              <span className="font-semibold text-foreground uppercase">{captureMode}</span>
            </div>
          </div>

          {/* Screen Recording Preview Box */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-inner bg-neutral-900 group">
            <img
              src="https://img.b2bpic.net/free-photo/digital-dashboard_23-2151957114.jpg"
              alt="Lecture screen stream view"
              className={cn(
                "size-full object-cover transition-opacity duration-500",
                isRecording ? "opacity-90" : "opacity-40 grayscale"
              )}
            />

            <div className="absolute inset-0 border-2 border-dashed border-amber-400/30 pointer-events-none rounded-xl m-2" />
            
            <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

            {isRecording && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/80 text-white text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-amber-400 animate-spin" />
                  <span className="font-mono text-[11px]">AI Real-Time OCR & Speech Engine Active</span>
                </div>
                <span className="font-mono text-[11px] text-amber-300 font-semibold">99.4% Accuracy</span>
              </div>
            )}

            {!isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-6 text-center">
                <Circle className="size-12 text-red-500 mb-2 opacity-80" />
                <p className="font-heading text-lg font-semibold">Screen Recording Standby</p>
                <p className="text-xs text-neutral-300 mt-1 max-w-xs">
                  Click the red <span className="text-red-400 font-semibold">START RECORDING</span> button to capture lectures & slides in real time.
                </p>
              </div>
            )}

            {isRecording && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md px-3 py-2 rounded-lg border border-neutral-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white text-xs">
                  <Mic className="size-3.5 text-amber-400" />
                  <span className="font-mono text-[11px]">Audio Stream</span>
                </div>
                
                <div className="flex items-end gap-1 h-4">
                  {[40, 80, 50, 95, 60, 100, 75, 45, 85, 30, 90, 65, 40, 80].map((h, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1 bg-amber-400 rounded-full"
                      animate={{
                        height: isPaused ? "20%" : [`${Math.max(15, h - 30)}%`, `${h}%`, `${Math.max(10, h - 40)}%`]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + (idx % 4) * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-600" /> Multi-Stream Comprehension: Video + Audio + Slides
            </span>
            <span className="font-mono text-[11px]">Auto-saves to Notebook</span>
          </div>
        </div>

        {/* Right Column: Real-Time Generated Built-In Notebook Stream */}
        <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col justify-between bg-card">
          
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-foreground">
                  <FileText className="size-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground leading-tight">
                    Built-In Notebook
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {isRecording ? "Live generated notes feed..." : "Captured session complete"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveOrPrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Printer className="size-3.5" />
                      <span>Print PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1 text-left scrollbar-thin">
              <AnimatePresence initial={false}>
                {visibleNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-xl bg-muted/60 border border-border/80 text-xs hover:border-amber-400/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-semibold text-muted-foreground bg-card px-2 py-0.5 rounded border border-border">
                        {note.time}
                      </span>
                      <span className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider",
                        note.type === "summary" && "bg-amber-100 text-amber-900 font-semibold",
                        note.type === "audio" && "bg-blue-100 text-blue-900 font-semibold",
                        note.type === "visual" && "bg-emerald-100 text-emerald-900 font-semibold",
                        note.type === "ppt" && "bg-purple-100 text-purple-900 font-semibold"
                      )}>
                        {note.type}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground text-xs mb-1">
                      {note.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-[11.5px]">
                      {note.detail}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isRecording && !isPaused && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-900 text-xs animate-pulse">
                  <RefreshCw className="size-3.5 animate-spin text-amber-700" />
                  <span className="text-[11.5px] font-medium">Comprehending lecture stream in real time...</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                <strong className="text-foreground font-semibold">{visibleNotes.length}</strong> points logged
              </span>
              <span>•</span>
              <span>
                <strong className="text-foreground font-semibold">340</strong> words
              </span>
            </div>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-medium">
              Ready to print & study
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
