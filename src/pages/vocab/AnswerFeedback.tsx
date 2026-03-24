import React from 'react';
import type { VocabWord } from '../../features/vocab/types';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  currentWord: VocabWord;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect,
  currentWord,
}) => (
  <div
    className={`mt-4 p-4 rounded-lg ${
      isCorrect
        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }`}
  >
    {isCorrect ? (
      <div className="font-semibold">Correct! ✓</div>
    ) : (
      <div>
        <div className="font-semibold mb-1">Incorrect</div>
        <div>
          Answer: <strong>{currentWord.kana_kanji}</strong> (
          {currentWord.hiragana})
        </div>
      </div>
    )}
  </div>
);
