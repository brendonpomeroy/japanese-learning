import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useGrammar } from '../features/grammar/useGrammar';
import { getPackById } from '../features/grammar/grammarData';
import type { GrammarMode, GrammarItem } from '../features/grammar/types';
import { FillExercise } from './grammar/FillExercise';
import { CorrectExercise } from './grammar/CorrectExercise';
import { SessionSummary } from './grammar/SessionSummary';

export const GrammarQuizSessionPage = () => {
  const { mode } = useParams<{ mode: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, startQuizSession, answerItem, nextQuestion, endSession } =
    useGrammar();

  const packIds: string[] | undefined = (location.state as { packIds?: string[] })?.packIds;
  const grammarMode = mode as GrammarMode;
  const { currentSession } = state;
  const [sessionStarted, setSessionStarted] = useState(false);

  // Redirect to setup if no packIds in state (e.g., page refresh)
  useEffect(() => {
    if (!packIds || packIds.length < 2) {
      navigate('/grammar/quiz', { replace: true });
    }
  }, [packIds, navigate]);

  // Build item lookup map from all selected packs
  const allItems = useMemo(() => {
    if (!packIds) return new Map<string, GrammarItem>();
    const map = new Map<string, GrammarItem>();
    for (const packId of packIds) {
      const pack = getPackById(packId);
      if (!pack) continue;
      for (const item of pack.items) {
        map.set(item.id, item);
      }
    }
    return map;
  }, [packIds]);

  // Flat items array for SessionSummary
  const allItemsArray = useMemo(() => Array.from(allItems.values()), [allItems]);

  // Start session on mount
  useEffect(() => {
    if (packIds && packIds.length >= 2 && grammarMode && !sessionStarted) {
      startQuizSession(packIds, grammarMode);
      setSessionStarted(true);
    }
  }, [packIds, grammarMode, startQuizSession, sessionStarted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  const currentItem = useMemo(() => {
    if (currentSession.isComplete || !currentSession.queue.length) return null;
    const itemId = currentSession.queue[currentSession.currentIndex];
    return allItems.get(itemId) ?? null;
  }, [allItems, currentSession]);

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
    if (packIds && grammarMode) {
      setSessionStarted(false);
    }
  }, [packIds, grammarMode]);

  // Reset session when retry is triggered
  useEffect(() => {
    if (!sessionStarted && packIds && packIds.length >= 2 && grammarMode) {
      startQuizSession(packIds, grammarMode);
      setSessionStarted(true);
    }
  }, [sessionStarted, packIds, grammarMode, startQuizSession]);

  const handleBack = useCallback(() => {
    navigate('/grammar/quiz');
  }, [navigate]);

  if (!packIds || !grammarMode) {
    return null;
  }

  if (!currentSession.queue.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-secondary">Loading...</p>
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
          className="text-sm text-secondary hover:text-primary"
        >
          ← Exit
        </button>
        <span className="text-sm font-medium text-secondary">
          Grammar Quiz —{' '}
          {grammarMode.charAt(0).toUpperCase() + grammarMode.slice(1)}
        </span>
        <span className="text-sm text-secondary">{progress}</span>
      </div>

      {/* Progress bar */}
      {!currentSession.isComplete && (
        <div className="w-full bg-surface-alt rounded-full h-2 mb-8">
          <div
            className="h-2 rounded-full bg-accent-rose transition-all duration-300"
            style={{
              width: `${(currentSession.currentIndex / currentSession.queue.length) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Exercise or Summary */}
      <div className="bg-surface rounded-lg shadow-soft-md p-6">
        {currentSession.isComplete ? (
          <SessionSummary
            results={currentSession.results}
            items={allItemsArray}
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
