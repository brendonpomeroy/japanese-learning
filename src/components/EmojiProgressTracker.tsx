import React from 'react';
import { useApp } from '../hooks/useApp';
import { getAllEmojis } from '../data/emojiData';

const EmojiProgressTracker: React.FC = () => {
  const { state } = useApp();
  const { emojiMastery, emojiExerciseHistory } = state.progress;

  const allEmojis = getAllEmojis();
  const totalEmojis = allEmojis.length;
  const masteredEmojis = Object.entries(emojiMastery).filter(
    ([, mastery]) => mastery >= 80
  ).length;

  const overallProgress =
    totalEmojis > 0 ? (masteredEmojis / totalEmojis) * 100 : 0;

  // Get recent emoji exercise activity
  const recentResults = emojiExerciseHistory.slice(-10).reverse();

  // Calculate overall success rate
  const totalCorrect = emojiExerciseHistory.filter(r => r.correct).length;
  const overallSuccessRate =
    emojiExerciseHistory.length > 0
      ? (totalCorrect / emojiExerciseHistory.length) * 100
      : 0;

  return (
    <div className="bg-surface rounded-lg shadow-soft-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Emoji Progress
      </h2>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary">
            Overall Mastery
          </span>
          <span className="text-sm font-medium text-secondary">
            {masteredEmojis}/{totalEmojis} ({overallProgress.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-surface-alt rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-accent-orange">
            {emojiExerciseHistory.length}
          </div>
          <div className="text-sm text-accent-orange">
            Total Attempts
          </div>
        </div>
        <div className="bg-success/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-success">
            {overallSuccessRate.toFixed(1)}%
          </div>
          <div className="text-sm text-success">
            Success Rate
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentResults.slice(0, 5).map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result.correct
                    ? 'bg-success/10 border border-green-200 dark:border-green-700'
                    : 'bg-error/10 border border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{result.emoji}</span>
                  <div>
                    <div className="text-sm font-medium text-primary">
                      {result.english}
                    </div>
                    <div className="text-xs text-secondary">
                      Mode: {result.displayMode}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    result.correct
                      ? 'text-success'
                      : 'text-error'
                  }`}
                >
                  {result.correct ? '✓' : '✗'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Mastered Emojis */}
      {Object.keys(emojiMastery).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">
            Top Mastered
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(emojiMastery)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([emoji, mastery]) => {
                const emojiData = allEmojis.find(e => e.emoji === emoji);
                return (
                  <div
                    key={emoji}
                    className="flex items-center justify-between p-2 bg-surface-alt rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-sm text-secondary">
                        {emojiData?.english || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-secondary">
                        {mastery.toFixed(0)}%
                      </div>
                      <div className="w-16 bg-surface-alt rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-orange-500"
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {emojiExerciseHistory.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-secondary mb-2">
            Start practicing to see your progress!
          </p>
          <p className="text-sm text-secondary">
            Your emoji vocabulary mastery will be tracked here.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmojiProgressTracker;
