import React, { useState, useEffect, useMemo } from 'react';
import { useVocab } from '../features/vocab/useVocab';
import { vocabWords, getTopics } from '../features/vocab/vocabData';
import {
  getEligibleWords,
  selectNextWord,
  generateMcqOptions,
} from '../features/vocab/utils';
import type { VocabWord, AnswerResult } from '../features/vocab/types';

export const VocabPage: React.FC = () => {
  const {
    state,
    setMode,
    setPracticeMode,
    setTopic,
    setDifficulty,
    setSettings,
    answerWord,
    resetProgress,
    resetSession,
  } = useVocab();

  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [mcqOptions, setMcqOptions] = useState<VocabWord[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(
    null
  );

  const topics = useMemo(() => getTopics(), []);

  // Get eligible words based on filters
  const eligibleWords = useMemo(
    () =>
      getEligibleWords(vocabWords, state.selectedTopic, state.selectedDifficulty),
    [state.selectedTopic, state.selectedDifficulty]
  );

  // Select next word when eligible words change or after answering
  useEffect(() => {
    if (eligibleWords.length > 0 && !isAnswered) {
      const next = selectNextWord(
        eligibleWords,
        state.wordProgress,
        state.lastWordKey
      );
      if (next) {
        setCurrentWord(next);
        setUserInput('');
        setIsAnswered(false);
        setIsCorrect(false);
        setSelectedMcqOption(null);

        // Generate MCQ options if in MCQ mode
        if (state.mode === 'mcq') {
          const options = generateMcqOptions(next, eligibleWords, 3);
          setMcqOptions(options);
        }
      }
    }
  }, [
    eligibleWords,
    state.wordProgress,
    state.lastWordKey,
    state.mode,
    isAnswered,
  ]);

  // Calculate mastery stats
  const masteryStats = useMemo(() => {
    const topicMastery: Array<{
      topic: string;
      mastery: number;
      learned: number;
      total: number;
    }> = [];

    topics.forEach((topic) => {
      const topicWords = vocabWords.filter((w) => w.topic === topic);
      if (topicWords.length === 0) return;

      let totalMastery = 0;
      let learnedCount = 0;

      topicWords.forEach((word) => {
        const progress = state.wordProgress[word.word];
        if (progress) {
          const mastery = progress.seen > 0 ? progress.correct / progress.seen : 0;
          totalMastery += mastery;
          if (progress.seen >= 3 && mastery >= 0.8) {
            learnedCount++;
          }
        }
      });

      const avgMastery = topicWords.length > 0 ? totalMastery / topicWords.length : 0;

      topicMastery.push({
        topic,
        mastery: avgMastery,
        learned: learnedCount,
        total: topicWords.length,
      });
    });

    topicMastery.sort((a, b) => b.mastery - a.mastery);

    // Top 5 need more practice
    const needPractice = vocabWords
      .map((word) => {
        const progress = state.wordProgress[word.word];
        if (!progress || progress.seen < 1) return null;

        const needScore =
          ((progress.incorrect + 1) / (progress.correct + 1)) *
          (1 / (progress.seen + 0.5));
        const mastery = progress.seen > 0 ? progress.correct / progress.seen : 0;

        return {
          word,
          needScore,
          mastery,
          seen: progress.seen,
          correct: progress.correct,
          incorrect: progress.incorrect,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.needScore - a.needScore)
      .slice(0, 5);

    return { topicMastery, needPractice };
  }, [topics, state.wordProgress]);

  const handleTypeSubmit = () => {
    if (!currentWord || userInput.trim() === '') return;

    const trimmed = userInput.trim();
    const correct =
      trimmed === currentWord.kana_kanji || trimmed === currentWord.hiragana;

    setIsAnswered(true);
    setIsCorrect(correct);

    // Determine result based on correctness
    const result: AnswerResult = correct ? 'good' : 'again';
    answerWord(currentWord.word, result, correct);

    if (correct) {
      setTimeout(() => {
        setIsAnswered(false);
        setUserInput('');
      }, 600);
    }
  };

  const handleMcqSelect = (selectedWord: VocabWord) => {
    if (!currentWord || isAnswered) return;

    setSelectedMcqOption(selectedWord.word);
    const correct = selectedWord.word === currentWord.word;
    setIsAnswered(true);
    setIsCorrect(correct);

    const result: AnswerResult = correct ? 'good' : 'again';
    answerWord(currentWord.word, result, correct);

    if (correct) {
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedMcqOption(null);
      }, 600);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setUserInput('');
    setSelectedMcqOption(null);
  };

  const handleGiveUp = () => {
    if (!currentWord || isAnswered) return;

    setIsAnswered(true);
    setIsCorrect(false);
    answerWord(currentWord.word, 'again', false);
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all progress? This cannot be undone.'
      )
    ) {
      resetProgress();
      resetSession();
      setIsAnswered(false);
      setUserInput('');
      setSelectedMcqOption(null);
    }
  };

  const totalCorrect = useMemo(() => {
    return Object.values(state.wordProgress).reduce(
      (sum, p) => sum + p.correct,
      0
    );
  }, [state.wordProgress]);

  const totalSeen = useMemo(() => {
    return Object.values(state.wordProgress).reduce((sum, p) => sum + p.seen, 0);
  }, [state.wordProgress]);

  const getHint = (word: VocabWord): string => {
    if (word.hiragana.length === 0) return '';
    const firstChar = word.hiragana[0];
    return `${firstChar}... (${word.hiragana.length} characters)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Vocab Practice
          </h1>

          {/* Controls */}
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Practice Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('type')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    state.mode === 'type'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Type It
                </button>
                <button
                  onClick={() => setMode('mcq')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    state.mode === 'mcq'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Pick 1 of 3
                </button>
              </div>
            </div>

            {/* Practice Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Practice Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPracticeMode('auto')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    state.practiceMode === 'auto'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setPracticeMode('filtered')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    state.practiceMode === 'filtered'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Filtered
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={state.selectedDifficulty}
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced'
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic
                </label>
                <select
                  value={state.selectedTopic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.settings.showRomaji}
                  onChange={(e) =>
                    setSettings({ showRomaji: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Show Romaji
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.settings.showHint}
                  onChange={(e) => setSettings({ showHint: e.target.checked })}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Show Hint
                </span>
              </label>
            </div>

            {/* Reset Progress */}
            <div>
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>

        {/* Mastery Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Mastery */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Topic Mastery
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {masteryStats.topicMastery.map((tm) => (
                <div
                  key={tm.topic}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {tm.topic.charAt(0).toUpperCase() + tm.topic.slice(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tm.learned}/{tm.total} learned
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(tm.mastery * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Need Practice */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Top 5 Need More Practice
            </h2>
            <div className="space-y-3">
              {masteryStats.needPractice.length > 0 ? (
                masteryStats.needPractice.map((item) => (
                  <div
                    key={item.word.word}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {item.word.kana_kanji}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {item.word.definition}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{item.word.topic}</span>
                      <span>
                        {Math.round(item.mastery * 100)}% mastery ({item.correct}
                        /{item.seen})
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No words need practice yet. Keep practicing!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Practice Card */}
        {currentWord && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {/* Stats Bar */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Streak: <strong className="text-gray-900 dark:text-white">{state.streak}</strong>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Session: <strong className="text-gray-900 dark:text-white">{state.session.correct}/{state.session.total}</strong>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Total: <strong className="text-gray-900 dark:text-white">{totalCorrect}/{totalSeen}</strong>
                  </span>
                </div>
              </div>

              {/* Word Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentWord.definition}
                </div>
                {state.settings.showRomaji && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {currentWord.romaji}
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                  {currentWord.example_sentence}
                </div>

                {/* Hint */}
                {state.settings.showHint && state.mode === 'type' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Hint: {getHint(currentWord)}
                  </div>
                )}

                {/* Type Mode */}
                {state.mode === 'type' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isAnswered) {
                          handleTypeSubmit();
                        }
                      }}
                      disabled={isAnswered}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Type the word in hiragana or kanji..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleTypeSubmit}
                        disabled={isAnswered || userInput.trim() === ''}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                      </button>
                      {!isAnswered && (
                        <button
                          onClick={handleGiveUp}
                          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Give Up
                        </button>
                      )}
                      {isAnswered && (
                        <button
                          onClick={handleNext}
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* MCQ Mode */}
                {state.mode === 'mcq' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      {mcqOptions.map((option) => {
                        const isSelected = selectedMcqOption === option.word;
                        const isCorrectOption = option.word === currentWord.word;
                        const showResult = isAnswered && (isSelected || isCorrectOption);

                        return (
                          <button
                            key={option.word}
                            onClick={() => handleMcqSelect(option)}
                            disabled={isAnswered}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors text-left ${
                              showResult
                                ? isCorrectOption
                                  ? 'bg-green-500 text-white'
                                  : isSelected
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {option.kana_kanji}
                          </button>
                        );
                      })}
                    </div>
                    {isAnswered && (
                      <button
                        onClick={handleNext}
                        className="w-full px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}

                {/* Answer Feedback */}
                {isAnswered && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      isCorrect
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="font-semibold">Correct! ✓</div>
                    ) : (
                      <div>
                        <div className="font-semibold mb-1">Incorrect</div>
                        <div>
                          Answer: <strong>{currentWord.kana_kanji}</strong> (
                          {currentWord.hiragana})
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No words available */}
        {eligibleWords.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No words available with the selected filters. Please adjust your
              topic or difficulty selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
