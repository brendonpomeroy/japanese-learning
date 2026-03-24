import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type {
  GrammarState,
  GrammarMode,
  SessionResult,
  ItemProgress,
} from './types';
import {
  createDefaultGrammarState,
  createDefaultSession,
  createDefaultItemProgress,
} from './types';
import { getPackItems } from './grammarData';
import { selectSessionItems, getPackModeProgress } from './utils';

const STORAGE_KEY = 'grammar_progress_v1';

interface GrammarContextValue {
  state: GrammarState;
  startSession: (packId: string, mode: GrammarMode) => void;
  answerItem: (itemId: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  endSession: () => void;
  resetPackProgress: (packId: string) => void;
  resetAllProgress: () => void;
}

export const GrammarContext = createContext<GrammarContextValue | null>(null);

type GrammarAction =
  | { type: 'HYDRATE'; payload: GrammarState }
  | {
      type: 'START_SESSION';
      payload: { packId: string; mode: GrammarMode; queue: string[] };
    }
  | { type: 'ANSWER_ITEM'; payload: { itemId: string; isCorrect: boolean } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_SESSION' }
  | { type: 'RESET_PACK'; payload: string }
  | { type: 'RESET_ALL' };

function grammarReducer(
  state: GrammarState,
  action: GrammarAction
): GrammarState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'START_SESSION': {
      const { packId, mode, queue } = action.payload;
      return {
        ...state,
        currentSession: {
          packId,
          mode,
          queue,
          currentIndex: 0,
          results: [],
          isComplete: false,
        },
      };
    }

    case 'ANSWER_ITEM': {
      const { itemId, isCorrect } = action.payload;
      const { currentSession, progress } = state;
      const { packId, mode } = currentSession;

      if (!packId || !mode) return state;

      // Update item progress
      const packProgress = progress[packId] ?? {};
      const modeProgress = packProgress[mode] ?? {};
      const currentItemProgress: ItemProgress =
        modeProgress[itemId] ?? createDefaultItemProgress();

      const updatedItemProgress: ItemProgress = {
        seen: currentItemProgress.seen + 1,
        correct: isCorrect
          ? currentItemProgress.correct + 1
          : currentItemProgress.correct,
        streak: isCorrect ? currentItemProgress.streak + 1 : 0,
      };

      // Append session result
      const newResult: SessionResult = { itemId, correct: isCorrect };

      return {
        ...state,
        progress: {
          ...progress,
          [packId]: {
            ...packProgress,
            [mode]: {
              ...modeProgress,
              [itemId]: updatedItemProgress,
            },
          },
        },
        currentSession: {
          ...currentSession,
          results: [...currentSession.results, newResult],
        },
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentSession.currentIndex + 1;
      const isComplete = nextIndex >= state.currentSession.queue.length;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          currentIndex: nextIndex,
          isComplete,
        },
      };
    }

    case 'END_SESSION':
      return {
        ...state,
        currentSession: createDefaultSession(),
      };

    case 'RESET_PACK': {
      const packId = action.payload;
      const { [packId]: _, ...restProgress } = state.progress;
      void _;
      return {
        ...state,
        progress: restProgress,
      };
    }

    case 'RESET_ALL':
      return createDefaultGrammarState();

    default:
      return state;
  }
}

function loadStateFromStorage(): GrammarState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (parsed.schemaVersion !== 1) return null;

    const state: GrammarState = {
      ...createDefaultGrammarState(),
      ...parsed,
      currentSession: createDefaultSession(),
    };

    return state;
  } catch (error) {
    console.error('Error loading grammar state from storage:', error);
    return null;
  }
}

function saveStateToStorage(state: GrammarState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving grammar state to storage:', error);
  }
}

export const GrammarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    grammarReducer,
    createDefaultGrammarState()
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadStateFromStorage();
    if (loaded) {
      dispatch({ type: 'HYDRATE', payload: loaded });
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveStateToStorage(state);
    }
  }, [state, isHydrated]);

  const startSession = useCallback(
    (packId: string, mode: GrammarMode) => {
      const items = getPackItems(packId);
      const modeProgress = getPackModeProgress(state.progress, packId, mode);
      const queue = selectSessionItems(items, modeProgress);
      dispatch({ type: 'START_SESSION', payload: { packId, mode, queue } });
    },
    [state.progress]
  );

  const answerItem = useCallback(
    (itemId: string, isCorrect: boolean) => {
      dispatch({ type: 'ANSWER_ITEM', payload: { itemId, isCorrect } });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: 'END_SESSION' });
  }, []);

  const resetPackProgress = useCallback((packId: string) => {
    dispatch({ type: 'RESET_PACK', payload: packId });
  }, []);

  const resetAllProgress = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const value: GrammarContextValue = {
    state,
    startSession,
    answerItem,
    nextQuestion,
    endSession,
    resetPackProgress,
    resetAllProgress,
  };

  return (
    <GrammarContext.Provider value={value}>{children}</GrammarContext.Provider>
  );
};
