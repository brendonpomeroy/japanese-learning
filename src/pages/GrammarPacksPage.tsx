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
        <h1 className="text-4xl font-bold text-primary mb-2">Grammar Packs</h1>
        <p className="text-secondary">
          Focused grammar exercises to build sentence patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link
          to="/grammar/quiz"
          className="group md:col-span-2 lg:col-span-3 bg-gradient-to-r from-accent-rose/10 to-accent-blue/10 rounded-lg shadow-soft-md p-6 hover:shadow-soft-lg transition-all duration-200 transform hover:scale-[1.02] border-2 border-accent-rose/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                Grammar Quiz
              </h2>
              <p className="text-secondary text-sm">
                Mix items from multiple packs for a real challenge
              </p>
            </div>
            <span className="text-2xl transform group-hover:translate-x-1 transition-transform text-accent-rose">
              →
            </span>
          </div>
        </Link>

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
              className="group bg-surface rounded-lg shadow-soft-md p-6 hover:shadow-soft-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-3xl font-bold text-primary">
                  {pack.title}
                </h2>
                <span className="text-sm text-secondary">
                  {stats.totalItems} items
                </span>
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">
                {pack.subtitle}
              </h3>
              <p className="text-secondary text-sm mb-4">{pack.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {pack.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {totalSeen > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span>Progress</span>
                    <span>
                      {totalSeen} / {totalPossible}
                    </span>
                  </div>
                  <div className="w-full bg-surface-alt rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-accent-rose transition-all duration-300"
                      style={{
                        width: `${(totalSeen / totalPossible) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center text-sm text-secondary group-hover:text-accent-rose">
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
