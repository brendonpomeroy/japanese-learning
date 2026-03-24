import React, { useMemo } from 'react';
import { vocabWords, getTopics } from '../../features/vocab/vocabData';
import type { WordProgress } from '../../features/vocab/types';
import { capitalize } from '../../utils/helpers';

interface MasteryDashboardProps {
  wordProgress: Record<string, WordProgress>;
}

export const MasteryDashboard: React.FC<MasteryDashboardProps> = ({
  wordProgress,
}) => {
  const topics = useMemo(() => getTopics(), []);

  const { topicMastery, needPractice } = useMemo(() => {
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
        const progress = wordProgress[word.word];
        if (progress) {
          const mastery =
            progress.seen > 0 ? progress.correct / progress.seen : 0;
          totalMastery += mastery;
          if (progress.seen >= 3 && mastery >= 0.8) {
            learnedCount++;
          }
        }
      });

      topicMastery.push({
        topic,
        mastery: totalMastery / topicWords.length,
        learned: learnedCount,
        total: topicWords.length,
      });
    });

    topicMastery.sort((a, b) => b.mastery - a.mastery);

    const needPractice = vocabWords
      .map((word) => {
        const progress = wordProgress[word.word];
        if (!progress || progress.seen < 1) return null;

        const needScore =
          ((progress.incorrect + 1) / (progress.correct + 1)) *
          (1 / (progress.seen + 0.5));
        const mastery =
          progress.seen > 0 ? progress.correct / progress.seen : 0;

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
  }, [topics, wordProgress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Topic Mastery */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Topic Mastery
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {topicMastery.map((tm) => (
            <div
              key={tm.topic}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {capitalize(tm.topic)}
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
          {needPractice.length > 0 ? (
            needPractice.map((item) => (
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
                    {Math.round(item.mastery * 100)}% mastery ({item.correct}/
                    {item.seen})
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
  );
};
