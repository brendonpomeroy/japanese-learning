import React, { useState, useEffect, useContext } from 'react';
import { WordFlashcard } from '../components/WordFlashcard';
import { AppContext } from '../context/AppContext';
import type { Word } from '../types';
import wordsData from '../assets/words.json';

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
type Topic = 'all' | string;

export const FlashcardsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all');
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

  if (!context) {
    throw new Error('AppContext must be used within AppProvider');
  }

  const { state, dispatch } = context;

  // Get unique topics from words
  const topics = Array.from(
    new Set((wordsData.words as Word[]).map((w) => w.topic))
  ).sort();

  // Filter words based on selection
  useEffect(() => {
    let filtered: Word[] = wordsData.words as Word[];

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((w) => w.difficulty === selectedDifficulty);
    }

    if (selectedTopic !== 'all') {
      filtered = filtered.filter((w) => w.topic === selectedTopic);
    }

    // Shuffle words
    filtered = [...filtered].sort(() => Math.random() - 0.5);

    setFilteredWords(filtered);
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
    setSessionStats({
      correct: sessionStats.correct + (correct ? 1 : 0),
      needsPractice: sessionStats.needsPractice + (correct ? 0 : 1),
      total: sessionStats.total + 1,
    });

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
        ? Object.values(state.progress.vocabularyMastery).reduce((a, b) => a + b, 0) /
          Object.keys(state.progress.vocabularyMastery).length
        : 0,
    masteredWords: Object.values(state.progress.vocabularyMastery).filter(
      (m) => m >= 80
    ).length,
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Word Flashcards
          </h1>

          {/* Progress Overview */}
          {masteryStats.totalWords > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Your Progress
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {masteryStats.totalWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Words Practiced
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {masteryStats.masteredWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mastered (80%+)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(masteryStats.averageMastery)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Mastery
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Results */}
          {sessionStats.total > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Session Complete!
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {sessionStats.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Cards
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {sessionStats.correct}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Got It!
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {sessionStats.needsPractice}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Need Practice
                  </div>
                </div>
              </div>
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Practice Again
              </button>
            </div>
          )}

          {/* Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Select Your Study Set
            </h2>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'beginner', 'intermediate', 'advanced'] as Difficulty[]).map(
                  (diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedDifficulty === diff
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTopic === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All Topics
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTopic === topic
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Hiragana Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRomaji}
                  onChange={(e) => setShowRomaji(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">
                  Show hiragana on front (otherwise shows kanji/kana)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}{' '}
                available
              </p>
              <button
                onClick={handleStart}
                disabled={filteredWords.length === 0}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  filteredWords.length === 0
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Start Practice
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Click on a card to flip it and see the definition and example</li>
              <li>
                • Mark "Got It!" if you knew the word, or "Need Practice" if you need
                to review it
              </li>
              <li>• Your progress is tracked and saved automatically</li>
              <li>
                • Words you mark as "Need Practice" will decrease in mastery, helping
                you focus on difficult words
              </li>
              <li>• Mix and match difficulty levels and topics to customize your study</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Active flashcard session
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Card {currentIndex + 1} of {filteredWords.length}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
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
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
