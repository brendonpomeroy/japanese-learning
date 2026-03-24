import React, { useState, useMemo, useCallback } from 'react';
import { VocabExplainer } from './vocab/VocabExplainer';
import { useVocab } from '../features/vocab/useVocab';
import { vocabWords } from '../features/vocab/vocabData';
import {
  getEligibleWords,
  selectNextWord,
  generateMcqOptions,
} from '../features/vocab/utils';
import type { VocabWord, AnswerResult } from '../features/vocab/types';
import { VocabControls } from './vocab/VocabControls';
import { MasteryDashboard } from './vocab/MasteryDashboard';
import { TypePracticeCard } from './vocab/TypePracticeCard';
import { McqPracticeCard } from './vocab/McqPracticeCard';

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
  const [cardKey, setCardKey] = useState(0);

  const eligibleWords = useMemo(
    () =>
      getEligibleWords(
        vocabWords,
        state.selectedTopic,
        state.selectedDifficulty
      ),
    [state.selectedTopic, state.selectedDifficulty]
  );

  const advanceToNextWord = useCallback(() => {
    if (eligibleWords.length === 0) return;

    const next = selectNextWord(
      eligibleWords,
      state.wordProgress,
      state.lastWordKey
    );
    if (!next) return;

    setCurrentWord(next);
    setCardKey(k => k + 1);

    if (state.mode === 'mcq') {
      setMcqOptions(generateMcqOptions(next, eligibleWords, 3));
    }
  }, [eligibleWords, state.wordProgress, state.lastWordKey, state.mode]);

  // Advance on mount and when filters change
  React.useEffect(() => {
    advanceToNextWord();
  }, [eligibleWords]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback(
    (result: AnswerResult, isCorrect: boolean) => {
      if (!currentWord) return;
      answerWord(currentWord.word, result, isCorrect);
    },
    [currentWord, answerWord]
  );

  const handleResetProgress = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all progress? This cannot be undone.'
      )
    ) {
      resetProgress();
      resetSession();
    }
  };

  const totalCorrect = useMemo(
    () =>
      Object.values(state.wordProgress).reduce((sum, p) => sum + p.correct, 0),
    [state.wordProgress]
  );

  const totalSeen = useMemo(
    () => Object.values(state.wordProgress).reduce((sum, p) => sum + p.seen, 0),
    [state.wordProgress]
  );

  return (
    <div className="min-h-screen bg-page p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <VocabControls
          mode={state.mode}
          practiceMode={state.practiceMode}
          selectedDifficulty={state.selectedDifficulty}
          selectedTopic={state.selectedTopic}
          settings={state.settings}
          onSetMode={setMode}
          onSetPracticeMode={setPracticeMode}
          onSetDifficulty={setDifficulty}
          onSetTopic={setTopic}
          onSetSettings={setSettings}
          onResetProgress={handleResetProgress}
        />

        <VocabExplainer />

        <MasteryDashboard wordProgress={state.wordProgress} />

        {/* Practice Card */}
        {currentWord && (
          <div className="bg-surface rounded-lg shadow-soft-md p-6">
            {/* Stats Bar */}
            <div className="flex justify-between items-center text-sm mb-4">
              <div className="flex gap-4">
                <span className="text-secondary">
                  Streak:{' '}
                  <strong className="text-primary">{state.streak}</strong>
                </span>
                <span className="text-secondary">
                  Session:{' '}
                  <strong className="text-primary">
                    {state.session.correct}/{state.session.total}
                  </strong>
                </span>
                <span className="text-secondary">
                  Total:{' '}
                  <strong className="text-primary">
                    {totalCorrect}/{totalSeen}
                  </strong>
                </span>
              </div>
            </div>

            {state.mode === 'type' ? (
              <TypePracticeCard
                key={cardKey}
                currentWord={currentWord}
                showHint={state.settings.showHint}
                showRomaji={state.settings.showRomaji}
                onAnswer={handleAnswer}
                onNext={advanceToNextWord}
              />
            ) : (
              <McqPracticeCard
                key={cardKey}
                currentWord={currentWord}
                mcqOptions={mcqOptions}
                showRomaji={state.settings.showRomaji}
                onAnswer={handleAnswer}
                onNext={advanceToNextWord}
              />
            )}
          </div>
        )}

        {/* No words available */}
        {eligibleWords.length === 0 && (
          <div className="bg-surface rounded-lg shadow-soft-md p-6 text-center">
            <p className="text-secondary">
              No words available with the selected filters. Please adjust your
              topic or difficulty selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
