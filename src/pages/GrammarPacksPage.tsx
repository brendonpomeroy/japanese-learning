import { Link } from 'react-router-dom';
import { useGrammar } from '../features/grammar/useGrammar';
import { grammarPacks } from '../features/grammar/grammarData';
import { computePackStats } from '../features/grammar/utils';
import { capitalize } from '../utils/helpers';

export const GrammarPacksPage = () => {
  const { state } = useGrammar();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Grammar Packs
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Focused grammar exercises to build sentence patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {grammarPacks.map(pack => {
          const stats = computePackStats(pack, state.progress);
          const totalSeen =
            stats.seenByMode.build +
            stats.seenByMode.correct +
            stats.seenByMode.fill;
          const totalPossible = stats.totalItems * pack.supportedModes.length;

          return (
            <Link
              key={pack.id}
              to={`/grammar/${pack.id}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {pack.title}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.totalItems} items
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {pack.subtitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {pack.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {pack.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {totalSeen > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {totalSeen} / {totalPossible}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-rose-500 transition-all duration-300"
                      style={{
                        width: `${(totalSeen / totalPossible) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-rose-500 dark:group-hover:text-rose-400">
                <span className="mr-1">
                  {pack.supportedModes.map(m => capitalize(m)).join(' / ')}
                </span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
