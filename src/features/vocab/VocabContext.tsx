import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type {
  VocabState,
  VocabMode,
  PracticeMode,
  TopicFilter,
  DifficultyFilter,
  AnswerResult,
  VocabSettings,
  WordProgress,
} from './types';
import { createDefaultVocabState, createDefaultWordProgress } from './types';

const STORAGE_KEY = 'vocab_progress_v2';

interface VocabContextValue {
  state: VocabState;
  setMode: (mode: VocabMode) => void;
  setPracticeMode: (mode: PracticeMode) => void;
  setTopic: (topic: TopicFilter) => void;
  setDifficulty: (difficulty: DifficultyFilter) => void;
  setSettings: (settings: Partial<VocabSettings>) => void;
  answerWord: (
    wordKey: string,
    result: AnswerResult,
    isCorrect: boolean
  ) => void;
  resetProgress: () => void;
  resetSession: () => void;
}

export const VocabContext = createContext<VocabContextValue | null>(null);

type VocabAction =
  | { type: 'SET_MODE'; payload: VocabMode }
  | { type: 'SET_PRACTICE_MODE'; payload: PracticeMode }
  | { type: 'SET_TOPIC'; payload: TopicFilter }
  | { type: 'SET_DIFFICULTY'; payload: DifficultyFilter }
  | { type: 'SET_SETTINGS'; payload: Partial<VocabSettings> }
  | {
      type: 'ANSWER_WORD';
      payload: { wordKey: string; result: AnswerResult; isCorrect: boolean };
    }
  | { type: 'RESET_PROGRESS' }
  | { type: 'RESET_SESSION' }
  | { type: 'HYDRATE'; payload: VocabState };

function vocabReducer(state: VocabState, action: VocabAction): VocabState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_PRACTICE_MODE':
      return { ...state, practiceMode: action.payload };
    case 'SET_TOPIC':
      return { ...state, selectedTopic: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, selectedDifficulty: action.payload };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'ANSWER_WORD': {
      const { wordKey, result, isCorrect } = action.payload;
      const now = new Date().toISOString();
      const currentProgress =
        state.wordProgress[wordKey] || createDefaultWordProgress();

      // Update stats
      const newProgress: WordProgress = {
        ...currentProgress,
        seen: currentProgress.seen + 1,
        correct: isCorrect
          ? currentProgress.correct + 1
          : currentProgress.correct,
        incorrect: isCorrect
          ? currentProgress.incorrect
          : currentProgress.incorrect + 1,
        lastSeenAt: now,
        lastResult: result,
      };

      // SRS-lite scheduling
      const nowDate = new Date();
      let dueAt: Date;
      let intervalDays: number;
      let ease = newProgress.ease;

      switch (result) {
        case 'again':
          dueAt = new Date(nowDate.getTime() + 5 * 60 * 1000); // 5 minutes
          intervalDays = 0;
          ease = Math.max(1.3, ease - 0.2);
          break;
        case 'hard':
          dueAt = new Date(nowDate.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day
          intervalDays = 1;
          ease = Math.max(1.3, ease - 0.15);
          break;
        case 'good':
          dueAt = new Date(nowDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
          intervalDays = 3;
          // ease stays the same
          break;
        case 'easy':
          dueAt = new Date(nowDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
          intervalDays = 7;
          ease = Math.min(2.5, ease + 0.15);
          break;
      }

      newProgress.dueAt = dueAt.toISOString();
      newProgress.intervalDays = intervalDays;
      newProgress.ease = ease;
      newProgress.repetitions = isCorrect
        ? newProgress.repetitions + 1
        : Math.max(0, newProgress.repetitions - 1);

      // Update session stats
      const newSession = {
        correct: state.session.correct + (isCorrect ? 1 : 0),
        total: state.session.total + 1,
      };

      // Update streak
      let newStreak = state.streak;
      if (isCorrect) {
        newStreak = state.streak + 1;
      } else {
        newStreak = 0;
      }

      return {
        ...state,
        wordProgress: {
          ...state.wordProgress,
          [wordKey]: newProgress,
        },
        session: newSession,
        streak: newStreak,
        lastWordKey: wordKey,
      };
    }
    case 'RESET_PROGRESS':
      return createDefaultVocabState();
    case 'RESET_SESSION':
      return {
        ...state,
        session: { correct: 0, total: 0 },
        lastWordKey: null,
      };
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

function loadStateFromStorage(): VocabState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Validate schema version
    if (parsed.schemaVersion !== 2) {
      // Migration: if old version, return null to use defaults
      return null;
    }

    // Ensure all required fields exist
    const state: VocabState = {
      ...createDefaultVocabState(),
      ...parsed,
      settings: {
        ...createDefaultVocabState().settings,
        ...(parsed.settings || {}),
      },
    };

    return state;
  } catch (error) {
    console.error('Error loading vocab state from storage:', error);
    return null;
  }
}

function saveStateToStorage(state: VocabState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving vocab state to storage:', error);
  }
}

export const VocabProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(vocabReducer, createDefaultVocabState());
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const loaded = loadStateFromStorage();
    if (loaded) {
      dispatch({ type: 'HYDRATE', payload: loaded });
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when state changes (but not on initial hydration)
  useEffect(() => {
    if (isHydrated) {
      saveStateToStorage(state);
    }
  }, [state, isHydrated]);

  const setMode = useCallback((mode: VocabMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const setPracticeMode = useCallback((mode: PracticeMode) => {
    dispatch({ type: 'SET_PRACTICE_MODE', payload: mode });
  }, []);

  const setTopic = useCallback((topic: TopicFilter) => {
    dispatch({ type: 'SET_TOPIC', payload: topic });
  }, []);

  const setDifficulty = useCallback((difficulty: DifficultyFilter) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  }, []);

  const setSettings = useCallback((settings: Partial<VocabSettings>) => {
    dispatch({ type: 'SET_SETTINGS', payload: settings });
  }, []);

  const answerWord = useCallback(
    (wordKey: string, result: AnswerResult, isCorrect: boolean) => {
      dispatch({
        type: 'ANSWER_WORD',
        payload: { wordKey, result, isCorrect },
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    dispatch({ type: 'RESET_PROGRESS' });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const value: VocabContextValue = {
    state,
    setMode,
    setPracticeMode,
    setTopic,
    setDifficulty,
    setSettings,
    answerWord,
    resetProgress,
    resetSession,
  };

  return (
    <VocabContext.Provider value={value}>{children}</VocabContext.Provider>
  );
};
