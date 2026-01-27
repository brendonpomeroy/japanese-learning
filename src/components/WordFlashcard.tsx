import React, { useState } from 'react';
import type { Word } from '../types';

interface WordFlashcardProps {
  word: Word;
  showRomaji: boolean;
  onNext: (correct: boolean) => void;
}

export const WordFlashcard: React.FC<WordFlashcardProps> = ({
  word,
  showRomaji,
  onNext,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleFlip = () => {
    if (!answered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setTimeout(() => {
      onNext(correct);
      setIsFlipped(false);
      setAnswered(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="perspective-1000 w-full h-96">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center border-2 border-blue-500">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Tap to reveal
              </p>
              <p className="text-6xl mb-6 font-japanese">
                {showRomaji ? word.hiragana : word.kana_kanji}
              </p>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center border-2 border-green-500 rotate-y-180">
            <div className="text-center space-y-3 w-full overflow-y-auto max-h-full">
              <div className="text-4xl mb-2 font-japanese">{word.kana_kanji}</div>
              {word.kana_kanji !== word.hiragana && (
                <div className="text-xl text-gray-600 dark:text-gray-400 font-japanese">
                  {word.hiragana}
                </div>
              )}
              <div className="text-lg text-gray-500 dark:text-gray-500">
                {word.romaji}
              </div>
              <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-2">
                {word.definition}
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Example:
                </p>
                <p className="text-base font-japanese">{word.example_sentence}</p>
              </div>
              <div className="flex gap-2 mt-2 justify-center">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  {word.difficulty}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {word.topic}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer buttons (only show when flipped) */}
      {isFlipped && !answered && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAnswer(false);
            }}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Need Practice
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAnswer(true);
            }}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Got It!
          </button>
        </div>
      )}

      {!isFlipped && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          Click the card to see the definition and example
        </p>
      )}
    </div>
  );
};
