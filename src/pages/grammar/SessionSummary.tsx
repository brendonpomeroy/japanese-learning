import React from 'react';
import type { SessionResult, GrammarItem } from '../../features/grammar/types';

interface SessionSummaryProps {
  results: SessionResult[];
  items: GrammarItem[];
  onRetry: () => void;
  onBack: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  results,
  items,
  onRetry,
  onBack,
}) => {
  const correctCount = results.filter(r => r.correct).length;
  const totalCount = results.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const incorrectResults = results.filter(r => !r.correct);
  const itemMap = new Map(items.map(item => [item.id, item]));

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Session Complete
        </h2>
        <div className="text-5xl font-bold mb-2">
          <span className={percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}>
            {percentage}%
          </span>
        </div>
        <p className="text-secondary">
          {correctCount} / {totalCount} correct
        </p>
      </div>

      {incorrectResults.length > 0 && (
        <div className="text-left bg-error/10 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="font-semibold text-error mb-3">
            Review these items:
          </h3>
          <ul className="space-y-2">
            {incorrectResults.map((result, i) => {
              const item = itemMap.get(result.itemId);
              if (!item) return null;
              return (
                <li key={i} className="text-sm">
                  <span className="text-secondary">
                    {item.english}
                  </span>
                  <span className="mx-2 text-secondary">→</span>
                  <span className="font-medium text-primary">
                    {item.japanese}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-surface-alt hover:bg-gray-300 dark:hover:bg-gray-600 text-secondary rounded-lg font-medium transition-colors"
        >
          Back to Pack
        </button>
      </div>
    </div>
  );
};
