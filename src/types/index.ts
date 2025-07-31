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
    shopping: PhraseData[];
    dining: PhraseData[];
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

export type ExerciseType = 'recognition' | 'production' | 'audio' | 'speed' | 'mixed' | 'typing' | 'emoji-recognition';
export type HiraganaCategory = 'basic' | 'dakuten' | 'handakuten' | 'combinations';
export type PhraseCategoryType = 'learning_japanese' | 'asking_directions' | 'meeting_new_people' | 'shopping' | 'dining';

export interface EmojiItem {
  emoji: string;
  english: string;
  japanese: string;
  hiragana: string;
  romaji: string;
}

export interface QuizQuestion {
  id: string;
  character: string;
  romaji: string;
  correctAnswer: string;
  options: string[];
  type: 'hiragana-to-romaji' | 'romaji-to-hiragana' | 'typing' | 'emoji-to-english' | 'emoji-to-japanese' | 'emoji-to-romaji';
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentCharacter: string | null;
  error: string | null;
}
