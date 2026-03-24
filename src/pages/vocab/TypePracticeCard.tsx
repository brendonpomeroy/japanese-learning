import React, { useState } from 'react';
import type { VocabWord, AnswerResult } from '../../features/vocab/types';
import { AnswerFeedback } from './AnswerFeedback';

interface TypePracticeCardProps {
  currentWord: VocabWord;
  showHint: boolean;
  showRomaji: boolean;
  onAnswer: (result: AnswerResult, isCorrect: boolean) => void;
  onNext: () => void;
}

export const TypePracticeCard: React.FC<TypePracticeCardProps> = ({
  currentWord,
  showHint,
  showRomaji,
  onAnswer,
  onNext,
}) => {
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const getHint = (): string => {
    if (currentWord.hiragana.length === 0) return '';
    const firstChar = currentWord.hiragana[0];
    return `${firstChar}... (${currentWord.hiragana.length} characters)`;
  };

  const handleSubmit = () => {
    if (userInput.trim() === '') return;

    const trimmed = userInput.trim();
    const correct =
      trimmed === currentWord.kana_kanji || trimmed === currentWord.hiragana;

    setIsAnswered(true);
    setIsCorrect(correct);
    onAnswer(correct ? 'good' : 'again', correct);

    if (correct) {
      setTimeout(() => {
        setIsAnswered(false);
        setUserInput('');
        onNext();
      }, 600);
    }
  };

  const handleGiveUp = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    onAnswer('again', false);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setUserInput('');
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

      {showHint && (
        <div className="text-sm text-secondary mb-4">
          Hint: {getHint()}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !isAnswered) {
              handleSubmit();
            }
          }}
          disabled={isAnswered}
          className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:ring-2 focus:ring-accent-blue disabled:opacity-50"
          placeholder="Type the word in hiragana or kanji..."
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isAnswered || userInput.trim() === ''}
            className="px-6 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
          {!isAnswered && (
            <button
              onClick={handleGiveUp}
              className="px-6 py-2 bg-muted hover:bg-muted/90 text-white rounded-lg font-medium transition-colors"
            >
              Give Up
            </button>
          )}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-success hover:bg-success/90 text-white rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {isAnswered && (
        <AnswerFeedback isCorrect={isCorrect} currentWord={currentWord} />
      )}
    </div>
  );
};
