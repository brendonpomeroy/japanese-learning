import React, { useState } from 'react';
import type { VocabWord, AnswerResult } from '../../features/vocab/types';
import { AnswerFeedback } from './AnswerFeedback';

interface McqPracticeCardProps {
  currentWord: VocabWord;
  mcqOptions: VocabWord[];
  showRomaji: boolean;
  onAnswer: (result: AnswerResult, isCorrect: boolean) => void;
  onNext: () => void;
}

export const McqPracticeCard: React.FC<McqPracticeCardProps> = ({
  currentWord,
  mcqOptions,
  showRomaji,
  onAnswer,
  onNext,
}) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (selectedWord: VocabWord) => {
    if (isAnswered) return;

    setSelectedOption(selectedWord.word);
    const correct = selectedWord.word === currentWord.word;
    setIsAnswered(true);
    setIsCorrect(correct);
    onAnswer(correct ? 'good' : 'again', correct);

    if (correct) {
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedOption(null);
        onNext();
      }, 600);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    onNext();
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {currentWord.definition}
      </div>
      {showRomaji && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {currentWord.romaji}
        </div>
      )}
      <div className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
        {currentWord.example_sentence}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {mcqOptions.map((option) => {
            const isSelected = selectedOption === option.word;
            const isCorrectOption = option.word === currentWord.word;
            const showResult = isAnswered && (isSelected || isCorrectOption);

            return (
              <button
                key={option.word}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={`px-6 py-3 rounded-lg font-medium transition-colors text-left ${
                  showResult
                    ? isCorrectOption
                      ? 'bg-green-500 text-white'
                      : isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option.kana_kanji}
              </button>
            );
          })}
        </div>
        {isAnswered && !isCorrect && (
          <button
            onClick={handleNext}
            className="w-full px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        )}
      </div>

      {isAnswered && (
        <AnswerFeedback isCorrect={isCorrect} currentWord={currentWord} />
      )}
    </div>
  );
};
