import { useState } from 'react';
import {
  Copy,
  Check,
  FolderPlus,
  Sparkles,
  Zap,
  Building2,
  Maximize2,
  HelpCircle,
  CheckSquare,
  FileText,
  ChevronDown,
} from 'lucide-react';
import type { NotebookFolder } from '../../types/workspace';
import { adjustTone } from '../../utils/aiFormatters';

interface LiveEditorViewProps {
  polishedText: string;
  rawTranscript: string;
  title: string;
  onChangePolishedText: (text: string) => void;
  onChangeTitle: (title: string) => void;
  notebooks: NotebookFolder[];
  onSaveToNotebook: (notebookId: string) => void;
  fillerWordsRemoved: number;
}

export default function LiveEditorView({
  polishedText,
  rawTranscript,
  title,
  onChangePolishedText,
  onChangeTitle,
  notebooks,
  onSaveToNotebook,
  fillerWordsRemoved,
}: LiveEditorViewProps) {
  const [activeTab, setActiveTab] = useState<'polished' | 'raw'>('polished');
  const [copied, setCopied] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleCopy = () => {
    const textToCopy = activeTab === 'polished' ? polishedText : rawTranscript;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleToneAdjust = (tone: 'concise' | 'formal' | 'expand' | 'simplify' | 'checklist') => {
    const adjusted = adjustTone(polishedText, tone);
    onChangePolishedText(adjusted);
  };

  const handleSelectNotebook = (nbId: string) => {
    onSaveToNotebook(nbId);
    const nbName = notebooks.find((n) => n.id === nbId)?.name || 'Notebook';
    setSaveSuccess(nbName);
    setIsSaveOpen(false);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-card/60 rounded-3xl border border-border/80 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Top Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-border/70 bg-card/80">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted border border-border/60">
          <button
            onClick={() => setActiveTab('polished')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'polished'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Polished AI Output</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'raw'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="size-3.5 text-sky-500" />
            <span>Raw Verbatim Transcript</span>
            {fillerWordsRemoved > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 text-[10px] font-bold">
                -{fillerWordsRemoved} fillers
              </span>
            )}
          </button>
        </div>

        {/* Right Actions: Copy & Save */}
        <div className="flex items-center gap-2.5">
          {/* Save to Notebook Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSaveOpen(!isSaveOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs font-semibold text-foreground transition-all shadow-sm"
            >
              <FolderPlus className="size-4 text-emerald-600" />
              <span>Save to Notebook</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>

            {saveSuccess && (
              <div className="absolute right-0 top-full mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium shadow-lg flex items-center gap-1.5 z-50">
                <Check className="size-3.5" />
                <span>Saved to {saveSuccess}!</span>
              </div>
            )}

            {isSaveOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 p-1.5 bg-card border border-border shadow-2xl rounded-2xl z-50 space-y-1">
                <p className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Select Target Notebook
                </p>
                {notebooks.map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => handleSelectNotebook(nb.id)}
                    className="flex items-center justify-between w-full px-2.5 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: nb.color }} />
                      <span className="truncate">{nb.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{nb.noteCount} notes</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Floating Copy Button with Toast */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {copied ? (
              <>
                <Check className="size-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="size-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tone Adjuster Pills Bar (Only shown on Polished AI Output tab) */}
      {activeTab === 'polished' && (
        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-border/60 bg-muted/40">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Tone Adjusters:
          </span>
          <button
            onClick={() => handleToneAdjust('concise')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border hover:border-amber-500 text-xs font-medium text-foreground transition-all shadow-xs"
          >
            <Zap className="size-3 text-amber-500" />
            <span>Make Concise</span>
          </button>
          <button
            onClick={() => handleToneAdjust('formal')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border hover:border-purple-500 text-xs font-medium text-foreground transition-all shadow-xs"
          >
            <Building2 className="size-3 text-purple-500" />
            <span>Make Formal</span>
          </button>
          <button
            onClick={() => handleToneAdjust('expand')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border hover:border-blue-500 text-xs font-medium text-foreground transition-all shadow-xs"
          >
            <Maximize2 className="size-3 text-blue-500" />
            <span>Expand & Detail</span>
          </button>
          <button
            onClick={() => handleToneAdjust('simplify')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border hover:border-emerald-500 text-xs font-medium text-foreground transition-all shadow-xs"
          >
            <HelpCircle className="size-3 text-emerald-500" />
            <span>Simplify</span>
          </button>
          <button
            onClick={() => handleToneAdjust('checklist')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border hover:border-sky-500 text-xs font-medium text-foreground transition-all shadow-xs"
          >
            <CheckSquare className="size-3 text-sky-500" />
            <span>Add Action Checklist</span>
          </button>
        </div>
      )}

      {/* Title Bar Input */}
      <div className="px-5 py-3 border-b border-border/40">
        <input
          type="text"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="Note Title..."
          className="w-full bg-transparent text-lg font-bold text-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeTab === 'polished' ? (
          <textarea
            value={polishedText}
            onChange={(e) => onChangePolishedText(e.target.value)}
            placeholder="AI polished output will appear here after recording..."
            className="w-full h-full min-h-[320px] bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none resize-none font-mono"
          />
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Verbatim Speech-to-Text Stream
                </p>
                <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {fillerWordsRemoved} Filler Words Detected
                </span>
              </div>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                {rawTranscript || 'Raw speech transcript will be logged here line by line as you speak...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
