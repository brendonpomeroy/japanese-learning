import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  ProgressData,
  ExerciseResult,
  EmojiExerciseResult,
  WordExerciseResult,
} from '../types';

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
  | { type: 'RESET_PROGRESS' };

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

function loadInitialState(): AppState {
  const state = { ...defaultState };
  try {
    const savedProgress = localStorage.getItem('japanese-learning-progress');
    if (savedProgress) {
      state.progress = { ...state.progress, ...JSON.parse(savedProgress) };
    }
  } catch (e) {
    console.error('Error loading saved progress:', e);
  }
  try {
    const savedSettings = localStorage.getItem('japanese-learning-settings');
    if (savedSettings) {
      state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
    }
  } catch (e) {
    console.error('Error loading saved settings:', e);
  }
  return state;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export { AppContext };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, ...action.payload },
      };
    case 'ADD_EXERCISE_RESULT': {
      const newHistory = [...state.progress.exerciseHistory, action.payload];
      const character = action.payload.character;
      const characterResults = newHistory.filter(
        r => r.character === character
      );
      const successRate =
        characterResults.filter(r => r.correct).length /
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
                (action.payload.correct ? 10 : -5)
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
      const emojiResults = newEmojiHistory.filter(r => r.emoji === emoji);
      const emojiSuccessRate =
        emojiResults.filter(r => r.correct).length / emojiResults.length;

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
                  (action.payload.correct ? 10 : -5)
              )
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
      const wordResults = newVocabularyHistory.filter(r => r.word === word);
      const wordSuccessRate =
        wordResults.filter(r => r.correct).length / wordResults.length;

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
                  (action.payload.correct ? 10 : -5)
              )
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
      console.log('UPDATE_SETTINGS action received:', action.payload);
      const newSettings = { ...state.settings, ...action.payload };
      console.log('New settings state:', newSettings);
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
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'japanese-learning-progress',
      JSON.stringify(state.progress)
    );
  }, [state.progress]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'japanese-learning-settings',
      JSON.stringify(state.settings)
    );
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
