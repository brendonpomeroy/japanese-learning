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
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
          Build the sentence:
        </p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {item.english}
        </p>
      </div>

      {/* Answer area */}
      <div
        className={`min-h-[4rem] p-4 rounded-lg border-2 border-dashed flex flex-wrap gap-2 items-center justify-center ${
          isAnswered
            ? isCorrect
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'border-red-400 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
        }`}
      >
        {placed.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500 text-sm">
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
                    ? 'bg-green-500 text-white'
                    : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700'
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
            className="px-4 py-2 rounded-lg font-medium text-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Check
          </button>
        </div>
      )}

      {isAnswered && isCorrect && (
        <p className="text-center text-green-500 font-medium">Correct!</p>
      )}

      {isAnswered && !isCorrect && (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Correct answer:{' '}
            <span className="font-bold text-green-500">{item.japanese}</span>
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {isAnswered && item.translationNotes.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
          {item.translationNotes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </div>
      )}
    </div>
  );
};
