import { useState, useEffect } from 'react';
import { Search, BookOpen, History, Mic, FileText, X, ArrowRight } from 'lucide-react';
import type { NoteItem, NotebookFolder, DictationHistoryItem, ActiveTab } from '../../types/workspace';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteItem[];
  notebooks: NotebookFolder[];
  history: DictationHistoryItem[];
  onSelectTab: (tab: ActiveTab) => void;
  onSelectNote: (note: NoteItem) => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  notes,
  notebooks,
  history,
  onSelectTab,
  onSelectNote,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.polishedText.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNotebooks = notebooks.filter(
    (nb) =>
      nb.name.toLowerCase().includes(query.toLowerCase()) ||
      nb.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredHistory = history.filter(
    (h) =>
      h.title.toLowerCase().includes(query.toLowerCase()) ||
      h.polishedText.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-md select-none">
      <div className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-border/80">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, notebooks, history, or commands..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4">
          {/* Quick Commands */}
          <div>
            <p className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Navigation & Actions
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectTab('dictate');
                  onClose();
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold hover:bg-muted text-foreground text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="size-4 text-emerald-500" />
                  <span>Go to Live Voice Dictate / Studio</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => {
                  onSelectTab('notebooks');
                  onClose();
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold hover:bg-muted text-foreground text-left"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="size-4 text-blue-500" />
                  <span>Go to Notebook Folders</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => {
                  onSelectTab('history');
                  onClose();
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold hover:bg-muted text-foreground text-left"
              >
                <div className="flex items-center gap-2.5">
                  <History className="size-4 text-purple-500" />
                  <span>View Dictation History</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Notes Match */}
          {filteredNotes.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Matching Saved Notes ({filteredNotes.length})
              </p>
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectNote(note);
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs hover:bg-muted text-foreground text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="size-4 text-amber-500 shrink-0" />
                      <span className="font-semibold truncate">{note.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold shrink-0">
                      {note.mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notebook Folders Match */}
          {filteredNotebooks.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Matching Notebook Folders ({filteredNotebooks.length})
              </p>
              <div className="space-y-1">
                {filteredNotebooks.map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => {
                      onSelectTab('notebooks');
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs hover:bg-muted text-foreground text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: nb.color }} />
                      <span className="font-semibold">{nb.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{nb.noteCount} notes</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History Match */}
          {filteredHistory.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Matching Dictation History ({filteredHistory.length})
              </p>
              <div className="space-y-1">
                {filteredHistory.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      onSelectTab('history');
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs hover:bg-muted text-foreground text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <History className="size-4 text-purple-500 shrink-0" />
                      <span className="font-semibold truncate">{h.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{h.audioDuration}s</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
