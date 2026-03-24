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
                <div className="w-full bg-accent-blue/20 rounded-full h-2 progress-track">
                  <div
                    className="h-2 rounded-full bg-accent-violet transition-all duration-300"
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
                <div className="w-full bg-accent-blue/20 rounded-full h-2 progress-track">
                  <div
                    className="h-2 rounded-full bg-accent-orange transition-all duration-300"
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
                <div className="text-xs text-accent-blue">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent-blue">
                  {progress.streak || 0}
                </div>
                <div className="text-xs text-accent-blue">Day Streak</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <Link
          to="/phrases"
          className="group gradient-card bg-gradient-to-br from-blue-500 to-blue-600 gradient-blue rounded-lg shadow-soft-lg p-6 text-white hover:brightness-105 transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
        >
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Phrases</h3>
            <span className="text-3xl">💬</span>
          </div>
          <p className="relative z-10 text-white/80 mb-4">
            Learn essential Japanese phrases for daily conversation
          </p>
          <div className="relative z-10 flex items-center text-white/70 group-hover:text-white cta-chip w-fit">
            <span className="mr-2">Start learning</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/hiragana"
          className="group gradient-card bg-gradient-to-br from-purple-500 to-purple-600 gradient-purple rounded-lg shadow-soft-lg p-6 text-white hover:brightness-105 transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
        >
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Hiragana</h3>
            <span className="text-3xl">ひ</span>
          </div>
          <p className="relative z-10 text-white/80 mb-4">
            Master all hiragana characters with interactive exercises
          </p>
          <div className="relative z-10 flex items-center text-white/70 group-hover:text-white cta-chip w-fit">
            <span className="mr-2">Practice now</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/emoji"
          className="group gradient-card bg-gradient-to-br from-orange-500 to-orange-600 gradient-orange rounded-lg shadow-soft-lg p-6 text-white hover:brightness-105 transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
        >
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Emoji Quiz</h3>
            <span className="text-3xl">😊</span>
          </div>
          <p className="relative z-10 text-white/80 mb-4">
            Learn Japanese words through fun emoji recognition
          </p>
          <div className="relative z-10 flex items-center text-white/70 group-hover:text-white cta-chip w-fit">
            <span className="mr-2">Take quiz</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/grammar"
          className="group gradient-card bg-gradient-to-br from-rose-500 to-rose-600 gradient-rose rounded-lg shadow-soft-lg p-6 text-white hover:brightness-105 transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
        >
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Grammar</h3>
            <span className="text-3xl">を</span>
          </div>
          <p className="relative z-10 text-white/80 mb-4">
            Practice grammar patterns with focused sentence exercises
          </p>
          <div className="relative z-10 flex items-center text-white/70 group-hover:text-white cta-chip w-fit">
            <span className="mr-2">Start practice</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          to="/practice"
          className="group gradient-card bg-gradient-to-br from-green-500 to-green-600 gradient-green rounded-lg shadow-soft-lg p-6 text-white hover:brightness-105 transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
        >
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Practice</h3>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="relative z-10 text-white/80 mb-4">
            Test your knowledge with quizzes and exercises
          </p>
          <div className="relative z-10 flex items-center text-white/70 group-hover:text-white cta-chip w-fit">
            <span className="mr-2">Take quiz</span>
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-soft-md p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Learning Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 bg-surface-alt rounded-lg p-4">
            <div className="bg-border-light rounded-md p-3 flex-shrink-0">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary mb-1">
                Comprehensive Phrases
              </h3>
              <p className="text-sm text-secondary">
                Learn categorized phrases with English, Japanese, hiragana, and
                romaji
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-surface-alt rounded-lg p-4">
            <div className="bg-border-light rounded-md p-3 flex-shrink-0">
              <span className="text-xl">✍️</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary mb-1">
                Complete Hiragana
              </h3>
              <p className="text-sm text-secondary">
                All 46 basic characters plus dakuten, handakuten, and
                combinations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-surface-alt rounded-lg p-4">
            <div className="bg-border-light rounded-md p-3 flex-shrink-0">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary mb-1">
                Interactive Exercises
              </h3>
              <p className="text-sm text-secondary">
                Multiple quiz types including recognition, production, and speed
                challenges
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-surface-alt rounded-lg p-4">
            <div className="bg-border-light rounded-md p-3 flex-shrink-0">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary mb-1">
                Progress Tracking
              </h3>
              <p className="text-sm text-secondary">
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
