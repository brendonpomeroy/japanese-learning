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
        ? 'bg-success/10 text-success'
        : 'bg-error/10 text-error'
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
