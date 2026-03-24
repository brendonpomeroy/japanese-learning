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
    <div className="border-t border-border pt-4">
      <div className="text-lg font-semibold text-primary mb-2">
        {currentWord.definition}
      </div>
      {showRomaji && (
        <div className="text-sm text-secondary mb-2">
          {currentWord.romaji}
        </div>
      )}
      <div className="text-sm text-secondary italic mb-4">
        {currentWord.example_sentence}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {mcqOptions.map(option => {
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
                      ? 'bg-success text-white'
                      : isSelected
                        ? 'bg-error text-white'
                        : 'bg-surface-alt text-secondary'
                    : 'bg-surface-alt text-secondary hover:bg-border'
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
            className="w-full px-6 py-2 bg-success hover:bg-success/90 text-white rounded-lg font-medium transition-colors"
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
