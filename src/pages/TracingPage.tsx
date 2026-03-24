import { useState, useRef, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { TracingCanvas } from '../components/TracingCanvas';
import { TracingControls } from '../components/TracingControls';
import { TracingCharacterPicker } from '../components/TracingCharacterPicker';
import { getCharacterList } from '../utils/kanaHelpers';
import type { HiraganaCategory } from '../types';

type KanaType = 'hiragana' | 'katakana';

export const TracingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useApp();
  const isDarkMode = state.settings.darkMode;

  const initialKana = (searchParams.get('kana') === 'katakana'
    ? 'katakana'
    : 'hiragana') as KanaType;
  const initialChar = searchParams.get('char');

  const [kanaType, setKanaType] = useState<KanaType>(initialKana);
  const [category, setCategory] = useState<HiraganaCategory>('basic');
  const [sessionCount, setSessionCount] = useState(0);

  const characterList = useMemo(
    () => getCharacterList(kanaType, category),
    [kanaType, category]
  );

  // Find initial index from URL param or default to 0
  const getInitialIndex = () => {
    if (initialChar) {
      const idx = characterList.findIndex(([char]) => char === initialChar);
      if (idx >= 0) return idx;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  const currentChar = characterList[currentIndex]?.[0] ?? '';
  const currentRomaji = characterList[currentIndex]?.[1] ?? '';

  const clearRef = useRef<(() => void) | null>(null);
  const hasStrokesRef = useRef(false);

  const handleCharacterSelect = useCallback(
    (char: string) => {
      const idx = characterList.findIndex(([c]) => c === char);
      if (idx >= 0) setCurrentIndex(idx);
    },
    [characterList]
  );

  const handlePrevious = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(i => Math.min(characterList.length - 1, i + 1));
  }, [characterList.length]);

  const handleClear = useCallback(() => {
    clearRef.current?.();
  }, []);

  const handleMarkPracticed = useCallback(() => {
    dispatch({
      type: 'ADD_EXERCISE_RESULT',
      payload: {
        character: currentChar,
        romaji: currentRomaji,
        userAnswer: currentRomaji,
        correct: true,
        timeSpent: 0,
        exerciseType: 'hiragana',
      },
    });
    setSessionCount(c => c + 1);
    // Auto-advance and clear
    if (currentIndex < characterList.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  }, [dispatch, currentChar, currentRomaji, currentIndex, characterList.length]);

  const handleKanaTypeChange = useCallback(
    (type: KanaType) => {
      setKanaType(type);
      setCurrentIndex(0);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (cat: HiraganaCategory) => {
      setCategory(cat);
      setCurrentIndex(0);
    },
    []
  );

  const mastery = state.progress.characterMastery[currentChar] || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-flex items-center"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Kana Tracing Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Trace characters to practice writing. Use your mouse, stylus, or
          finger.
        </p>
      </div>

      <TracingCharacterPicker
        kanaType={kanaType}
        onKanaTypeChange={handleKanaTypeChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        currentCharacter={currentChar}
        onCharacterSelect={handleCharacterSelect}
        characterMastery={state.progress.characterMastery}
      />

      <div className="mt-6 flex flex-col items-center">
        {/* Character info */}
        <div className="text-center mb-4">
          <span className="text-6xl font-japanese text-gray-800 dark:text-gray-100">
            {currentChar}
          </span>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
            {currentRomaji}
          </p>
          {mastery > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Mastery: {mastery}%
            </p>
          )}
        </div>

        {/* Canvas */}
        <TracingCanvas
          guideCharacter={currentChar}
          isDarkMode={isDarkMode}
          clearRef={clearRef}
          hasStrokesRef={hasStrokesRef}
        />

        {/* Controls */}
        <TracingControls
          character={currentChar}
          onClear={handleClear}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onMarkPracticed={handleMarkPracticed}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < characterList.length - 1}
        />

        {/* Session stats */}
        {sessionCount > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Characters practiced this session: {sessionCount}
          </p>
        )}
      </div>
    </div>
  );
};
