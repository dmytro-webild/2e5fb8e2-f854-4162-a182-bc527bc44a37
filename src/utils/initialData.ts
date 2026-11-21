import type { NotebookFolder, NoteItem, DictationHistoryItem } from '../types/workspace';

export const INITIAL_NOTEBOOKS: NotebookFolder[] = [
  {
    id: 'nb-youtube',
    name: 'YouTube Scripts',
    description: 'Video scripts, timestamps, B-roll cues & descriptions',
    color: '#ef4444',
    icon: 'Youtube',
    noteCount: 3,
    createdAt: '2026-11-01',
  },
  {
    id: 'nb-course',
    name: 'Engineering Lectures',
    description: 'CS & AI study notes, flashcards & lecture summaries',
    color: '#3b82f6',
    icon: 'GraduationCap',
    noteCount: 4,
    createdAt: '2026-11-05',
  },
  {
    id: 'nb-meetings',
    name: 'Client & Team Syncs',
    description: 'Executive meeting notes, key decisions & action checklists',
    color: '#10b981',
    icon: 'Briefcase',
    noteCount: 2,
    createdAt: '2026-11-10',
  },
  {
    id: 'nb-general',
    name: 'Daily Ideas & Brain Dumps',
    description: 'Clean freeform voice notes with filler words removed',
    color: '#8b5cf6',
    icon: 'Sparkles',
    noteCount: 3,
    createdAt: '2026-11-15',
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'YouTube Script: Building AI Voice-to-Text Apps',
    notebookId: 'nb-youtube',
    mode: 'youtube',
    polishedText: `🎬 **HOOK & ATTENTION GRABBER (0:00 - 0:15)**
"Welcome back! In today's video, we're building a full voice-to-text productivity workspace from scratch. If you've wanted to capture lectures or meeting thoughts automatically with zero typing, this step-by-step breakdown is for you!"

⏱️ **TIMESTAMPS & SCRIPT OUTLINE**
- **00:00** - Intro: The Pain of Manual Note-Taking
- **01:15** - Architecture: Web Speech API & Real-time Audio Waveforms
- **03:45** - Context Modes: Tailoring AI Output for YouTube, Courses & Meetings
- **06:30** - Siri-style Edge Glow Animations & Visual Feedback
- **08:50** - Summary & Source Code Access

🎥 **B-ROLL & VISUAL CUES**
- [ ] *B-Roll Cue 1:* Cut to screen recording of the active recording waveform and glow border.
- [ ] *B-Roll Cue 2:* Overlay diagram showing multi-modal speech-to-text formatting.
- [ ] *B-Roll Cue 3:* Zoom in on one-click Markdown export and notebook folder hierarchy.

📝 **VIDEO DESCRIPTION & HASHTAGS**
In this tutorial, we explore building NoteAI—an AI voice workspace built with React 19, Tailwind, and Web Audio APIs.

#VoiceAI #React #Productivity #WisprFlow #WebDev`,
    rawTranscript: 'um so like today we are building a complete voice to text workspace and uh basically it eliminates typing by converting spoken lectures and meetings into structured notes like automatically and stuff',
    audioDuration: 84,
    wordCount: 142,
    fillerWordsCount: 6,
    createdAt: '2026-11-18T14:32:00Z',
    tags: ['youtube', 'video-script', 'voice-ai'],
  },
  {
    id: 'note-2',
    title: 'Lecture Notes: Transformer Attention Mechanisms',
    notebookId: 'nb-course',
    mode: 'course',
    polishedText: `📚 **COURSE STUDY NOTES (Stanford CS224N)**

📌 **TOPIC OVERVIEW**
Self-Attention allows neural network models to dynamically weight the importance of different tokens in a sequence, irrespective of their positional distance.

🔑 **KEY DEFINITIONS & TERMINOLOGY**
- **Query (Q), Key (K), Value (V):** Linear projections of token embeddings used to calculate context-aware representations.
- **Scaled Dot-Product Attention:** Attention(Q, K, V) = softmax(Q Kᵀ / √dₖ) V. Scaling by √dₖ prevents gradient vanishing when dimension dₖ is large.
- **Multi-Head Attention:** Splitting Q, K, V across multiple projection heads to capture diverse representation subspaces simultaneously.

📝 **DETAILED SUMMARY & LECTURE POINTS**
- **Core Insight:** Replaces recurrent sequential bottlenecks with parallelized matrix operations.
- **Synthesis:** Positional encodings (sinusoidal or rotary) are added to input embeddings to preserve sequence order.
- **Application:** Foundation of modern Large Language Models and real-time speech processing engines.

🧠 **FLASHCARDS & SELF-QUIZ QUESTIONS**
1. **Q:** Why do we scale by √dₖ in dot-product attention?
   **A:** To avoid pushing softmax into regions with extremely small gradients.
2. **Q:** How does Multi-Head Attention improve sequence representation?
   **A:** It allows the model to attend to information from different representation subspaces at different positions simultaneously.`,
    rawTranscript: 'um basically attention mechanism calculates weights between query and key matrices and then multiplies by value, scale by square root of d k so gradients don\'t vanish like in deep networks',
    audioDuration: 112,
    wordCount: 198,
    fillerWordsCount: 5,
    createdAt: '2026-11-19T10:15:00Z',
    tags: ['cs224n', 'deep-learning', 'transformers'],
  },
  {
    id: 'note-3',
    title: 'Meeting Summary: Q4 Product Strategy & Roadmap',
    notebookId: 'nb-meetings',
    mode: 'meeting',
    polishedText: `💼 **EXECUTIVE MEETING SUMMARY (Product Sync)**

🎯 **MEETING PURPOSE & CONTEXT**
Aligning roadmap milestones for NoteAI v2.0 release, focusing on instant voice transcription, keyboard shortcut accessibility, and folder organization.

💡 **KEY DECISIONS MADE**
1. **Shortcut Access:** Default shortcut set to Spacebar / Alt+V for recording toggle, Cmd+K for global search.
2. **Export Preferences:** Support instant Markdown, TXT, and PDF print previews.
3. **Freemium Tier:** Free tier includes 100 dictation minutes per month; Pro tier offers unlimited AI polishing.

✅ **ACTION ITEMS CHECKLIST**
- [ ] **[Engineering]** Add full keyboard shortcut listeners for Spacebar & Alt+V (@Alex)
- [ ] **[Design]** Polish top header context indicator & active mode pills (@Maya)
- [ ] **[Product]** Prepare user feedback survey for beta testers (@David)

🗣️ **KEY DISCUSSION HIGHLIGHTS**
- Emphasized low-friction onboarding directly from landing page CTA.
- Verified Siri-style edge glow animation duration (~1.2s) during AI polishing transition.`,
    rawTranscript: 'uh so we decided to enable spacebar toggle for voice recording and also cmd K search palette, free tier gets 100 minutes and pro tier will have unlimited polishing',
    audioDuration: 95,
    wordCount: 165,
    fillerWordsCount: 4,
    createdAt: '2026-11-20T16:45:00Z',
    tags: ['meeting', 'roadmap', 'product'],
  },
];

export const INITIAL_HISTORY: DictationHistoryItem[] = [
  {
    id: 'hist-1',
    title: 'YouTube Script: Building AI Voice-to-Text Apps',
    mode: 'youtube',
    audioDuration: 84,
    wordCount: 142,
    fillerWordsRemoved: 6,
    rawTranscript: INITIAL_NOTES[0].rawTranscript,
    polishedText: INITIAL_NOTES[0].polishedText,
    createdAt: '2026-11-18T14:32:00Z',
    savedToNotebookId: 'nb-youtube',
  },
  {
    id: 'hist-2',
    title: 'Lecture Notes: Transformer Attention Mechanisms',
    mode: 'course',
    audioDuration: 112,
    wordCount: 198,
    fillerWordsRemoved: 5,
    rawTranscript: INITIAL_NOTES[1].rawTranscript,
    polishedText: INITIAL_NOTES[1].polishedText,
    createdAt: '2026-11-19T10:15:00Z',
    savedToNotebookId: 'nb-course',
  },
  {
    id: 'hist-3',
    title: 'Meeting Summary: Q4 Product Strategy & Roadmap',
    mode: 'meeting',
    audioDuration: 95,
    wordCount: 165,
    fillerWordsRemoved: 4,
    rawTranscript: INITIAL_NOTES[2].rawTranscript,
    polishedText: INITIAL_NOTES[2].polishedText,
    createdAt: '2026-11-20T16:45:00Z',
    savedToNotebookId: 'nb-meetings',
  },
];
