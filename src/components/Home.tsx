import { Link } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { getAllHiragana } from '../data/hiraganaData';
import { getAllEmojis } from '../data/emojiData';

function Home() {
  const { state } = useApp();
  const { progress } = state;

  const allCharacters = getAllHiragana();
  const totalCharacters = Object.keys(allCharacters).length;
  const masteredCharacters = Object.entries(progress.characterMastery).filter(
    ([, mastery]) => mastery >= 80
  ).length;

  const allEmojis = getAllEmojis();
  const totalEmojis = allEmojis.length;
  const masteredEmojis = Object.entries(progress.emojiMastery || {}).filter(
    ([, mastery]) => mastery >= 80
  ).length;

  const hiraganaProgress =
    totalCharacters > 0 ? (masteredCharacters / totalCharacters) * 100 : 0;
  const emojiProgress =
    totalEmojis > 0 ? (masteredEmojis / totalEmojis) * 100 : 0;
  const hasProgress =
    progress.exerciseHistory.length > 0 ||
    progress.emojiExerciseHistory?.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary mb-4">
          Japanese Lessons
        </h1>
        <p className="text-xl text-secondary mb-8">
          Master Japanese phrases and hiragana through interactive learning
        </p>

        {hasProgress && (
          <div className="bg-accent-blue/10 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-accent-blue mb-4">
              Your Progress
            </h3>

            {progress.exerciseHistory.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-accent-blue">
                    Hiragana
                  </span>
                  <span className="text-sm font-medium text-accent-blue">
                    {masteredCharacters}/{totalCharacters} (
                    {hiraganaProgress.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-accent-blue/20 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${hiraganaProgress}%` }}
                  />
                </div>
              </div>
            )}

            {progress.emojiExerciseHistory?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-accent-blue">
                    Emoji Vocabulary
                  </span>
                  <span className="text-sm font-medium text-accent-blue">
                    {masteredEmojis}/{totalEmojis} ({emojiProgress.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-accent-blue/20 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${emojiProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-accent-blue">
                  {progress.exerciseHistory.length +
                    (progress.emojiExerciseHistory?.length || 0)}
                </div>
                <div className="text-xs text-accent-blue">
                  Total Attempts
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent-blue">
                  {progress.streak || 0}
                </div>
                <div className="text-xs text-accent-blue">
                  Day Streak
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <Link
          to="/phrases"
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Phrases</h3>
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-blue-100 mb-4">
            Learn essential Japanese phrases for daily conversation
          </p>
          <div className="flex items-center text-blue-200 group-hover:text-white">
            <span className="mr-2">Start learning</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/hiragana"
          className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Hiragana</h3>
            <span className="text-3xl">ひ</span>
          </div>
          <p className="text-purple-100 mb-4">
            Master all hiragana characters with interactive exercises
          </p>
          <div className="flex items-center text-purple-200 group-hover:text-white">
            <span className="mr-2">Practice now</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/emoji"
          className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Emoji Quiz</h3>
            <span className="text-3xl">😊</span>
          </div>
          <p className="text-orange-100 mb-4">
            Learn Japanese words through fun emoji recognition
          </p>
          <div className="flex items-center text-orange-200 group-hover:text-white">
            <span className="mr-2">Take quiz</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/grammar"
          className="group bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg shadow-lg p-6 text-white hover:from-rose-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Grammar</h3>
            <span className="text-3xl">を</span>
          </div>
          <p className="text-rose-100 mb-4">
            Practice grammar patterns with focused sentence exercises
          </p>
          <div className="flex items-center text-rose-200 group-hover:text-white">
            <span className="mr-2">Start practice</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/practice"
          className="group bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Practice</h3>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-green-100 mb-4">
            Test your knowledge with quizzes and exercises
          </p>
          <div className="flex items-center text-green-200 group-hover:text-white">
            <span className="mr-2">Take quiz</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </div>

      <div className="bg-surface rounded-lg shadow-soft-md p-8">
        <h2 className="text-3xl font-bold text-primary mb-6">
          Learning Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-accent-blue/10 rounded-full p-3 flex-shrink-0">
              <span className="text-accent-blue text-xl">
                📚
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Comprehensive Phrases
              </h3>
              <p className="text-secondary">
                Learn categorized phrases with English, Japanese, hiragana, and
                romaji
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-accent-violet/10 rounded-full p-3 flex-shrink-0">
              <span className="text-accent-violet text-xl">
                ✍️
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Complete Hiragana
              </h3>
              <p className="text-secondary">
                All 46 basic characters plus dakuten, handakuten, and
                combinations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-accent-green/10 rounded-full p-3 flex-shrink-0">
              <span className="text-accent-green text-xl">
                🎮
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Interactive Exercises
              </h3>
              <p className="text-secondary">
                Multiple quiz types including recognition, production, and speed
                challenges
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-accent-orange/10 rounded-full p-3 flex-shrink-0">
              <span className="text-accent-orange text-xl">
                📊
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Progress Tracking
              </h3>
              <p className="text-secondary">
                Track your mastery level and success rates for each character
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
