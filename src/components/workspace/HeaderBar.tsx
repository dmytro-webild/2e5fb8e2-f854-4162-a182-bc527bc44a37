import { useState } from 'react';
import { Search, Download, Sparkles, FileText, FileCode, Printer, Check, Radio } from 'lucide-react';
import type { ContextMode } from '../../types/workspace';

interface HeaderBarProps {
  currentWorkspace: string;
  activeMode: ContextMode;
  isRecording: boolean;
  isProcessing: boolean;
  onOpenSearch: () => void;
  onExport: (format: 'markdown' | 'text' | 'print') => void;
}

const MODE_LABELS: Record<ContextMode, { label: string; icon: string }> = {
  youtube: { label: 'YouTube Script Mode', icon: '🎬' },
  course: { label: 'Course Material Mode', icon: '📚' },
  meeting: { label: 'Meeting Executive Mode', icon: '💼' },
  general: { label: 'General Voice Mode', icon: '✍️' },
};

export default function HeaderBar({
  currentWorkspace,
  activeMode,
  isRecording,
  isProcessing,
  onOpenSearch,
  onExport,
}: HeaderBarProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const handleExportClick = (format: 'markdown' | 'text' | 'print') => {
    onExport(format);
    setExportedFormat(format);
    setIsExportOpen(false);
    setTimeout(() => setExportedFormat(null), 2500);
  };

  return (
    <header className="h-16 border-b border-border/80 bg-card/40 backdrop-blur-md px-4 flex items-center justify-between gap-4 select-none">
      {/* Active Context Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/80 text-xs font-medium text-foreground shadow-sm">
          <span className="text-muted-foreground">{currentWorkspace}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1.5 font-semibold">
            <span>{MODE_LABELS[activeMode].icon}</span>
            <span>{MODE_LABELS[activeMode].label}</span>
          </span>
        </div>

        {/* Live Status Pill */}
        {isRecording && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-600 animate-pulse">
            <Radio className="size-3.5 animate-spin" />
            <span>Recording Live...</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-600 animate-pulse">
            <Sparkles className="size-3.5" />
            <span>Polishing with AI...</span>
          </div>
        )}
      </div>

      {/* Center Quick Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex items-center justify-between w-64 lg:w-80 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs text-muted-foreground hover:text-foreground transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <Search className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span>Search notes, notebooks, history...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Right Action Menu: Download / Export */}
      <div className="relative">
        <button
          onClick={() => setIsExportOpen(!isExportOpen)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity shadow-sm"
        >
          <Download className="size-3.5" />
          <span>Export Note</span>
        </button>

        {exportedFormat && (
          <div className="absolute right-0 top-full mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium shadow-lg flex items-center gap-1.5 z-50">
            <Check className="size-3.5" />
            <span className="capitalize">Exported as {exportedFormat}!</span>
          </div>
        )}

        {isExportOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 p-1.5 bg-card border border-border shadow-2xl rounded-2xl z-50 space-y-1">
            <p className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Select Export Format
            </p>
            <button
              onClick={() => handleExportClick('markdown')}
              className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground transition-colors text-left"
            >
              <FileCode className="size-4 text-sky-500" />
              <div>
                <p className="font-semibold">Markdown (.md)</p>
                <p className="text-[10px] text-muted-foreground">Clean formatted text for Obsidian & Notion</p>
              </div>
            </button>
            <button
              onClick={() => handleExportClick('text')}
              className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground transition-colors text-left"
            >
              <FileText className="size-4 text-emerald-500" />
              <div>
                <p className="font-semibold">Plain Text (.txt)</p>
                <p className="text-[10px] text-muted-foreground">Raw transcript & cleaned output</p>
              </div>
            </button>
            <button
              onClick={() => handleExportClick('print')}
              className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground transition-colors text-left"
            >
              <Printer className="size-4 text-purple-500" />
              <div>
                <p className="font-semibold">Printable PDF View</p>
                <p className="text-[10px] text-muted-foreground">Formatted study sheet for exam printing</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
