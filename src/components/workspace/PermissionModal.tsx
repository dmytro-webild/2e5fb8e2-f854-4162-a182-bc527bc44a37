import { useState } from 'react';
import { Monitor, X, Check, ShieldCheck } from 'lucide-react';
import type { NotebookFolder } from '../../types/workspace';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantPermission: () => void;
  notebooks?: NotebookFolder[];
  selectedNotebookId?: string;
  onSelectNotebook?: (id: string) => void;
}

export default function PermissionModal({
  isOpen,
  onClose,
  onGrantPermission,
  notebooks = [],
  selectedNotebookId,
  onSelectNotebook,
}: PermissionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleGrant = async () => {
    setIsProcessing(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).catch(() => {
          // Fallback if browser prompt cancelled
        });
      }
    } catch {
      // Fallback for non-supported environments
    }
    setIsProcessing(false);
    onGrantPermission();
  };

  const activeNb = notebooks.find((n) => n.id === selectedNotebookId) || notebooks[0];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg bg-card border border-border/90 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
              <Monitor className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Screen Access Permission</h2>
              <p className="text-xs text-muted-foreground">Required for real-time AI note generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground">
            <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Allow NoteAI Screen & Audio Streams</p>
              <p className="text-muted-foreground leading-relaxed">
                Grant permission to let NoteAI comprehend on-screen text, YouTube videos, lecture slides, and spoken commentary in real time.
              </p>
            </div>
          </div>

          {/* Target Notebook Selector */}
          {notebooks.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Save Generated Notes To Notebook:</span>
                {activeNb && (
                  <span className="text-[11px] text-muted-foreground">
                    Selected: <strong>{activeNb.name}</strong>
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                {notebooks.map((nb) => {
                  const isSelected = (selectedNotebookId || notebooks[0]?.id) === nb.id;
                  return (
                    <button
                      key={nb.id}
                      type="button"
                      onClick={() => onSelectNotebook && onSelectNotebook(nb.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-primary/15 border-primary font-bold text-foreground ring-1 ring-primary/30'
                          : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: nb.color }} />
                        <span className="truncate">{nb.name}</span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>🔐 Screen data is processed locally in real time.</span>
            <span className="font-mono text-[10px] bg-card px-2 py-0.5 rounded border border-border">Encrypted</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGrant}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            <Monitor className="size-4" />
            <span>{isProcessing ? 'Connecting Stream...' : 'Grant Permission & Start'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
