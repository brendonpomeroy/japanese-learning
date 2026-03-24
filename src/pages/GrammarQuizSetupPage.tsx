import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPacksWithMode, getItemsForPacks } from '../features/grammar/grammarData';
import type { GrammarMode } from '../features/grammar/types';
import { capitalize } from '../utils/helpers';

const quizModes: Array<'fill' | 'correct'> = ['fill', 'correct'];

export const GrammarQuizSetupPage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'fill' | 'correct'>('fill');
  const [selectedPackIds, setSelectedPackIds] = useState<Set<string>>(new Set());

  const availablePacks = useMemo(
    () => getPacksWithMode(selectedMode),
    [selectedMode]
  );

  const totalItems = useMemo(() => {
    if (selectedPackIds.size === 0) return 0;
    return getItemsForPacks(Array.from(selectedPackIds), selectedMode).length;
  }, [selectedPackIds, selectedMode]);

  const handleModeChange = (mode: 'fill' | 'correct') => {
    setSelectedMode(mode);
    // Remove any selected packs that don't support the new mode
    const newPacks = getPacksWithMode(mode);
    const newPackIds = new Set<string>();
    for (const id of selectedPackIds) {
      if (newPacks.some(p => p.id === id)) {
        newPackIds.add(id);
      }
    }
    setSelectedPackIds(newPackIds);
  };

  const togglePack = (packId: string) => {
    setSelectedPackIds(prev => {
      const next = new Set(prev);
      if (next.has(packId)) {
        next.delete(packId);
      } else {
        next.add(packId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedPackIds.size === availablePacks.length) {
      setSelectedPackIds(new Set());
    } else {
      setSelectedPackIds(new Set(availablePacks.map(p => p.id)));
    }
  };

  const handleStart = () => {
    navigate(`/grammar/quiz/${selectedMode}`, {
      state: { packIds: Array.from(selectedPackIds) },
    });
  };

  const canStart = selectedPackIds.size >= 2;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        to="/grammar"
        className="text-sm text-secondary hover:text-primary mb-6 inline-block"
      >
        ← Back to Grammar Packs
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Grammar Quiz</h1>
        <p className="text-secondary">
          Mix items from multiple packs for a real challenge
        </p>
      </div>

      {/* Mode picker */}
      <div className="flex gap-2 justify-center mb-8">
        {quizModes.map(mode => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedMode === mode
                ? 'bg-accent-blue text-white'
                : 'bg-surface-alt text-secondary hover:bg-border'
            }`}
          >
            {capitalize(mode)}
          </button>
        ))}
      </div>

      {/* Pack selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-primary">Select Packs</h2>
          <button
            onClick={toggleAll}
            className="text-sm text-accent-blue hover:text-accent-blue/80"
          >
            {selectedPackIds.size === availablePacks.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
        </div>

        <div className="space-y-2">
          {availablePacks.map(pack => {
            const isSelected = selectedPackIds.has(pack.id);
            return (
              <button
                key={pack.id}
                onClick={() => togglePack(pack.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  isSelected
                    ? 'bg-accent-blue/10 ring-2 ring-accent-blue'
                    : 'bg-surface hover:bg-surface-alt'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-accent-blue border-accent-blue'
                      : 'border-secondary'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">
                      {pack.title}
                    </span>
                    <span className="text-sm text-secondary">
                      {pack.subtitle}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-secondary flex-shrink-0">
                  {pack.items.length} items
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <div className="text-center space-y-2">
        {selectedPackIds.size > 0 && (
          <p className="text-sm text-secondary">
            {totalItems} items from {selectedPackIds.size} pack
            {selectedPackIds.size !== 1 ? 's' : ''}
          </p>
        )}
        {selectedPackIds.size === 1 && (
          <p className="text-xs text-warning">
            Select at least 2 packs to start a quiz
          </p>
        )}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
            canStart
              ? 'bg-accent-rose text-white hover:bg-accent-rose/80'
              : 'bg-surface-alt text-secondary cursor-not-allowed'
          }`}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};
