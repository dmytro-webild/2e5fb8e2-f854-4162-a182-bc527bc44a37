import type { ContextMode } from '../types/workspace';

export interface FormattedOutput {
  title: string;
  polishedText: string;
  rawTranscript: string;
  fillerWordsRemoved: number;
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of', 'i mean', 'literally'];

export function cleanFillerWords(rawText: string): { cleaned: string; count: number } {
  let count = 0;
  let text = rawText;

  FILLER_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b,?\\s*`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
    text = text.replace(regex, '');
  });

  // Capitalize sentence starts and fix multiple spaces
  text = text
    .replace(/\s+/g, ' ')
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
    .trim();

  return { cleaned: text, count };
}

export function formatSpeechByMode(spokenInput: string, mode: ContextMode): FormattedOutput {
  const { cleaned, count } = cleanFillerWords(spokenInput);
  const words = cleaned.split(' ').filter(Boolean);
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let title = 'Voice Recording Note';
  let polishedText = '';

  switch (mode) {
    case 'youtube': {
      title = `YouTube Script: ${words.slice(0, 5).join(' ') || 'New Video Concept'}`;
      polishedText = `🎬 **HOOK & ATTENTION GRABBER (0:00 - 0:15)**
"Welcome back! In today's video, we're diving straight into ${words.slice(0, 8).join(' ')}. If you've been struggling to organize your thoughts effortlessly, this guide is built for you."

⏱️ **TIMESTAMPS & SCRIPT OUTLINE**
- **00:00** - Intro & Main Problem Statement
- **01:15** - Core Concept Breakdown: *${words.slice(0, 6).join(' ')}*
- **03:45** - Step-by-Step Implementation Strategy
- **06:30** - Common Pitfalls & Mistakes to Avoid
- **08:50** - Final Takeaway & Call-to-Action

🎥 **B-ROLL & VISUAL CUES**
- [ ] *B-Roll Cue 1:* Cut to close-up screen recording demonstrating the workflow.
- [ ] *B-Roll Cue 2:* Overlay animated diagram explaining the architectural flow.
- [ ] *B-Roll Cue 3:* Text pop-up highlighting key statistics and productivity metrics.

📝 **VIDEO DESCRIPTION & HASHTAGS**
Here is a complete breakdown of ${cleaned}

#Productivity #VoiceAI #ContentCreation #YouTubeTips #TechTools`;
      break;
    }

    case 'course': {
      title = `Lecture Notes: ${words.slice(0, 5).join(' ') || 'Academic Concept Summary'}`;
      polishedText = `📚 **COURSE STUDY NOTES (${now})**

📌 **TOPIC OVERVIEW**
${cleaned}

🔑 **KEY DEFINITIONS & TERMINOLOGY**
- **Primary Mechanism:** The core framework governing real-time multi-modal input processing and slide alignment.
- **Cognitive Offloading:** Reducing manual note-taking overhead to maximize active listening and comprehension.
- **Structured Retrieval:** Formatting information into indexed definitions and summaries for efficient exam revision.

📝 **DETAILED SUMMARY & LECTURE POINTS**
- **Core Insight:** Information from spoken speech, lecture slides, and video text can be unified without manual interruption.
- **Synthesis:** Key equations and concepts are indexed automatically in chronological study blocks.
- **Application:** Ideal for Coursera, YouTube lectures, university webcasts, and technical workshops.

🧠 **FLASHCARDS & SELF-QUIZ QUESTIONS**
1. **Q:** What is the primary benefit of automatic multi-stream note comprehension?
   **A:** Eliminates constant pausing and manual typing, allowing 100% focus on video material.
2. **Q:** How are definitions and timestamps indexed?
   **A:** Speech frequencies are aligned with visual OCR slide changes in real time.`;
      break;
    }

    case 'meeting': {
      title = `Meeting Summary: ${words.slice(0, 5).join(' ') || 'Team Alignment Sync'}`;
      polishedText = `💼 **EXECUTIVE MEETING SUMMARY (${now})**

🎯 **MEETING PURPOSE & CONTEXT**
${cleaned}

💡 **KEY DECISIONS MADE**
1. **Approved Architecture:** Adopted real-time voice-to-text processing for all product syncs.
2. **Timeline Consensus:** Target beta workspace release ready within the current sprint cycle.
3. **Resource Allocation:** Frontend team leading UI components and screen-glow edge animations.

✅ **ACTION ITEMS CHECKLIST**
- [ ] **[Engineering]** Integrate Web Audio API frequency visualizer into recording dock (@Alex)
- [ ] **[Design]** Finalize Siri-inspired edge aura gradient transition sweep (@Sarah)
- [ ] **[Product]** Review mode-specific AI prompt templates for YouTube & Course workflows (@David)
- [ ] **[QA]** Test keyboard shortcuts (Spacebar & Cmd+K) across browsers (@Elena)

🗣️ **KEY DISCUSSION HIGHLIGHTS**
- Emphasized high tactile visual feedback during recording.
- Confirmed zero-latency transition between raw transcription capture and polished AI output.`;
      break;
    }

    case 'general':
    default: {
      title = `Voice Note: ${words.slice(0, 5).join(' ') || 'Quick Thought'}`;
      polishedText = `✍️ **DICTATED VOICE NOTE (${now})**

${cleaned}

---
*Polished automatically by NoteAI Voice Engine. Filler words ("um", "uh", "like") removed.*`;
      break;
    }
  }

  return {
    title,
    polishedText,
    rawTranscript: spokenInput,
    fillerWordsRemoved: count,
  };
}

export function adjustTone(currentText: string, toneType: 'concise' | 'formal' | 'expand' | 'simplify' | 'checklist'): string {
  if (!currentText) return currentText;

  switch (toneType) {
    case 'concise':
      return `⚡ **CONCISE SUMMARY**\n\n` + currentText
        .split('\n')
        .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('#') || line.trim().length > 0)
        .slice(0, 8)
        .join('\n');

    case 'formal':
      return `🏛️ **EXECUTIVE & FORMAL SPECIFICATION**\n\n` + currentText
        .replace(/I'm|we're|don't|can't|it's/gi, (match) => {
          const map: Record<string, string> = {
            "I'm": 'I am',
            "we're": 'we are',
            "don't": 'do not',
            "can't": 'cannot',
            "it's": 'it is',
          };
          return map[match] || match;
        });

    case 'expand':
      return currentText + `\n\n📌 **DEEPER CONTEXT & ELABORATION**\nThis dictate session provides comprehensive coverage of key themes. Further investigation indicates strong alignment with strategic goals, optimized execution workflows, and actionable metrics for long-term productivity enhancement.`;

    case 'simplify':
      return `💡 **IN PLAIN ENGLISH (EL5)**\n\nHere is what this means in simple terms:\n` + currentText
        .split('\n')
        .slice(0, 5)
        .join('\n');

    case 'checklist':
      return currentText + `\n\n✅ **GENERATED ACTION CHECKLIST**\n- [ ] Review raw transcript for additional technical specifics\n- [ ] Share polished summary with team members or students\n- [ ] Export note as Markdown for documentation archive`;

    default:
      return currentText;
  }
}
