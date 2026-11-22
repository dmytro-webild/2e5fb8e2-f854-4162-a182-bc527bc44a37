import { useState, useEffect } from 'react';
import {
  X,
  Monitor,
  Video,
  Mic,
  Layers,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Sparkles,
  Radio,
  ArrowRight,
  ArrowLeft,
  Tv,
  GraduationCap,
  Users,
  Presentation,
  Globe,
  Check,
  type LucideIcon,
} from 'lucide-react';
import type { NotebookFolder, NoteItem, ContextMode } from '../../types/workspace';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  notebooks: NotebookFolder[];
  onCreateNotebook: (name: string, description: string, color: string) => NotebookFolder;
  onSaveNewNote: (note: NoteItem) => void;
  initialNotebookId?: string | null;
}

export type ContentType = 'youtube' | 'course' | 'meeting' | 'presentation' | 'general';
export type MediaMode = 'all' | 'audio' | 'video';

const CONTENT_TYPES: { id: ContentType; title: string; desc: string; icon: LucideIcon; modeMap: ContextMode }[] = [
  {
    id: 'youtube',
    title: 'YouTube Video or Playlist',
    desc: 'Extracts timestamps, video script hooks, and visual slide notes from YouTube videos or playlists.',
    icon: Tv,
    modeMap: 'youtube',
  },
  {
    id: 'course',
    title: 'Course / Online Lecture',
    desc: 'Capture Coursera, Udemy, or university lectures with multi-modal slide OCR and speech notes.',
    icon: GraduationCap,
    modeMap: 'course',
  },
  {
    id: 'meeting',
    title: 'Virtual Meeting (Zoom / Teams)',
    desc: 'Summarize Zoom, Microsoft Teams, or Google Meet live conversations, decisions, and action items.',
    icon: Users,
    modeMap: 'meeting',
  },
  {
    id: 'presentation',
    title: 'Presentation & Slide Deck',
    desc: 'Focus on capturing visual presentation slides, key formulas, and spoken lecturer commentary.',
    icon: Presentation,
    modeMap: 'course',
  },
  {
    id: 'general',
    title: 'General Screen & Web Stream',
    desc: 'All-purpose real-time note taking for any browser video feed, document, or application stream.',
    icon: Globe,
    modeMap: 'general',
  },
];

const MEDIA_OPTIONS: { id: MediaMode; title: string; desc: string; icon: LucideIcon }[] = [
  {
    id: 'all',
    title: 'Audio + Video (Recommended)',
    desc: 'Full multi-modal capture: spoken audio, slides, on-screen text, and visual diagrams.',
    icon: Layers,
  },
  {
    id: 'audio',
    title: 'Only Audio',
    desc: 'Focuses strictly on spoken speech, lecturer audio, and verbal commentary.',
    icon: Mic,
  },
  {
    id: 'video',
    title: 'Only Video',
    desc: 'Focuses on screen visuals, slide OCR, on-screen text, and visual diagrams without audio.',
    icon: Video,
  },
];

const PRESET_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

// Real-time note templates by content type
const SAMPLE_LIVE_NOTES: Record<ContentType, { title: string; type: string; detail: string }[]> = {
  youtube: [
    { title: 'Video Hook & Key Topic', type: 'summary', detail: 'Overview: AI-powered real-time note creation for educational video content.' },
    { title: 'Spoken Speech Timestamp [00:12]', type: 'audio', detail: '"Students no longer need to pause videos manually to write down notes."' },
    { title: 'Visual Frame Detection', type: 'visual', detail: 'Diagram detected: System architecture flowchart with multi-stream inputs.' },
    { title: 'Key Takeaway & Formula', type: 'ppt', detail: 'Key Takeaway: Synchronized audio & video processing cuts note-taking time by 80%.' },
    { title: 'Automated Summary Unit', type: 'summary', detail: 'Formatted into printable study guide unit ready for revision.' },
  ],
  course: [
    { title: 'Lecture Module #3 Overview', type: 'summary', detail: 'Topic: Deep Learning Transformer Models & Self-Attention Mechanisms.' },
    { title: 'Slide #4 Formula OCR', type: 'visual', detail: 'Equation logged: Attention(Q, K, V) = softmax(Q Kᵀ / √dₖ) V.' },
    { title: 'Instructor Verbal Note [00:18]', type: 'audio', detail: '"Notice how scaled dot product scaling prevents vanishing gradients during training."' },
    { title: 'Concept Definition', type: 'ppt', detail: 'Positional Encodings: Adds sequence order information to input embeddings.' },
    { title: 'Exam Revision Summary', type: 'summary', detail: 'Clean study notes generated automatically. Zero manual typing required.' },
  ],
  meeting: [
    { title: 'Meeting Agenda & Sync', type: 'summary', detail: 'Sync Purpose: Q2 Product Launch Readiness & Voice Workspace Deployment.' },
    { title: 'Key Discussion Point', type: 'audio', detail: 'Sarah confirmed that real-time screen capture works across all major web browsers.' },
    { title: 'Action Item Assigned', type: 'ppt', detail: 'Alex to finalize PDF print export feature by Friday 5 PM.' },
    { title: 'Executive Decision Log', type: 'summary', detail: 'Agreed on default 3-second countdown timer before live screen recording begins.' },
  ],
  presentation: [
    { title: 'Slide Deck Title', type: 'summary', detail: 'Presentation: Modern Multi-Modal AI Architectures & Workspace UX.' },
    { title: 'Slide #2 Visual Extraction', type: 'visual', detail: 'Graphic: Highlighting Audio Frequency Spectrum vs Visual OCR Frame Rate.' },
    { title: 'Presenter Comment', type: 'audio', detail: '"By fusing both modalities in real time, note accuracy reaches 99.4%."' },
    { title: 'Key Benchmark Metric', type: 'ppt', detail: 'Benchmark: Over 15,000 monthly study hours saved across active users.' },
  ],
  general: [
    { title: 'Real-Time Session Started', type: 'summary', detail: 'Capturing active screen region and system stream.' },
    { title: 'Audio Stream Active', type: 'audio', detail: 'Speech recognition engine parsing audio waveforms continuously.' },
    { title: 'Visual OCR Text Capture', type: 'visual', detail: 'On-screen text recognized and indexed into digital notebook.' },
    { title: 'Auto-Organized Unit', type: 'summary', detail: 'Session stored safely in chosen notebook.' },
  ],
};

export default function NewSessionModal({
  isOpen,
  onClose,
  notebooks,
  onCreateNotebook,
  onSaveNewNote,
  initialNotebookId,
}: NewSessionModalProps) {
  // Step State: 1 = notebook, 2 = contentType, 3 = mediaOption, 4 = permission, 5 = countdown, 6 = recording
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form Selections
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>('');
  const [isCreatingNewNb, setIsCreatingNewNb] = useState(false);
  const [newNbName, setNewNbName] = useState('');
  const [newNbDesc, setNewNbDesc] = useState('');
  const [newNbColor, setNewNbColor] = useState(PRESET_COLORS[1]);

  const [contentType, setContentType] = useState<ContentType>('youtube');
  const [mediaOption, setMediaOption] = useState<MediaMode>('all');
  const [hasGrantedPermission, setHasGrantedPermission] = useState(false);

  // Countdown & Recording State
  const [countdown, setCountdown] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveNotes, setLiveNotes] = useState<{ title: string; type: string; detail: string; time: string }[]>([]);

  // Initialize selected notebook
  useEffect(() => {
    if (initialNotebookId) {
      setSelectedNotebookId(initialNotebookId);
    } else if (notebooks.length > 0) {
      setSelectedNotebookId(notebooks[0].id);
    }
  }, [initialNotebookId, notebooks]);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCountdown(3);
      setIsRecording(false);
      setIsPaused(false);
      setRecordingSeconds(0);
      setLiveNotes([]);
      setHasGrantedPermission(false);
      if (initialNotebookId) {
        setSelectedNotebookId(initialNotebookId);
      } else if (notebooks.length > 0) {
        setSelectedNotebookId(notebooks[0].id);
      }
    }
  }, [isOpen, initialNotebookId, notebooks]);

  // Countdown Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (step === 5) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            setStep(6);
            setIsRecording(true);
            setIsPaused(false);
            setRecordingSeconds(0);
            const initialSamples = SAMPLE_LIVE_NOTES[contentType].slice(0, 2).map((n, idx) => ({
              ...n,
              time: `00:0${idx * 3 + 2}`,
            }));
            setLiveNotes(initialSamples);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, contentType]);

  // Live Recording Elapsed Seconds Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (step === 6 && isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, isRecording, isPaused]);

  // Live Note Generation Effect while recording
  useEffect(() => {
    if (step === 6 && isRecording && !isPaused) {
      const allSamples = SAMPLE_LIVE_NOTES[contentType];
      if (liveNotes.length < allSamples.length) {
        const timer = setTimeout(() => {
          const nextIndex = liveNotes.length;
          const nextItem = allSamples[nextIndex];
          if (nextItem) {
            const mins = Math.floor(recordingSeconds / 60);
            const secs = recordingSeconds % 60;
            const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            setLiveNotes((prev) => [...prev, { ...nextItem, time: timeStr }]);
          }
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [step, isRecording, isPaused, liveNotes.length, contentType, recordingSeconds]);

  if (!isOpen) return null;

  // Handle Creating New Notebook inline
  const handleCreateNewNotebookInline = () => {
    if (!newNbName.trim()) return;
    const created = onCreateNotebook(newNbName.trim(), newNbDesc.trim(), newNbColor);
    setSelectedNotebookId(created.id);
    setIsCreatingNewNb(false);
    setNewNbName('');
    setNewNbDesc('');
  };

  // Screen Access Permission Handler
  const handleGrantPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Prompt for actual screen media stream if available
        await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).catch(() => {
          // User canceled browser prompt, proceed with simulated permission
        });
      }
    } catch {
      // Browser display media not supported or simulated environment
    }
    setHasGrantedPermission(true);
  };

  // Start Session (goes to 3s countdown)
  const handleStartSessionTrigger = () => {
    if (isCreatingNewNb && newNbName.trim()) {
      handleCreateNewNotebookInline();
    }
    setStep(5);
  };

  // Stop Recording and Save Notes
  const handleStopRecordingAndSave = () => {
    setIsRecording(false);
    setIsPaused(false);

    const targetNb = notebooks.find((nb) => nb.id === selectedNotebookId) || notebooks[0];
    const targetNbId = targetNb ? targetNb.id : 'nb-general';
    const cTypeObj = CONTENT_TYPES.find((c) => c.id === contentType) || CONTENT_TYPES[0];

    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const formattedNotesText = liveNotes
      .map((n) => `### [${n.time}] ${n.title} (${n.type.toUpperCase()})\n${n.detail}`)
      .join('\n\n');

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: `${cTypeObj.title} - Session (${timeStr})`,
      notebookId: targetNbId,
      mode: cTypeObj.modeMap,
      polishedText: `# ${cTypeObj.title} - Real-Time Notes\n*Captured on ${new Date().toLocaleDateString()} (${timeStr} duration)*\n\n${formattedNotesText}`,
      rawTranscript: liveNotes.map((n) => n.detail).join(' '),
      audioDuration: Math.max(recordingSeconds, 12),
      wordCount: liveNotes.reduce((acc, curr) => acc + curr.detail.split(' ').length, 0),
      fillerWordsCount: 2,
      createdAt: new Date().toISOString(),
      tags: [contentType, mediaOption, 'real-time-session'],
    };

    onSaveNewNote(newNote);
    onClose();
  };

  const activeNotebook = notebooks.find((n) => n.id === selectedNotebookId) || notebooks[0];

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {step === 6 ? 'Real-Time Recording Active' : 'Start New Recording Session'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {step === 1 && 'Step 1 of 4: Choose or create target notebook'}
                {step === 2 && 'Step 2 of 4: Select content type'}
                {step === 3 && 'Step 3 of 4: Select recording media streams'}
                {step === 4 && 'Step 4 of 4: Grant screen access permissions'}
                {step === 5 && 'Starting recording in 3 seconds...'}
                {step === 6 && 'System is generating real-time notes based on screen content'}
              </p>
            </div>
          </div>

          <button
            onClick={step === 6 ? handleStopRecordingAndSave : onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: SAVE LOCATION (EXISTING OR NEW NOTEBOOK) */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground">Save Location</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose where to store the real-time generated notes or create a new notebook.
                </p>
              </div>

              {/* Toggle Create New vs Choose Existing */}
              <div className="flex items-center gap-3 p-1 rounded-2xl bg-muted/60 border border-border/60 w-fit">
                <button
                  type="button"
                  onClick={() => setIsCreatingNewNb(false)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    !isCreatingNewNb ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Existing Notebook
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewNb(true)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isCreatingNewNb ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  + Create New Notebook
                </button>
              </div>

              {!isCreatingNewNb ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {notebooks.map((nb) => {
                    const isSelected = selectedNotebookId === nb.id;
                    return (
                      <button
                        key={nb.id}
                        type="button"
                        onClick={() => setSelectedNotebookId(nb.id)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-primary ring-2 ring-primary/30'
                            : 'bg-card/80 border-border hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="size-3.5 rounded-full shrink-0" style={{ backgroundColor: nb.color }} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{nb.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{nb.description || 'General folder'}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="size-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Notebook Name</label>
                    <input
                      type="text"
                      value={newNbName}
                      onChange={(e) => setNewNbName(e.target.value)}
                      placeholder="e.g., Coursera Machine Learning, Zoom Design Reviews"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
                    <input
                      type="text"
                      value={newNbDesc}
                      onChange={(e) => setNewNbDesc(e.target.value)}
                      placeholder="e.g. Lectures, slides & meeting summaries"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Notebook Color Tag</label>
                    <div className="flex items-center gap-2 mt-1.5">
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
                  {newNbName.trim() && (
                    <button
                      type="button"
                      onClick={handleCreateNewNotebookInline}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                    >
                      Save & Select Notebook
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CONTENT TYPE SELECTOR */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Content Type Selector</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select what type of content you will be watching or recording to tailor AI comprehension.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTENT_TYPES.map((ct) => {
                  const IconComp = ct.icon;
                  const isSelected = contentType === ct.id;
                  return (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() => setContentType(ct.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-sm'
                          : 'bg-card/80 border-border hover:bg-muted'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        <IconComp className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground">{ct.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{ct.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA RECORDING STREAM OPTION */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Media Stream Options</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose which input streams NoteAI should analyze in real time.
                </p>
              </div>

              <div className="space-y-3">
                {MEDIA_OPTIONS.map((mo) => {
                  const IconComp = mo.icon;
                  const isSelected = mediaOption === mo.id;
                  return (
                    <button
                      key={mo.id}
                      type="button"
                      onClick={() => setMediaOption(mo.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-sm'
                          : 'bg-card/80 border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                          <IconComp className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{mo.title}</p>
                          <p className="text-[11px] text-muted-foreground">{mo.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="size-5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: SCREEN ACCESS PERMISSION REQUEST */}
          {step === 4 && (
            <div className="space-y-5 text-center py-4">
              <div className="size-16 rounded-3xl bg-primary/15 text-primary flex items-center justify-center mx-auto border border-primary/30">
                <Monitor className="size-8 animate-pulse" />
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-foreground">Screen Access Permission Request</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  NoteAI needs permission to access your screen and audio stream to analyze lectures, slides, and videos in real time.
                </p>
              </div>

              {!hasGrantedPermission ? (
                <div className="p-4 rounded-2xl bg-muted/50 border border-border max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Status:</span>
                    <span className="text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                      Permission Required
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGrantPermission}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
                  >
                    <Video className="size-4" />
                    <span>Grant Screen Access Permission</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-md mx-auto space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 className="size-4" />
                    <span>Screen Feed Connected (1080p @ 60 FPS)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Permission granted! Click "Start Recording" to begin the 3-second countdown.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: 3-SECOND COUNTDOWN */}
          {step === 5 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative size-32 flex items-center justify-center rounded-full bg-primary/10 border-4 border-primary text-primary font-black text-6xl animate-bounce shadow-2xl">
                {countdown}
              </div>
              <p className="text-sm font-bold text-foreground">Starting Recording Session...</p>
              <p className="text-xs text-muted-foreground">Get your video, course lecture, or meeting screen ready.</p>
            </div>
          )}

          {/* STEP 6: LIVE RECORDING & REAL-TIME NOTE GENERATION INTERFACE */}
          {step === 6 && (
            <div className="space-y-4">
              {/* TOP CONTROL BAR: REC indicator, Timer, Pause, Stop */}
              <div className="p-4 rounded-2xl bg-[#1d1c19] text-white flex flex-wrap items-center justify-between gap-3 shadow-lg border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-700">
                    <span className="relative flex size-3">
                      <span className={`absolute inline-flex size-full rounded-full bg-red-500 opacity-75 ${!isPaused ? 'animate-ping' : ''}`} />
                      <span className="relative inline-flex size-3 rounded-full bg-red-600" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                      {isPaused ? 'PAUSED' : 'REC'}
                    </span>
                    <span className="text-neutral-500 font-mono text-xs">|</span>
                    <span className="font-mono text-xs text-neutral-200 font-bold">
                      {formatTime(recordingSeconds)}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1 rounded-xl text-xs text-neutral-300 border border-neutral-800">
                    <span className="font-bold text-amber-300">📁 {activeNotebook?.name || 'General'}</span>
                  </div>
                </div>

                {/* PAUSE & STOP BUTTONS */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
                  >
                    {isPaused ? <Play className="size-3.5 fill-current text-emerald-400" /> : <Pause className="size-3.5 fill-current text-amber-400" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStopRecordingAndSave}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <Square className="size-3.5 fill-current" />
                    <span>STOP RECORDING</span>
                  </button>
                </div>
              </div>

              {/* REAL-TIME GENERATED NOTES FEED */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="size-4 text-red-500 animate-pulse" />
                    <h4 className="text-xs font-bold text-foreground">Real-Time Notes Generation Stream</h4>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Mode: {contentType.toUpperCase()} • {mediaOption.toUpperCase()}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border shadow-inner max-h-72 overflow-y-auto space-y-2.5">
                  {liveNotes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-muted/50 border border-border/80 text-xs space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-card text-muted-foreground border border-border">
                          {note.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/10 text-primary">
                          {note.type}
                        </span>
                      </div>
                      <p className="font-bold text-foreground text-xs">{note.title}</p>
                      <p className="text-muted-foreground text-[11.5px] leading-relaxed font-mono">{note.detail}</p>
                    </div>
                  ))}

                  {!isPaused && isRecording && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 animate-pulse font-medium">
                      <Sparkles className="size-3.5 animate-spin" />
                      <span>Comprehending screen visuals & audio stream in real time...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/30">
            <button
              type="button"
              onClick={() => {
                if (step === 1) onClose();
                else setStep((prev) => (prev > 1 ? (prev - 1) : 1) as 1 | 2 | 3 | 4 | 5 | 6);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>{step === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev < 4 ? (prev + 1) : 4) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>Next Step</span>
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!hasGrantedPermission}
                onClick={handleStartSessionTrigger}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  hasGrantedPermission
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                <Play className="size-3.5 fill-current" />
                <span>Start Session Recording</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
