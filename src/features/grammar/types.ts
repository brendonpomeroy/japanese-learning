export type GrammarMode = 'build' | 'correct' | 'fill';

export interface GrammarItem {
  id: string;
  english: string;
  japanese: string;
  tokens: string[];
  translationNotes: string[];
  focus: {
    grammarPoint: string;
    role: string;
  };
  build?: {
    distractors: string[];
  };
  correct?: {
    incorrectJapanese: string;
    errorType:
      | 'wrong-particle'
      | 'wrong-order'
      | 'wrong-verb'
      | 'missing-token';
  };
  fill?: {
    promptJapanese: string;
    answer: string;
    options: string[];
  };
}

export interface GrammarPack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  supportedModes: GrammarMode[];
  items: GrammarItem[];
}

export interface GrammarDataFile {
  version: number;
  packs: GrammarPack[];
}

export interface ItemProgress {
  seen: number;
  correct: number;
  streak: number;
}

export type PackModeProgress = Record<string, ItemProgress>;

export type GrammarProgress = Record<string, Record<string, PackModeProgress>>;

export interface SessionResult {
  itemId: string;
  correct: boolean;
}

export interface GrammarSession {
  packId: string | null;
  mode: GrammarMode | null;
  queue: string[];
  currentIndex: number;
  results: SessionResult[];
  isComplete: boolean;
}

export interface GrammarState {
  schemaVersion: 1;
  progress: GrammarProgress;
  currentSession: GrammarSession;
}

export const createDefaultItemProgress = (): ItemProgress => ({
  seen: 0,
  correct: 0,
  streak: 0,
});

export const createDefaultSession = (): GrammarSession => ({
  packId: null,
  mode: null,
  queue: [],
  currentIndex: 0,
  results: [],
  isComplete: false,
});

export const createDefaultGrammarState = (): GrammarState => ({
  schemaVersion: 1,
  progress: {},
  currentSession: createDefaultSession(),
});
