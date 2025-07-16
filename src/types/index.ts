export interface PhraseData {
  english: string;
  japanese: string;
  hiragana: string;
  romaji: string;
  explanation: string;
  word_breakdown: Record<string, string>;
}

export interface PhrasesResponse {
  japanese_phrases: {
    learning_japanese: PhraseData[];
    asking_directions: PhraseData[];
    meeting_new_people: PhraseData[];
  };
}

export interface ExerciseResult {
  character: string;
  romaji: string;
  userAnswer: string;
  correct: boolean;
  timeSpent: number;
}

export interface ProgressData {
  characterMastery: Record<string, number>; // character -> mastery level (0-100)
  exerciseHistory: ExerciseResult[];
  timeSpent: Record<string, number>; // exercise type -> time in seconds
  successRates: Record<string, number>; // character -> success rate (0-1)
  streak: number;
  lastPracticeDate: string;
}

export type ExerciseType = 'recognition' | 'production' | 'audio' | 'speed' | 'mixed';
export type HiraganaCategory = 'basic' | 'dakuten' | 'handakuten' | 'combinations';
export type PhraseCategory = 'learning_japanese' | 'asking_directions' | 'meeting_new_people';

export interface QuizQuestion {
  id: string;
  character: string;
  correctAnswer: string;
  options: string[];
  type: 'hiragana-to-romaji' | 'romaji-to-hiragana';
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentCharacter: string | null;
  error: string | null;
}
