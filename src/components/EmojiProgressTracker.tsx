import React from 'react';
import { useApp } from '../hooks/useApp';
import { getAllEmojis } from '../data/emojiData';

const EmojiProgressTracker: React.FC = () => {
  const { state } = useApp();
  const { emojiMastery, emojiSuccessRates, emojiExerciseHistory } = state.progress;
  
  const allEmojis = getAllEmojis();
  const totalEmojis = allEmojis.length;
  const masteredEmojis = Object.entries(emojiMastery)
    .filter(([, mastery]) => mastery >= 80)
    .length;
  
  const overallProgress = totalEmojis > 0 ? (masteredEmojis / totalEmojis) * 100 : 0;
  
  // Get recent emoji exercise activity
  const recentResults = emojiExerciseHistory
    .slice(-10)
    .reverse();
  
  // Calculate overall success rate
  const totalCorrect = emojiExerciseHistory.filter(r => r.correct).length;
  const overallSuccessRate = emojiExerciseHistory.length > 0 
    ? (totalCorrect / emojiExerciseHistory.length) * 100 
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Emoji Progress</h2>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Mastery</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {masteredEmojis}/{totalEmojis} ({overallProgress.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {emojiExerciseHistory.length}
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-300">Total Attempts</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {overallSuccessRate.toFixed(1)}%
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Success Rate</div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {recentResults.slice(0, 5).map((result, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result.correct 
                    ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
                    : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{result.emoji}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {result.english}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Mode: {result.displayMode}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  result.correct 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
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
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Top Mastered</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(emojiMastery)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([emoji, mastery]) => {
                const emojiData = allEmojis.find(e => e.emoji === emoji);
                const successRate = emojiSuccessRates[emoji] || 0;
                return (
                  <div key={emoji} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {emojiData?.english || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {mastery.toFixed(0)}%
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
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
          <p className="text-gray-600 dark:text-gray-400 mb-2">Start practicing to see your progress!</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Your emoji vocabulary mastery will be tracked here.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmojiProgressTracker;
