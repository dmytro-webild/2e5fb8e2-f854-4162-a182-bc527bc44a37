export type ContextMode = 'youtube' | 'course' | 'meeting' | 'general';

export interface NoteItem {
  id: string;
  title: string;
  notebookId: string;
  mode: ContextMode;
  polishedText: string;
  rawTranscript: string;
  audioDuration: number; // in seconds
  wordCount: number;
  fillerWordsCount: number;
  createdAt: string;
  tags: string[];
  sourceUrl?: string;
}

export interface NotebookFolder {
  id: string;
  name: string;
  description: string;
  color: string; // CSS color string or Tailwind color name
  icon: string;
  noteCount: number;
  createdAt: string;
}

export interface DictationHistoryItem {
  id: string;
  title: string;
  mode: ContextMode;
  audioDuration: number;
  wordCount: number;
  fillerWordsRemoved: number;
  rawTranscript: string;
  polishedText: string;
  createdAt: string;
  savedToNotebookId?: string;
}

export interface WorkspaceSettings {
  micDeviceId: string;
  spacebarShortcut: boolean;
  altVShortcut: boolean;
  defaultMode: ContextMode;
  autoRemoveFillers: boolean;
  glowEffectEnabled: boolean;
  glowStyle: 'siri' | 'amber' | 'violet';
  polishingIntensity: 'standard' | 'concise' | 'detailed';
}

export type ActiveTab = 'dictate' | 'notebooks' | 'history' | 'settings';
