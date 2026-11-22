import { CheckCircle2, Folder, X, ArrowRight, Sparkles, Clock, FileText } from 'lucide-react';

interface SavedConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteTitle: string;
  notebookName: string;
  notebookColor?: string;
  durationSeconds?: number;
  wordCount?: number;
  onViewNotes?: () => void;
}

export default function SavedConfirmationModal({
  isOpen,
  onClose,
  noteTitle,
  notebookName,
  notebookColor = '#10b981',
  durationSeconds = 15,
  wordCount = 120,
  onViewNotes,
}: SavedConfirmationModalProps) {
  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-card border border-border/90 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Top Decorative Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Notes Saved Successfully!</h2>
              <p className="text-xs text-muted-foreground">Screen capture & note generation complete</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body Card */}
        <div className="px-6 py-4 space-y-4">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
            {/* Note Title */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Saved Note Title</span>
              <p className="text-sm font-bold text-foreground mt-0.5 line-clamp-2">{noteTitle}</p>
            </div>

            {/* Saved Notebook Badge */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Saved To Notebook:</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-card border border-border shadow-sm font-bold text-foreground">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: notebookColor }} />
                <Folder className="size-3.5 text-muted-foreground" />
                <span>{notebookName}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-card/60 border border-border/50 text-muted-foreground">
                <Clock className="size-3.5 text-amber-500" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Recording Time</p>
                  <p className="font-bold text-foreground">{formatDuration(durationSeconds)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-card/60 border border-border/50 text-muted-foreground">
                <FileText className="size-3.5 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Words Generated</p>
                  <p className="font-bold text-foreground">{wordCount} words</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Sparkles className="size-4 shrink-0" />
            <span>AI formatted & indexed into study notes automatically.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Done
          </button>

          {onViewNotes && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewNotes();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <span>View Saved Notebook</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
