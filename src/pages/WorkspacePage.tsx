import { useState, useEffect, useCallback } from 'react';
import type {
  ActiveTab,
  ContextMode,
  NotebookFolder,
  NoteItem,
  DictationHistoryItem,
  WorkspaceSettings,
} from '../types/workspace';
import { INITIAL_NOTEBOOKS, INITIAL_NOTES, INITIAL_HISTORY } from '../utils/initialData';
import { formatSpeechByMode } from '../utils/aiFormatters';
import Sidebar from '../components/workspace/Sidebar';
import HeaderBar from '../components/workspace/HeaderBar';
import FloatingControlDock from '../components/workspace/FloatingControlDock';
import LiveEditorView from '../components/workspace/LiveEditorView';
import NotebooksView from '../components/workspace/NotebooksView';
import HistoryView from '../components/workspace/HistoryView';
import SettingsView from '../components/workspace/SettingsView';
import ScreenGlowEffect from '../components/workspace/ScreenGlowEffect';
import CommandPaletteModal from '../components/workspace/CommandPaletteModal';
import NewSessionModal from '../components/workspace/NewSessionModal';
import PermissionModal from '../components/workspace/PermissionModal';
import FaintedCountdownOverlay from '../components/workspace/FaintedCountdownOverlay';
import SavedConfirmationModal from '../components/workspace/SavedConfirmationModal';

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('notebooks');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('Personal Workspace');
  const [activeMode, setActiveMode] = useState<ContextMode>('youtube');

  // New Session Modal State
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [selectedNbForSession, setSelectedNbForSession] = useState<string | null>(null);

  // Permission & Countdown Modal States
  const [hasPermission, setHasPermission] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [selectedTargetNbId, setSelectedTargetNbId] = useState<string>('');

  // Confirmation Pop-up State upon stopping
  const [savedConfirmationData, setSavedConfirmationData] = useState<{
    noteTitle: string;
    notebookName: string;
    notebookColor: string;
    duration: number;
    wordCount: number;
  } | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [rawTranscript, setRawTranscript] = useState(
    'Welcome back everyone so today we are going to dive into building an AI voice to text workspace using React and TypeScript.'
  );
  const [polishedText, setPolishedText] = useState('');
  const [noteTitle, setNoteTitle] = useState('YouTube Script: AI Voice Workspace');
  const [fillerCount, setFillerCount] = useState(4);

  // Data Collections State
  const [notebooks, setNotebooks] = useState<NotebookFolder[]>(INITIAL_NOTEBOOKS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [history, setHistory] = useState<DictationHistoryItem[]>(INITIAL_HISTORY);

  // Initialize selected target notebook ID
  useEffect(() => {
    if (notebooks.length > 0 && !selectedTargetNbId) {
      setSelectedTargetNbId(notebooks[0].id);
    }
  }, [notebooks, selectedTargetNbId]);

  // Preferences State
  const [settings, setSettings] = useState<WorkspaceSettings>({
    micDeviceId: 'default',
    spacebarShortcut: true,
    altVShortcut: true,
    defaultMode: 'youtube',
    autoRemoveFillers: true,
    glowEffectEnabled: true,
    glowStyle: 'siri',
    polishingIntensity: 'standard',
  });

  // Search Palette State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Initial formatted text load
  useEffect(() => {
    const formatted = formatSpeechByMode(rawTranscript, activeMode);
    setPolishedText(formatted.polishedText);
    setNoteTitle(formatted.title);
    setFillerCount(formatted.fillerWordsRemoved);
  }, [activeMode, rawTranscript]);

  // Timer Effect (Only ticks while isRecording is true)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Continuous Real-Time Screen Content Note Append Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRawTranscript((prev) => {
          const additions = [
            ' Note: Key formula slide OCR detected on screen.',
            ' [Timestamp]: Instructor explained positional embeddings.',
            ' Summary point: Multi-modal AI sync reduces study time by 80%.',
          ];
          const nextAddition = additions[Math.floor(Math.random() * additions.length)];
          return prev + nextAddition;
        });
      }, 4000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Handle Stop Recording with Siri Edge Glow Transition & Confirmation Pop-up
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsGlowing(true);
    setIsProcessing(true);

    // Dynamic simulated sample transcription based on active mode if raw is short
    let spokenText = rawTranscript;
    if (recordingSeconds > 0) {
      if (activeMode === 'youtube') {
        spokenText = `um basically today we are showing how to build a voice dictation workflow for YouTube content creators so like you just talk and the AI automatically generates hooks video script outline timestamps and B-roll cues without typing manually`;
      } else if (activeMode === 'course') {
        spokenText = `uh in this lecture segment we cover self attention mechanisms scaled dot product attention and positional embeddings for neural sequence models like transformers so students can focus on the video without pausing constantly`;
      } else if (activeMode === 'meeting') {
        spokenText = `so in today product sync we agreed on launching the voice workspace with spacebar shortcuts free tier minutes and Siri style screen glow animation transition action items assigned to Alex and Sarah`;
      } else {
        spokenText = `um like I wanted to quickly note down ideas for our upcoming produkt design sprint and clean up all filler words automatically`;
      }
    }

    setRawTranscript(spokenText);

    // Screen Glow Sweep lasts ~1.2s while polishing
    setTimeout(() => {
      const formatted = formatSpeechByMode(spokenText, activeMode);
      setPolishedText(formatted.polishedText);
      setNoteTitle(formatted.title);
      setFillerCount(formatted.fillerWordsRemoved);
      setIsGlowing(false);
      setIsProcessing(false);

      // Save note to chosen/active notebook
      const newNoteId = `note-${Date.now()}`;
      const targetNb = notebooks.find((nb) => nb.id === selectedTargetNbId) || notebooks[0];
      const targetNbId = targetNb?.id || 'nb-general';

      const newNote: NoteItem = {
        id: newNoteId,
        title: formatted.title,
        notebookId: targetNbId,
        mode: activeMode,
        polishedText: formatted.polishedText,
        rawTranscript: spokenText,
        audioDuration: Math.max(recordingSeconds, 15),
        wordCount: spokenText.split(' ').length,
        fillerWordsCount: formatted.fillerWordsRemoved,
        createdAt: new Date().toISOString(),
        tags: [activeMode, 'voice-note'],
      };

      const newHistoryItem: DictationHistoryItem = {
        id: `hist-${Date.now()}`,
        title: formatted.title,
        mode: activeMode,
        audioDuration: Math.max(recordingSeconds, 15),
        wordCount: spokenText.split(' ').length,
        fillerWordsRemoved: formatted.fillerWordsRemoved,
        rawTranscript: spokenText,
        polishedText: formatted.polishedText,
        createdAt: new Date().toISOString(),
        savedToNotebookId: targetNbId,
      };

      setNotes((prev) => [newNote, ...prev]);
      setHistory((prev) => [newHistoryItem, ...prev]);

      // Update notebook count
      setNotebooks((prev) =>
        prev.map((nb) => (nb.id === targetNbId ? { ...nb, noteCount: nb.noteCount + 1 } : nb))
      );

      // Display Confirmation Pop-up
      setSavedConfirmationData({
        noteTitle: formatted.title,
        notebookName: targetNb?.name || 'General Workspace',
        notebookColor: targetNb?.color || '#3b82f6',
        duration: Math.max(recordingSeconds, 15),
        wordCount: spokenText.split(' ').length,
      });
    }, 1200);
  }, [recordingSeconds, activeMode, rawTranscript, notebooks, selectedTargetNbId]);

  const startCountdownAndRecording = useCallback(() => {
    setIsCountdownActive(true);
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setIsCountdownActive(false);
    setIsRecording(true);
    setRecordingSeconds(0);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      if (!hasPermission) {
        setIsPermissionModalOpen(true);
      } else {
        startCountdownAndRecording();
      }
    }
  }, [isRecording, stopRecording, hasPermission, startCountdownAndRecording]);

  // Keyboard Shortcuts Listener (Spacebar, Alt+V, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Don't trigger spacebar shortcut when typing in input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // Spacebar or Alt+V for recording toggle
      if (settings.spacebarShortcut && e.code === 'Space') {
        e.preventDefault();
        toggleRecording();
      } else if (settings.altVShortcut && e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, toggleRecording]);

  // Mode Selection
  const handleSelectMode = (mode: ContextMode) => {
    setActiveMode(mode);
    if (rawTranscript) {
      const formatted = formatSpeechByMode(rawTranscript, mode);
      setPolishedText(formatted.polishedText);
      setNoteTitle(formatted.title);
      setFillerCount(formatted.fillerWordsRemoved);
    }
  };

  // Export File Generator
  const handleExport = (format: 'markdown' | 'text' | 'print') => {
    const filename = `${noteTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${
      format === 'markdown' ? 'md' : 'txt'
    }`;

    if (format === 'print') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${noteTitle}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; color: #222; }
                h1 { border-bottom: 2px solid #333; padding-bottom: 8px; }
                pre { background: #f4f4f4; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; }
              </style>
            </head>
            <body>
              <h1>${noteTitle}</h1>
              <p><em>Exported from NoteAI Voice Workspace (${new Date().toLocaleDateString()})</em></p>
              <pre>${polishedText}</pre>
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }

    const blob = new Blob([polishedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save active note to chosen notebook
  const handleSaveToNotebook = (notebookId: string) => {
    setSelectedTargetNbId(notebookId);
    const existing = notes.find((n) => n.title === noteTitle);
    if (existing) {
      setNotes((prev) =>
        prev.map((n) => (n.id === existing.id ? { ...n, notebookId } : n))
      );
    } else {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitle,
        notebookId,
        mode: activeMode,
        polishedText,
        rawTranscript,
        audioDuration: recordingSeconds || 45,
        wordCount: polishedText.split(' ').length,
        fillerWordsCount: fillerCount,
        createdAt: new Date().toISOString(),
        tags: [activeMode],
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const currentNotebook = notebooks.find((n) => n.id === selectedTargetNbId) || notebooks[0];

  return (
    <div className="flex h-svh w-screen bg-background text-foreground overflow-hidden relative">
      {/* Siri / Circle-to-Search Viewport Screen Glow Sweep Animation */}
      <ScreenGlowEffect isGlowing={isGlowing && settings.glowEffectEnabled} glowStyle={settings.glowStyle} />

      {/* Screen Access Permission Modal */}
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        notebooks={notebooks}
        selectedNotebookId={selectedTargetNbId}
        onSelectNotebook={setSelectedTargetNbId}
        onGrantPermission={() => {
          setHasPermission(true);
          setIsPermissionModalOpen(false);
          startCountdownAndRecording();
        }}
      />

      {/* 3-Second Fainted Screen Countdown Overlay */}
      <FaintedCountdownOverlay
        isOpen={isCountdownActive}
        onCountdownComplete={handleCountdownComplete}
        title={`Capturing Screen Content (${activeMode.toUpperCase()})`}
        notebookName={currentNotebook?.name}
      />

      {/* Saved Confirmation Pop-up Modal upon stopping recording */}
      <SavedConfirmationModal
        isOpen={!!savedConfirmationData}
        onClose={() => setSavedConfirmationData(null)}
        noteTitle={savedConfirmationData?.noteTitle || ''}
        notebookName={savedConfirmationData?.notebookName || ''}
        notebookColor={savedConfirmationData?.notebookColor}
        durationSeconds={savedConfirmationData?.duration}
        wordCount={savedConfirmationData?.wordCount}
        onViewNotes={() => {
          setSavedConfirmationData(null);
          setActiveTab('notebooks');
        }}
      />

      {/* Cmd + K Search Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notes={notes}
        notebooks={notebooks}
        history={history}
        onSelectTab={setActiveTab}
        onSelectNote={(note) => {
          setPolishedText(note.polishedText);
          setRawTranscript(note.rawTranscript);
          setNoteTitle(note.title);
          setActiveMode(note.mode);
          setActiveTab('dictate');
        }}
      />

      {/* Left Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={setCurrentWorkspace}
        notebooksCount={notebooks.length}
        historyCount={history.length}
      />

      {/* Right Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <HeaderBar
          currentWorkspace={currentWorkspace}
          activeMode={activeMode}
          isRecording={isRecording}
          isProcessing={isProcessing}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNewSession={() => {
            setSelectedNbForSession(null);
            setIsNewSessionOpen(true);
          }}
          onExport={handleExport}
        />

        {/* Tab Views */}
        <main className="flex-1 min-h-0 p-4 lg:p-6 overflow-hidden">
          {activeTab === 'dictate' && (
            <div className="flex flex-col h-full space-y-6 max-w-5xl mx-auto">
              {/* Floating / Central Control Dock */}
              <FloatingControlDock
                isRecording={isRecording}
                isProcessing={isProcessing}
                recordingSeconds={recordingSeconds}
                activeMode={activeMode}
                onSelectMode={handleSelectMode}
                onToggleRecording={toggleRecording}
                spacebarShortcut={settings.spacebarShortcut}
                altVShortcut={settings.altVShortcut}
              />

              {/* Live Transcription & AI Output Editor */}
              <div className="flex-1 min-h-0">
                <LiveEditorView
                  polishedText={polishedText}
                  rawTranscript={rawTranscript}
                  title={noteTitle}
                  onChangePolishedText={setPolishedText}
                  onChangeTitle={setNoteTitle}
                  notebooks={notebooks}
                  onSaveToNotebook={handleSaveToNotebook}
                  fillerWordsRemoved={fillerCount}
                />
              </div>
            </div>
          )}

          {activeTab === 'notebooks' && (
            <NotebooksView
              notebooks={notebooks}
              notes={notes}
              onOpenNewSession={(nbId) => {
                setSelectedNbForSession(nbId || null);
                setIsNewSessionOpen(true);
              }}
              onCreateNotebook={(name, description, color) => {
                const newNb: NotebookFolder = {
                  id: `nb-${Date.now()}`,
                  name,
                  description,
                  color,
                  icon: 'Folder',
                  noteCount: 0,
                  createdAt: new Date().toISOString(),
                };
                setNotebooks((prev) => [...prev, newNb]);
              }}
              onDeleteNotebook={(nbId) => {
                setNotebooks((prev) => prev.filter((nb) => nb.id !== nbId));
              }}
              onDeleteNote={(noteId) => {
                setNotes((prev) => prev.filter((n) => n.id !== noteId));
              }}
              onUpdateNote={(updatedNote) => {
                setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
              }}
              onExportNote={(note, format) => {
                setPolishedText(note.polishedText);
                setNoteTitle(note.title);
                handleExport(format);
              }}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              history={history}
              onDeleteHistory={(id) => {
                setHistory((prev) => prev.filter((h) => h.id !== id));
              }}
              onReprocessMode={(item, newMode) => {
                const formatted = formatSpeechByMode(item.rawTranscript, newMode);
                setPolishedText(formatted.polishedText);
                setNoteTitle(formatted.title);
                setActiveMode(newMode);
                setActiveTab('dictate');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView settings={settings} onUpdateSettings={setSettings} />
          )}
        </main>
      </div>

      {/* New Recording Session Wizard Modal */}
      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        notebooks={notebooks}
        initialNotebookId={selectedNbForSession}
        onCreateNotebook={(name, description, color) => {
          const newNb: NotebookFolder = {
            id: `nb-${Date.now()}`,
            name,
            description,
            color,
            icon: 'Folder',
            noteCount: 0,
            createdAt: new Date().toISOString(),
          };
          setNotebooks((prev) => [...prev, newNb]);
          return newNb;
        }}
        onSaveNewNote={(newNote) => {
          setNotes((prev) => [newNote, ...prev]);
          setPolishedText(newNote.polishedText);
          setRawTranscript(newNote.rawTranscript);
          setNoteTitle(newNote.title);
          setActiveMode(newNote.mode);
          setActiveTab('notebooks');

          // Increment notebook note count
          setNotebooks((prev) =>
            prev.map((nb) => (nb.id === newNote.notebookId ? { ...nb, noteCount: nb.noteCount + 1 } : nb))
          );
        }}
      />
    </div>
  );
}
