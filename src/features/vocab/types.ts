export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface VocabWord {
  word: string;
  kana_kanji: string;
  hiragana: string;
  romaji: string;
  example_sentence: string;
  definition: string;
  difficulty: Difficulty;
  topic: string;
}

export interface VocabData {
  words: VocabWord[];
}

export type WordProgress = {
  seen: number;
  correct: number;
  incorrect: number;
  lastSeenAt: string | null;
  lastResult: 'again' | 'hard' | 'good' | 'easy' | null;
  // SRS-ready fields
  dueAt: string | null;
  intervalDays: number;
  ease: number;
  repetitions: number;
};

export type VocabMode = 'type' | 'mcq';
export type PracticeMode = 'auto' | 'filtered';
export type TopicFilter = 'all' | string;
export type DifficultyFilter = 'all' | Difficulty;
export type AnswerResult = 'again' | 'hard' | 'good' | 'easy';

export interface VocabSettings {
  showRomaji: boolean;
  showHint: boolean;
}

export interface VocabState {
  schemaVersion: 2;
  mode: VocabMode;
  practiceMode: PracticeMode;
  selectedTopic: TopicFilter;
  selectedDifficulty: DifficultyFilter;
  settings: VocabSettings;
  streak: number;
  session: { correct: number; total: number };
  lastWordKey: string | null;
  wordProgress: Record<string, WordProgress>;
}

export const createDefaultWordProgress = (): WordProgress => ({
  seen: 0,
  correct: 0,
  incorrect: 0,
  lastSeenAt: null,
  lastResult: null,
  dueAt: null,
  intervalDays: 0,
  ease: 2.5,
  repetitions: 0,
});

export const createDefaultVocabState = (): VocabState => ({
  schemaVersion: 2,
  mode: 'type',
  practiceMode: 'auto',
  selectedTopic: 'all',
  selectedDifficulty: 'all',
  settings: {
    showRomaji: false,
    showHint: true,
  },
  streak: 0,
  session: { correct: 0, total: 0 },
  lastWordKey: null,
  wordProgress: {},
});
