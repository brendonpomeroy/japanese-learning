import React from 'react';
import { useApp } from '../hooks/useApp';
import { getAllHiragana } from '../data/hiraganaData';

const ProgressTracker: React.FC = () => {
  const { state } = useApp();
  const { progress } = state;
  
  const allCharacters = getAllHiragana();
  const totalCharacters = Object.keys(allCharacters).length;
  const masteredCharacters = Object.entries(progress.characterMastery)
    .filter(([, mastery]) => mastery >= 80)
    .length;
  
  const overallProgress = totalCharacters > 0 ? (masteredCharacters / totalCharacters) * 100 : 0;
  
  const recentResults = progress.exerciseHistory.slice(-10);
  const recentSuccessRate = recentResults.length > 0 
    ? (recentResults.filter(r => r.correct).length / recentResults.length) * 100 
    : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Overall Progress</h3>
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>
              {overallProgress.toFixed(1)}%
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(overallProgress)}`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {masteredCharacters} of {totalCharacters} characters mastered
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2">Recent Success Rate</h3>
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${getProgressColor(recentSuccessRate)}`}>
              {recentSuccessRate.toFixed(1)}%
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(recentSuccessRate)}`}
                style={{ width: `${recentSuccessRate}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Last {recentResults.length} exercises
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Practice Streak</h3>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-purple-600">
              {progress.streak}
            </div>
            <div className="text-sm text-gray-600">
              {progress.streak === 1 ? 'day' : 'days'}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Keep practicing daily!
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Character Mastery</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(progress.characterMastery)
            .sort(([, a], [, b]) => a - b)
            .map(([character, mastery]) => (
              <div key={character} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="text-xl font-japanese w-8 text-center">{character}</span>
                <span className="text-sm text-gray-600 w-12">{allCharacters[character as keyof typeof allCharacters]}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(mastery)}`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-12 text-right ${getProgressColor(mastery)}`}>
                  {mastery.toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentResults.map((result, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <span className={`text-sm font-medium ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
                {result.correct ? '✓' : '✗'}
              </span>
              <span className="text-lg font-japanese">{result.character}</span>
              <span className="text-sm text-gray-600">{result.romaji}</span>
              <div className="flex-1"></div>
              <span className="text-xs text-gray-500">
                {(result.timeSpent / 1000).toFixed(1)}s
              </span>
            </div>
          ))}
          {recentResults.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
