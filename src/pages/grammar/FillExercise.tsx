import React, { useState, useMemo } from 'react';
import type { GrammarItem } from '../../features/grammar/types';
import { shuffle } from '../../utils/helpers';

interface FillExerciseProps {
  item: GrammarItem;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const FillExercise: React.FC<FillExerciseProps> = ({
  item,
  onAnswer,
  onNext,
}) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const fill = item.fill!;

  const shuffledOptions = useMemo(() => shuffle(fill.options), [fill.options]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    const correct = option === fill.answer;
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

  // Split prompt around the gap marker
  const parts = fill.promptJapanese.split('＿');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {item.english}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {parts[0]}
          <span className="inline-block mx-1 px-3 py-1 border-b-4 border-blue-400 dark:border-blue-500 min-w-[3rem] text-center">
            {isAnswered ? (
              <span
                className={isCorrect ? 'text-green-500' : 'text-red-500'}
              >
                {selectedOption}
              </span>
            ) : (
              <span className="text-blue-400 dark:text-blue-500">?</span>
            )}
          </span>
          {parts[1]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {shuffledOptions.map(option => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === fill.answer;
          const showResult = isAnswered && (isSelected || isCorrectOption);

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`px-6 py-3 rounded-lg font-medium text-xl transition-colors ${
                showResult
                  ? isCorrectOption
                    ? 'bg-green-500 text-white'
                    : isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && !isCorrect && (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Correct answer: <span className="font-bold text-green-500">{item.japanese}</span>
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {isAnswered && isCorrect && (
        <p className="text-center text-green-500 font-medium">Correct!</p>
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
