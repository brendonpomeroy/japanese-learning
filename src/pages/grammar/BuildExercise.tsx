import React, { useState, useMemo } from 'react';
import type { GrammarItem } from '../../features/grammar/types';
import { checkBuildAnswer } from '../../features/grammar/utils';
import { shuffle } from '../../utils/helpers';

interface BuildExerciseProps {
  item: GrammarItem;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const BuildExercise: React.FC<BuildExerciseProps> = ({
  item,
  onAnswer,
  onNext,
}) => {
  const build = item.build!;

  const allTiles = useMemo(
    () => shuffle([...item.tokens, ...build.distractors]),
    [item.tokens, build.distractors]
  );

  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(allTiles);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleTileClick = (tile: string, index: number) => {
    if (isAnswered) return;
    setPlaced([...placed, tile]);
    setAvailable(available.filter((_, i) => i !== index));
  };

  const handlePlacedClick = (tile: string, index: number) => {
    if (isAnswered) return;
    setAvailable([...available, tile]);
    setPlaced(placed.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const correct = checkBuildAnswer(placed, item.tokens);
    setIsAnswered(true);
    setIsCorrect(correct);
    onAnswer(correct);

    if (correct) {
      setTimeout(() => {
        onNext();
      }, 600);
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg text-secondary mb-1">
          Build the sentence:
        </p>
        <p className="text-xl font-semibold text-primary">
          {item.english}
        </p>
      </div>

      {/* Answer area */}
      <div
        className={`min-h-[4rem] p-4 rounded-lg border-2 border-dashed flex flex-wrap gap-2 items-center justify-center ${
          isAnswered
            ? isCorrect
              ? 'border-success bg-success/10'
              : 'border-error bg-error/10'
            : 'border-border bg-surface-alt'
        }`}
      >
        {placed.length === 0 ? (
          <span className="text-secondary text-sm">
            Tap tiles below to build the sentence
          </span>
        ) : (
          placed.map((tile, index) => (
            <button
              key={`placed-${index}`}
              onClick={() => handlePlacedClick(tile, index)}
              disabled={isAnswered}
              className={`px-4 py-2 rounded-lg font-medium text-lg transition-colors ${
                isAnswered
                  ? isCorrect
                    ? 'bg-success text-white'
                    : 'bg-error/20 text-error'
                  : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
              } disabled:cursor-not-allowed`}
            >
              {tile}
            </button>
          ))
        )}
      </div>

      {/* Available tiles */}
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((tile, index) => (
          <button
            key={`available-${index}`}
            onClick={() => handleTileClick(tile, index)}
            disabled={isAnswered}
            className="px-4 py-2 rounded-lg font-medium text-lg bg-surface-alt text-secondary hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tile}
          </button>
        ))}
      </div>

      {/* Check / Next buttons */}
      {!isAnswered && placed.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleCheck}
            className="px-8 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
          >
            Check
          </button>
        </div>
      )}

      {isAnswered && isCorrect && (
                <p className="text-center text-success font-medium">Correct!</p>
      )}

      {isAnswered && !isCorrect && (
        <div className="text-center space-y-3">
          <p className="text-sm text-secondary">
            Correct answer:{' '}
                        <span className="font-bold text-success">{item.japanese}</span>
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-success hover:bg-success/80 text-white rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {isAnswered && item.translationNotes.length > 0 && (
        <div className="text-center text-sm text-secondary italic">
          {item.translationNotes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </div>
      )}
    </div>
  );
};
