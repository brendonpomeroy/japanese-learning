import React, { useState, useEffect } from 'react';
import { WordFlashcard } from '../components/WordFlashcard';
import { ToggleButton } from '../components/ToggleButton';
import { useApp } from '../hooks/useApp';
import type { Word } from '../types';
import wordsData from '../assets/words.json';
import { capitalize, shuffle } from '../utils/helpers';

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
type Topic = 'all' | string;

const topics = Array.from(
  new Set((wordsData.words as Word[]).map(w => w.topic))
).sort();

export const FlashcardsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('all');
  const [showRomaji, setShowRomaji] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    needsPractice: 0,
    total: 0,
  });

  // Filter words based on selection
  useEffect(() => {
    let filtered: Word[] = wordsData.words as Word[];

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(w => w.difficulty === selectedDifficulty);
    }

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(w => w.topic === selectedTopic);
    }

    setFilteredWords(shuffle(filtered));
    setCurrentIndex(0);
  }, [selectedDifficulty, selectedTopic]);

  const handleStart = () => {
    if (filteredWords.length === 0) return;
    setIsStarted(true);
    setStartTime(Date.now());
    setSessionStats({ correct: 0, needsPractice: 0, total: 0 });
  };

  const handleNext = (correct: boolean) => {
    const timeSpent = Date.now() - startTime;
    const currentWord = filteredWords[currentIndex];

    // Update progress in context
    dispatch({
      type: 'ADD_WORD_EXERCISE_RESULT',
      payload: {
        word: currentWord.word,
        correct,
        timeSpent,
        difficulty: currentWord.difficulty,
        topic: currentWord.topic,
      },
    });

    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      needsPractice: prev.needsPractice + (correct ? 0 : 1),
      total: prev.total + 1,
    }));

    // Move to next card or finish
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStartTime(Date.now());
    } else {
      setIsStarted(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSessionStats({ correct: 0, needsPractice: 0, total: 0 });
    setIsStarted(true);
    setStartTime(Date.now());
  };

  // Calculate mastery stats
  const masteryStats = {
    totalWords: Object.keys(state.progress.vocabularyMastery).length,
    averageMastery:
      Object.keys(state.progress.vocabularyMastery).length > 0
        ? Object.values(state.progress.vocabularyMastery).reduce(
            (a, b) => a + b,
            0
          ) / Object.keys(state.progress.vocabularyMastery).length
        : 0,
    masteredWords: Object.values(state.progress.vocabularyMastery).filter(
      m => m >= 80
    ).length,
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-page p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-primary">
            Word Flashcards
          </h1>

          {/* Progress Overview */}
          {masteryStats.totalWords > 0 && (
            <div className="bg-surface rounded-lg shadow-soft-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Your Progress
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-blue">
                    {masteryStats.totalWords}
                  </div>
                  <div className="text-sm text-secondary">
                    Words Practiced
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {masteryStats.masteredWords}
                  </div>
                  <div className="text-sm text-secondary">
                    Mastered (80%+)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-violet">
                    {Math.round(masteryStats.averageMastery)}%
                  </div>
                  <div className="text-sm text-secondary">
                    Average Mastery
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Results */}
          {sessionStats.total > 0 && (
            <div className="bg-surface rounded-lg shadow-soft-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Session Complete!
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {sessionStats.total}
                  </div>
                  <div className="text-sm text-secondary">
                    Total Cards
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {sessionStats.correct}
                  </div>
                  <div className="text-sm text-secondary">
                    Got It!
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-error">
                    {sessionStats.needsPractice}
                  </div>
                  <div className="text-sm text-secondary">
                    Need Practice
                  </div>
                </div>
              </div>
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
              >
                Practice Again
              </button>
            </div>
          )}

          {/* Selection */}
          <div className="bg-surface rounded-lg shadow-soft-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Select Your Study Set
            </h2>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'all',
                    'beginner',
                    'intermediate',
                    'advanced',
                  ] as Difficulty[]
                ).map(diff => (
                  <ToggleButton
                    key={diff}
                    active={selectedDifficulty === diff}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {capitalize(diff)}
                  </ToggleButton>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Topic
              </label>
              <div className="flex flex-wrap gap-2">
                <ToggleButton
                  active={selectedTopic === 'all'}
                  onClick={() => setSelectedTopic('all')}
                >
                  All Topics
                </ToggleButton>
                {topics.map(topic => (
                  <ToggleButton
                    key={topic}
                    active={selectedTopic === topic}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {capitalize(topic)}
                  </ToggleButton>
                ))}
              </div>
            </div>

            {/* Hiragana Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRomaji}
                  onChange={e => setShowRomaji(e.target.checked)}
                  className="w-5 h-5 text-accent-blue rounded focus:ring-accent-blue"
                />
                <span className="ml-3 text-secondary">
                  Show hiragana on front (otherwise shows kanji/kana)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-secondary">
                {filteredWords.length} word
                {filteredWords.length !== 1 ? 's' : ''} available
              </p>
              <button
                onClick={handleStart}
                disabled={filteredWords.length === 0}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  filteredWords.length === 0
                    ? 'bg-surface-alt text-secondary cursor-not-allowed'
                    : 'bg-success hover:bg-success/80 text-white'
                }`}
              >
                Start Practice
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-surface rounded-lg shadow-soft-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              How It Works
            </h2>
            <ul className="space-y-2 text-secondary">
              <li>
                • Click on a card to flip it and see the definition and example
              </li>
              <li>
                • Mark "Got It!" if you knew the word, or "Need Practice" if you
                need to review it
              </li>
              <li>• Your progress is tracked and saved automatically</li>
              <li>
                • Words you mark as "Need Practice" will decrease in mastery,
                helping you focus on difficult words
              </li>
              <li>
                • Mix and match difficulty levels and topics to customize your
                study
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Active flashcard session
  return (
    <div className="min-h-screen bg-page p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Card {currentIndex + 1} of {filteredWords.length}
            </h1>
            <p className="text-secondary">
              {selectedDifficulty !== 'all' && (
                <span className="capitalize">{selectedDifficulty} • </span>
              )}
              {selectedTopic !== 'all' && (
                <span className="capitalize">{selectedTopic}</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setIsStarted(false)}
            className="px-4 py-2 bg-surface-alt hover:bg-border text-secondary rounded-lg font-medium transition-colors"
          >
            Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-alt rounded-full h-2 mb-8">
          <div
            className="bg-accent-blue h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / filteredWords.length) * 100}%`,
            }}
          />
        </div>

        {/* Flashcard */}
        {filteredWords[currentIndex] && (
          <WordFlashcard
            word={filteredWords[currentIndex]}
            showRomaji={showRomaji}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};
