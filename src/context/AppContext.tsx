import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProgressData, ExerciseResult } from '../types';

interface AppState {
  progress: ProgressData;
  currentExercise: string | null;
  settings: {
    audioEnabled: boolean;
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

type AppAction =
  | { type: 'UPDATE_PROGRESS'; payload: Partial<ProgressData> }
  | { type: 'ADD_EXERCISE_RESULT'; payload: ExerciseResult }
  | { type: 'SET_CURRENT_EXERCISE'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'RESET_PROGRESS' };

const initialState: AppState = {
  progress: {
    characterMastery: {},
    exerciseHistory: [],
    timeSpent: {},
    successRates: {},
    streak: 0,
    lastPracticeDate: ''
  },
  currentExercise: null,
  settings: {
    audioEnabled: true,
    darkMode: false,
    fontSize: 'medium'
  }
};

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
        progress: { ...state.progress, ...action.payload }
      };
    case 'ADD_EXERCISE_RESULT': {
      const newHistory = [...state.progress.exerciseHistory, action.payload];
      const character = action.payload.character;
      const characterResults = newHistory.filter(r => r.character === character);
      const successRate = characterResults.filter(r => r.correct).length / characterResults.length;
      
      return {
        ...state,
        progress: {
          ...state.progress,
          exerciseHistory: newHistory,
          successRates: {
            ...state.progress.successRates,
            [character]: successRate
          },
          characterMastery: {
            ...state.progress.characterMastery,
            [character]: Math.min(100, (state.progress.characterMastery[character] || 0) + (action.payload.correct ? 10 : -5))
          }
        }
      };
    }
    case 'SET_CURRENT_EXERCISE':
      return {
        ...state,
        currentExercise: action.payload
      };
    case 'UPDATE_SETTINGS': {
      console.log('UPDATE_SETTINGS action received:', action.payload);
      const newSettings = { ...state.settings, ...action.payload };
      console.log('New settings state:', newSettings);
      return {
        ...state,
        settings: newSettings
      };
    }
    case 'RESET_PROGRESS':
      return {
        ...state,
        progress: initialState.progress
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('japanese-learning-progress');
    const savedSettings = localStorage.getItem('japanese-learning-settings');
    
    console.log('Loading saved settings:', savedSettings);
    
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        dispatch({ type: 'UPDATE_PROGRESS', payload: parsed });
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        console.log('Parsed settings:', parsed);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed });
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('japanese-learning-progress', JSON.stringify(state.progress));
  }, [state.progress]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('japanese-learning-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
