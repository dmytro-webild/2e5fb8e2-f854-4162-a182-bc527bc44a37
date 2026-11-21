import { useState } from 'react';
import { History, Search, Trash2, RefreshCw, Sparkles, FileText } from 'lucide-react';
import type { DictationHistoryItem, ContextMode } from '../../types/workspace';

interface HistoryViewProps {
  history: DictationHistoryItem[];
  onDeleteHistory: (id: string) => void;
  onReprocessMode: (item: DictationHistoryItem, newMode: ContextMode) => void;
}

export default function HistoryView({ history, onDeleteHistory, onReprocessMode }: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<DictationHistoryItem | null>(null);

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.polishedText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 select-none overflow-y-auto">
      {/* Left List: Dictation Timeline */}
      <div className="w-full lg:w-96 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Dictation History</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-mono text-muted-foreground">
            {history.length} sessions
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-2.5">
          {filteredHistory.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/20 shadow-md'
                    : 'bg-card/60 border-border/70 hover:bg-card hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {item.mode}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-foreground truncate">{item.title}</h3>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span>⏱️ {item.audioDuration}s</span>
                  <span>📝 {item.wordCount} words</span>
                  <span className="text-amber-600 font-semibold">-{item.fillerWordsRemoved} fillers</span>
                </div>
              </div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-card/40 border border-dashed border-border/80 text-muted-foreground text-xs">
              No dictation history items found.
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 min-w-0">
        {selectedItem ? (
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xl space-y-6">
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                  {selectedItem.mode} Mode
                </span>
                <h2 className="text-lg font-bold text-foreground mt-1">{selectedItem.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recorded on {new Date(selectedItem.createdAt).toLocaleString()} • Duration: {selectedItem.audioDuration}s • Word Count: {selectedItem.wordCount}
                </p>
              </div>

              <button
                onClick={() => {
                  onDeleteHistory(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete Session"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {/* Re-process with different mode */}
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/60 space-y-2">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <RefreshCw className="size-3.5 text-primary" />
                <span>Re-process Transcript with AI Mode:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {(['youtube', 'course', 'meeting', 'general'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      onReprocessMode(selectedItem, m);
                      setSelectedItem({ ...selectedItem, mode: m });
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                      selectedItem.mode === m
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Polished Output vs Raw Transcript */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Polished AI Output</span>
                </h4>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedItem.polishedText}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="size-3.5 text-sky-500" />
                  <span>Verbatim Raw Transcript</span>
                </h4>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {selectedItem.rawTranscript}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-card/40 border border-dashed border-border/80 space-y-2 text-muted-foreground">
            <History className="size-10 opacity-60" />
            <p className="text-sm font-bold text-foreground">Select a session from history</p>
            <p className="text-xs">Click any item on the left to view raw speech vs polished output and re-process with AI.</p>
          </div>
        )}
      </div>
    </div>
  );
}
