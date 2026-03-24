import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useGrammar } from '../features/grammar/useGrammar';
import { getPackById } from '../features/grammar/grammarData';
import type { GrammarMode } from '../features/grammar/types';
import { FillExercise } from './grammar/FillExercise';
import { BuildExercise } from './grammar/BuildExercise';
import { CorrectExercise } from './grammar/CorrectExercise';
import { SessionSummary } from './grammar/SessionSummary';

export const GrammarSessionPage = () => {
  const { packId, mode } = useParams<{ packId: string; mode: string }>();
  const navigate = useNavigate();
  const { state, startSession, answerItem, nextQuestion, endSession } =
    useGrammar();

  const pack = packId ? getPackById(packId) : undefined;
  const grammarMode = mode as GrammarMode;
  const { currentSession } = state;
  const [sessionStarted, setSessionStarted] = useState(false);

  // Start session on mount
  useEffect(() => {
    if (pack && grammarMode && !sessionStarted) {
      startSession(pack.id, grammarMode);
      setSessionStarted(true);
    }
  }, [pack, grammarMode, startSession, sessionStarted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  const currentItem = useMemo(() => {
    if (!pack || currentSession.isComplete || !currentSession.queue.length)
      return null;
    const itemId = currentSession.queue[currentSession.currentIndex];
    return pack.items.find(item => item.id === itemId) ?? null;
  }, [pack, currentSession]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!currentItem) return;
      answerItem(currentItem.id, isCorrect);
    },
    [currentItem, answerItem]
  );

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleRetry = useCallback(() => {
    if (pack && grammarMode) {
      setSessionStarted(false);
    }
  }, [pack, grammarMode]);

  // Reset session when retry is triggered
  useEffect(() => {
    if (!sessionStarted && pack && grammarMode) {
      startSession(pack.id, grammarMode);
      setSessionStarted(true);
    }
  }, [sessionStarted, pack, grammarMode, startSession]);

  const handleBack = useCallback(() => {
    navigate(`/grammar/${packId}`);
  }, [navigate, packId]);

  if (!pack || !grammarMode) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Invalid session.</p>
      </div>
    );
  }

  if (!currentSession.queue.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  const progress = `${Math.min(currentSession.currentIndex + 1, currentSession.queue.length)} / ${currentSession.queue.length}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Exit
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {pack.title} — {grammarMode.charAt(0).toUpperCase() + grammarMode.slice(1)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress}
        </span>
      </div>

      {/* Progress bar */}
      {!currentSession.isComplete && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="h-2 rounded-full bg-rose-500 transition-all duration-300"
            style={{
              width: `${(currentSession.currentIndex / currentSession.queue.length) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Exercise or Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {currentSession.isComplete ? (
          <SessionSummary
            results={currentSession.results}
            items={pack.items}
            onRetry={handleRetry}
            onBack={handleBack}
          />
        ) : currentItem ? (
          grammarMode === 'fill' ? (
            <FillExercise
              key={currentItem.id + '-' + currentSession.currentIndex}
              item={currentItem}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          ) : grammarMode === 'build' ? (
            <BuildExercise
              key={currentItem.id + '-' + currentSession.currentIndex}
              item={currentItem}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          ) : grammarMode === 'correct' ? (
            <CorrectExercise
              key={currentItem.id + '-' + currentSession.currentIndex}
              item={currentItem}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          ) : null
        ) : null}
      </div>
    </div>
  );
};
