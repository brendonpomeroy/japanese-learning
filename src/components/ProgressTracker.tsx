import React from 'react';
import { useApp } from '../hooks/useApp';
import { getAllHiragana } from '../data/hiraganaData';

const ProgressTracker: React.FC = () => {
  const { state } = useApp();
  const { progress } = state;

  const allCharacters = getAllHiragana();
  const totalCharacters = Object.keys(allCharacters).length;
  const masteredCharacters = Object.entries(progress.characterMastery).filter(
    ([, mastery]) => mastery >= 80
  ).length;

  const overallProgress =
    totalCharacters > 0 ? (masteredCharacters / totalCharacters) * 100 : 0;

  const recentResults = progress.exerciseHistory.slice(-10);
  const recentSuccessRate =
    recentResults.length > 0
      ? (recentResults.filter(r => r.correct).length / recentResults.length) *
        100
      : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 60) return 'text-warning';
    return 'text-error';
  };

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-surface rounded-lg shadow-soft-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Learning Progress
      </h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-accent-blue/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-accent-blue mb-2">
            Overall Progress
          </h3>
          <div className="flex items-center gap-3">
            <div
              className={`text-2xl font-bold text-accent-blue`}
            >
              {overallProgress.toFixed(1)}%
            </div>
            <div className="flex-1 bg-surface-alt rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 bg-accent-blue`}
                style={{
                  width: `${overallProgress > 0 ? overallProgress : 5}%`,
                }}
              />
            </div>
          </div>
          <p className="text-xs text-secondary mt-1">
            {masteredCharacters} of {totalCharacters} characters mastered
          </p>
        </div>

        <div className="bg-success/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-success mb-2">
            Recent Success Rate
          </h3>
          <div className="flex items-center gap-3">
            <div
              className={`text-2xl font-bold text-success`}
            >
              {recentSuccessRate.toFixed(1)}%
            </div>
            <div className="flex-1 bg-surface-alt rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 bg-success`}
                style={{ width: `${recentSuccessRate}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-secondary mt-1">
            Last {recentResults.length} exercises
          </p>
        </div>

        <div className="bg-accent-violet/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-accent-violet mb-2">
            Practice Streak
          </h3>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-accent-violet">
              {progress.streak}
            </div>
            <div className="text-sm text-secondary">
              {progress.streak === 1 ? 'day' : 'days'}
            </div>
          </div>
          <p className="text-xs text-secondary mt-1">
            Keep practicing daily!
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Character Mastery
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(progress.characterMastery)
            .sort(([, a], [, b]) => a - b)
            .map(([character, mastery]) => (
              <div
                key={character}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt"
              >
                <span className="text-xl font-japanese w-8 text-center text-primary">
                  {character}
                </span>
                <span className="text-sm text-secondary w-12">
                  {allCharacters[character as keyof typeof allCharacters]}
                </span>
                <div className="flex-1 bg-surface-alt rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(mastery)}`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-medium w-12 text-right ${getProgressColor(mastery)}`}
                >
                  {mastery.toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Recent Activity
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentResults.map((result, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt"
            >
              <span
                className={`text-sm font-medium ${result.correct ? 'text-success' : 'text-error'}`}
              >
                {result.correct ? '✓' : '✗'}
              </span>
              <span className="text-lg font-japanese text-primary">
                {result.character}
              </span>
              <span className="text-sm text-secondary">
                {result.romaji}
              </span>
              <div className="flex-1"></div>
              <span className="text-xs text-secondary">
                {(result.timeSpent / 1000).toFixed(1)}s
              </span>
            </div>
          ))}
          {recentResults.length === 0 && (
            <p className="text-secondary text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
