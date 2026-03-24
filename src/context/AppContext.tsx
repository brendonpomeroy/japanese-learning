import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import type {
  ProgressData,
  ExerciseResult,
  EmojiExerciseResult,
  WordExerciseResult,
} from '../types';
import { getDeviceId } from '../lib/device';
import { writeSyncMeta } from '../lib/cloudData';
import { useCloudSync } from '../hooks/useCloudSync';
import { useAuth } from '../hooks/useAuth';

interface AppState {
  progress: ProgressData;
  currentExercise: string | null;
  settings: {
    audioEnabled: boolean;
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    theme: 'default' | 'paper';
  };
}

type AppAction =
  | { type: 'UPDATE_PROGRESS'; payload: Partial<ProgressData> }
  | { type: 'ADD_EXERCISE_RESULT'; payload: ExerciseResult }
  | { type: 'ADD_EMOJI_EXERCISE_RESULT'; payload: EmojiExerciseResult }
  | { type: 'ADD_WORD_EXERCISE_RESULT'; payload: WordExerciseResult }
  | { type: 'SET_CURRENT_EXERCISE'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'RESET_PROGRESS' }
  | { type: 'HYDRATE_PROGRESS'; payload: ProgressData }
  | { type: 'HYDRATE_SETTINGS'; payload: AppState['settings'] };

const defaultState: AppState = {
  progress: {
    characterMastery: {},
    exerciseHistory: [],
    emojiMastery: {},
    emojiExerciseHistory: [],
    vocabularyMastery: {},
    vocabularyExerciseHistory: [],
    vocabularySuccessRates: {},
    timeSpent: {},
    successRates: {},
    emojiSuccessRates: {},
    streak: 0,
    lastPracticeDate: '',
  },
  currentExercise: null,
  settings: {
    audioEnabled: true,
    darkMode: false,
    fontSize: 'medium',
    theme: 'default',
  },
};

// ---------------------------------------------------------------------------
// localStorage helpers (matching VocabContext / GrammarContext pattern)
// ---------------------------------------------------------------------------

function loadProgressFromStorage(): ProgressData | null {
  try {
    const raw = localStorage.getItem('japanese-learning-progress');
    if (!raw) return null;
    return { ...defaultState.progress, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading saved progress:', e);
    return null;
  }
}

function loadSettingsFromStorage(): AppState['settings'] | null {
  try {
    const raw = localStorage.getItem('japanese-learning-settings');
    if (!raw) return null;
    return { ...defaultState.settings, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading saved settings:', e);
    return null;
  }
}

function saveProgressToStorage(progress: ProgressData): void {
  try {
    localStorage.setItem(
      'japanese-learning-progress',
      JSON.stringify(progress),
    );
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

function saveSettingsToStorage(settings: AppState['settings']): void {
  try {
    localStorage.setItem(
      'japanese-learning-settings',
      JSON.stringify(settings),
    );
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export { AppContext };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'HYDRATE_PROGRESS':
      return {
        ...state,
        progress: action.payload,
      };
    case 'HYDRATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, ...action.payload },
      };
    case 'ADD_EXERCISE_RESULT': {
      const newHistory = [...state.progress.exerciseHistory, action.payload];
      const character = action.payload.character;
      const characterResults = newHistory.filter(
        (r) => r.character === character,
      );
      const successRate =
        characterResults.filter((r) => r.correct).length /
        characterResults.length;

      return {
        ...state,
        progress: {
          ...state.progress,
          exerciseHistory: newHistory,
          successRates: {
            ...state.progress.successRates,
            [character]: successRate,
          },
          characterMastery: {
            ...state.progress.characterMastery,
            [character]: Math.min(
              100,
              (state.progress.characterMastery[character] || 0) +
                (action.payload.correct ? 10 : -5),
            ),
          },
        },
      };
    }
    case 'ADD_EMOJI_EXERCISE_RESULT': {
      const newEmojiHistory = [
        ...state.progress.emojiExerciseHistory,
        action.payload,
      ];
      const emoji = action.payload.emoji;
      const emojiResults = newEmojiHistory.filter((r) => r.emoji === emoji);
      const emojiSuccessRate =
        emojiResults.filter((r) => r.correct).length / emojiResults.length;

      return {
        ...state,
        progress: {
          ...state.progress,
          emojiExerciseHistory: newEmojiHistory,
          emojiSuccessRates: {
            ...state.progress.emojiSuccessRates,
            [emoji]: emojiSuccessRate,
          },
          emojiMastery: {
            ...state.progress.emojiMastery,
            [emoji]: Math.min(
              100,
              Math.max(
                0,
                (state.progress.emojiMastery[emoji] || 0) +
                  (action.payload.correct ? 10 : -5),
              ),
            ),
          },
        },
      };
    }
    case 'ADD_WORD_EXERCISE_RESULT': {
      const newVocabularyHistory = [
        ...state.progress.vocabularyExerciseHistory,
        action.payload,
      ];
      const word = action.payload.word;
      const wordResults = newVocabularyHistory.filter((r) => r.word === word);
      const wordSuccessRate =
        wordResults.filter((r) => r.correct).length / wordResults.length;

      return {
        ...state,
        progress: {
          ...state.progress,
          vocabularyExerciseHistory: newVocabularyHistory,
          vocabularySuccessRates: {
            ...state.progress.vocabularySuccessRates,
            [word]: wordSuccessRate,
          },
          vocabularyMastery: {
            ...state.progress.vocabularyMastery,
            [word]: Math.min(
              100,
              Math.max(
                0,
                (state.progress.vocabularyMastery[word] || 0) +
                  (action.payload.correct ? 10 : -5),
              ),
            ),
          },
        },
      };
    }
    case 'SET_CURRENT_EXERCISE':
      return {
        ...state,
        currentExercise: action.payload,
      };
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings: newSettings,
      };
    }
    case 'RESET_PROGRESS':
      return {
        ...state,
        progress: defaultState.progress,
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, defaultState);
  const [isHydrated, setIsHydrated] = useState(false);
  const isHydratingRef = useRef(true);
  const { isSyncReady } = useAuth();

  // Hydrate from localStorage on mount
  useEffect(() => {
    isHydratingRef.current = true;
    const progress = loadProgressFromStorage();
    if (progress) {
      dispatch({ type: 'HYDRATE_PROGRESS', payload: progress });
    }
    const settings = loadSettingsFromStorage();
    if (settings) {
      dispatch({ type: 'HYDRATE_SETTINGS', payload: settings });
    }
    isHydratingRef.current = false;
    setIsHydrated(true);
  }, []);

  // Persist progress to localStorage (gated on hydration)
  useEffect(() => {
    if (!isHydrated) return;
    saveProgressToStorage(state.progress);
    if (!isHydratingRef.current) {
      writeSyncMeta('japanese-learning-progress', {
        clientUpdatedAt: new Date().toISOString(),
        deviceId: getDeviceId(),
      });
    }
  }, [state.progress, isHydrated]);

  // Persist settings to localStorage (gated on hydration)
  useEffect(() => {
    if (!isHydrated) return;
    saveSettingsToStorage(state.settings);
    if (!isHydratingRef.current) {
      writeSyncMeta('japanese-learning-settings', {
        clientUpdatedAt: new Date().toISOString(),
        deviceId: getDeviceId(),
      });
    }
  }, [state.settings, isHydrated]);

  // Cloud sync for progress and settings
  useCloudSync({
    storageKey: 'japanese-learning-progress',
    payload: state.progress,
    isHydrated,
    isEnabled: isSyncReady,
  });

  useCloudSync({
    storageKey: 'japanese-learning-settings',
    payload: state.settings,
    isHydrated,
    isEnabled: isSyncReady,
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
