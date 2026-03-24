import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGrammar } from '../features/grammar/useGrammar';
import { getPackById } from '../features/grammar/grammarData';
import { computePackStats } from '../features/grammar/utils';
import { capitalize } from '../utils/helpers';
import type { GrammarMode } from '../features/grammar/types';

const modeDescriptions: Record<GrammarMode, string> = {
  build: 'Construct sentences from word tiles',
  correct: 'Find and fix the grammar mistake',
  fill: 'Choose the missing particle',
};

export const GrammarPackDetailPage = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { state, resetPackProgress } = useGrammar();

  const pack = packId ? getPackById(packId) : undefined;

  if (!pack) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Pack not found
        </h1>
        <Link
          to="/grammar"
          className="text-accent-blue hover:text-accent-blue/80 underline"
        >
          Back to Grammar Packs
        </Link>
      </div>
    );
  }

  const stats = computePackStats(pack, state.progress);

  const handleReset = () => {
    if (window.confirm('Reset all progress for this pack?')) {
      resetPackProgress(pack.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        to="/grammar"
        className="text-sm text-secondary hover:text-primary mb-6 inline-block"
      >
        ← Back to Grammar Packs
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-primary mb-2">
          {pack.title}
        </h1>
        <h2 className="text-xl text-secondary mb-2">
          {pack.subtitle}
        </h2>
        <p className="text-secondary">{pack.description}</p>
        <div className="flex flex-wrap gap-1 justify-center mt-3">
          {pack.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {pack.supportedModes.map(mode => {
          const seen = stats.seenByMode[mode];
          const correctCount = stats.correctByMode[mode];

          return (
            <button
              key={mode}
              onClick={() => navigate(`/grammar/${pack.id}/${mode}`)}
              className="w-full bg-surface rounded-lg shadow-soft-md p-5 text-left hover:shadow-soft-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-primary">
                  {capitalize(mode)}
                </h3>
                {seen > 0 && (
                  <span className="text-sm text-secondary">
                    {correctCount}/{stats.totalItems} mastered
                  </span>
                )}
              </div>
              <p className="text-sm text-secondary mb-3">
                {modeDescriptions[mode]}
              </p>
              {seen > 0 && (
                <div className="w-full bg-surface-alt rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-accent-rose transition-all duration-300"
                    style={{
                      width: `${(seen / stats.totalItems) * 100}%`,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={handleReset}
          className="text-sm text-error hover:text-error/80 underline"
        >
          Reset progress for this pack
        </button>
      </div>
    </div>
  );
};
