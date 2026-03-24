import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmojiQuiz from '../components/EmojiQuiz';
import EmojiProgressTracker from '../components/EmojiProgressTracker';

export const EmojiPage: React.FC = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState<{
    score: number;
    total: number;
  } | null>(null);

  const handleQuizComplete = (score: number, total: number) => {
    setLastScore({ score, total });
    setShowResults(true);
    setShowQuiz(false);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setShowResults(false);
  };

  if (showQuiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowQuiz(false)}
            className="text-accent-blue hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-flex items-center"
          >
            ← Back to Emoji Quiz
          </button>
        </div>

        <EmojiQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="text-accent-blue hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-flex items-center"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-primary mb-4">
          Emoji Quiz
        </h1>
        <p className="text-lg text-secondary">
          Test your Japanese vocabulary through emoji recognition!
        </p>
      </div>

      {showResults && lastScore && (
        <div className="bg-success/10 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-success mb-2">
            Quiz Complete!
          </h2>
          <p className="text-success">
            You scored {lastScore.score} out of {lastScore.total} (
            {((lastScore.score / lastScore.total) * 100).toFixed(1)}%)
          </p>
          <button
            onClick={() => setShowResults(false)}
            className="mt-3 text-success hover:text-green-800 dark:hover:text-green-200 font-medium"
          >
            Take another quiz →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface rounded-lg shadow-soft-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              About Emoji Quiz
            </h2>
            <div className="space-y-4 text-secondary">
              <p>
                The emoji quiz helps you learn Japanese vocabulary through
                visual recognition. You'll see an emoji and need to choose the
                correct Japanese word.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">
                  Display Options:
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>漢字/カナ:</strong> Kanji and katakana characters
                  </li>
                  <li>
                    <strong>ひらがな:</strong> Hiragana phonetic characters
                  </li>
                  <li>
                    <strong>Romaji:</strong> Romanized pronunciation
                  </li>
                </ul>
              </div>
              <p>
                When you answer incorrectly, you'll see the complete translation
                including hiragana, kanji, and romaji to help you learn.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-soft-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Start Quiz
            </h2>
            <div className="text-center">
              <div className="text-6xl mb-6">🎯📝🎌</div>
              <button
                onClick={handleStartQuiz}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Emoji Quiz
              </button>
              <p className="text-sm text-secondary mt-4">
                10 random questions • Multiple choice format
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <EmojiProgressTracker />
        </div>
      </div>

      <div className="mt-8 bg-accent-blue/10 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-accent-blue mb-2">
          💡 Learning Tips
        </h3>
        <div className="text-accent-blue space-y-2">
          <p>
            • Pay attention to the full translations when you get answers wrong
          </p>
          <p>
            • Try to associate the visual emoji with the Japanese pronunciation
          </p>
          <p>• Practice regularly to build your vocabulary recognition</p>
          <p>
            • Focus on commonly used words first (animals, objects, emotions)
          </p>
        </div>
      </div>
    </div>
  );
};
