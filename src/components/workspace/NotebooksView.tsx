import { useState } from 'react';
import {
  Folder,
  Plus,
  Trash2,
  Edit2,
  Search,
  Clock,
  Download,
  BookOpen,
} from 'lucide-react';
import type { NotebookFolder, NoteItem, ContextMode } from '../../types/workspace';

interface NotebooksViewProps {
  notebooks: NotebookFolder[];
  notes: NoteItem[];
  onCreateNotebook: (name: string, description: string, color: string) => void;
  onDeleteNotebook: (notebookId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (note: NoteItem) => void;
  onExportNote: (note: NoteItem, format: 'markdown' | 'text' | 'print') => void;
}

const PRESET_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

export default function NotebooksView({
  notebooks,
  notes,
  onCreateNotebook,
  onDeleteNotebook,
  onDeleteNote,
  onUpdateNote,
  onExportNote,
}: NotebooksViewProps) {
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<ContextMode | 'all'>('all');
  const [activeEditingNote, setActiveEditingNote] = useState<NoteItem | null>(null);

  // New Notebook Modal State
  const [isCreatingNb, setIsCreatingNb] = useState(false);
  const [newNbName, setNewNbName] = useState('');
  const [newNbDesc, setNewNbDesc] = useState('');
  const [newNbColor, setNewNbColor] = useState(PRESET_COLORS[0]);

  const filteredNotes = notes.filter((n) => {
    const matchesNotebook = !selectedNotebookId || n.notebookId === selectedNotebookId;
    const matchesMode = selectedModeFilter === 'all' || n.mode === selectedModeFilter;
    const matchesQuery =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.polishedText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNotebook && matchesMode && matchesQuery;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNbName.trim()) return;
    onCreateNotebook(newNbName.trim(), newNbDesc.trim(), newNbColor);
    setNewNbName('');
    setNewNbDesc('');
    setIsCreatingNb(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 select-none overflow-y-auto">
      {/* Left Column: Folders / Notebook List */}
      <div className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Notebook Folders</h2>
          </div>
          <button
            onClick={() => setIsCreatingNb(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="size-3.5" />
            <span>New Folder</span>
          </button>
        </div>

        {/* Folder Cards Grid */}
        <div className="space-y-2">
          {/* All Notes Button */}
          <button
            onClick={() => setSelectedNotebookId(null)}
            className={`flex items-center justify-between w-full p-3 rounded-2xl border text-xs font-semibold transition-all ${
              selectedNotebookId === null
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card/80 text-foreground border-border/80 hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Folder className="size-4 text-amber-500" />
              <span>All Saved Notes</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-muted/40 text-[10px]">
              {notes.length}
            </span>
          </button>

          {notebooks.map((nb) => {
            const count = notes.filter((n) => n.notebookId === nb.id).length;
            const isSelected = selectedNotebookId === nb.id;
            return (
              <div
                key={nb.id}
                className={`group relative flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/20 shadow-md'
                    : 'bg-card/60 border-border/70 hover:border-border hover:bg-card'
                }`}
              >
                <button
                  onClick={() => setSelectedNotebookId(nb.id)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                  <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: nb.color }} />
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{nb.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{nb.description}</p>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground font-mono">
                    {count}
                  </span>
                  {notebooks.length > 1 && (
                    <button
                      onClick={() => onDeleteNotebook(nb.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 transition-opacity"
                      title="Delete Folder"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Notes List & Interactive Viewer/Editor */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Search & Mode Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card/60 border border-border/80">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/60 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'youtube', 'course', 'meeting', 'general'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModeFilter(m)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedModeFilter === m
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const nbName = notebooks.find((nb) => nb.id === note.notebookId)?.name || 'General';
            return (
              <div
                key={note.id}
                className="p-5 rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {note.mode}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{note.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5 font-mono leading-relaxed">
                    {note.polishedText}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground font-medium truncate max-w-[120px]">📁 {nbName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveEditingNote(note)}
                      className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="size-3" />
                      <span>View & Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-3xl bg-card/40 border border-dashed border-border/80 space-y-2">
              <BookOpen className="size-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-bold text-foreground">No notes found</p>
              <p className="text-xs text-muted-foreground">Try dictating a new note or changing your search filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {isCreatingNb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-sm p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-foreground">Create New Notebook Folder</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Folder Name</label>
              <input
                type="text"
                value={newNbName}
                onChange={(e) => setNewNbName(e.target.value)}
                placeholder="e.g. YouTube Ideas, CS101"
                required
                className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <input
                type="text"
                value={newNbDesc}
                onChange={(e) => setNewNbDesc(e.target.value)}
                placeholder="Short description..."
                className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Folder Color</label>
              <div className="flex items-center gap-2 mt-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setNewNbColor(c)}
                    className={`size-6 rounded-full transition-transform ${newNbColor === c ? 'scale-125 ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNb(false)}
                className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Note View & Edit Modal */}
      {activeEditingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] p-6 bg-card border border-border rounded-3xl shadow-2xl flex flex-col justify-between space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <input
                type="text"
                value={activeEditingNote.title}
                onChange={(e) => setActiveEditingNote({ ...activeEditingNote, title: e.target.value })}
                className="text-base font-bold text-foreground bg-transparent outline-none w-full"
              />
              <button
                onClick={() => {
                  onUpdateNote(activeEditingNote);
                  setActiveEditingNote(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shrink-0"
              >
                Save & Close
              </button>
            </div>

            <textarea
              value={activeEditingNote.polishedText}
              onChange={(e) => setActiveEditingNote({ ...activeEditingNote, polishedText: e.target.value })}
              className="w-full h-80 p-4 rounded-2xl bg-muted/40 border border-border/60 font-mono text-xs leading-relaxed text-foreground outline-none resize-none"
            />

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onExportNote(activeEditingNote, 'markdown')}
                  className="px-3 py-1.5 rounded-xl bg-muted text-xs font-medium hover:bg-muted/80 text-foreground flex items-center gap-1.5"
                >
                  <Download className="size-3.5 text-sky-500" />
                  <span>Export Markdown</span>
                </button>
                <button
                  onClick={() => onExportNote(activeEditingNote, 'print')}
                  className="px-3 py-1.5 rounded-xl bg-muted text-xs font-medium hover:bg-muted/80 text-foreground flex items-center gap-1.5"
                >
                  <Download className="size-3.5 text-purple-500" />
                  <span>Print View</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onDeleteNote(activeEditingNote.id);
                  setActiveEditingNote(null);
                }}
                className="text-xs text-red-500 font-medium hover:underline"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
