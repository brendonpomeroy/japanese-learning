import { Link } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { getAllHiragana } from '../data/hiraganaData';

function Home() {
  const { state } = useApp();
  const { progress } = state;
  
  const allCharacters = getAllHiragana();
  const totalCharacters = Object.keys(allCharacters).length;
  const masteredCharacters = Object.entries(progress.characterMastery)
    .filter(([, mastery]) => mastery >= 80)
    .length;
  
  const overallProgress = totalCharacters > 0 ? (masteredCharacters / totalCharacters) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">Japanese Lessons</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Master Japanese phrases and hiragana through interactive learning</p>
        
        {progress.exerciseHistory.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Your Progress</h3>
            <div className="flex items-center gap-3 justify-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {overallProgress.toFixed(1)}%
              </div>
              <div className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
              {masteredCharacters} of {totalCharacters} characters mastered
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Link 
          to="/phrases" 
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Phrases</h3>
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-blue-100 mb-4">Learn essential Japanese phrases for daily conversation</p>
          <div className="flex items-center text-blue-200 group-hover:text-white">
            <span className="mr-2">Start learning</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
          <p className="text-purple-100 mb-4">Master all hiragana characters with interactive exercises</p>
          <div className="flex items-center text-purple-200 group-hover:text-white">
            <span className="mr-2">Practice now</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
          <p className="text-green-100 mb-4">Test your knowledge with quizzes and exercises</p>
          <div className="flex items-center text-green-200 group-hover:text-white">
            <span className="mr-2">Take quiz</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Learning Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-xl">📚</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Comprehensive Phrases</h3>
              <p className="text-gray-600 dark:text-gray-300">Learn categorized phrases with English, Japanese, hiragana, and romaji</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3 flex-shrink-0">
              <span className="text-purple-600 dark:text-purple-400 text-xl">✍️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Complete Hiragana</h3>
              <p className="text-gray-600 dark:text-gray-300">All 46 basic characters plus dakuten, handakuten, and combinations</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 flex-shrink-0">
              <span className="text-green-600 dark:text-green-400 text-xl">🎮</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Interactive Exercises</h3>
              <p className="text-gray-600 dark:text-gray-300">Multiple quiz types including recognition, production, and speed challenges</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3 flex-shrink-0">
              <span className="text-yellow-600 dark:text-yellow-400 text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your mastery level and success rates for each character</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
