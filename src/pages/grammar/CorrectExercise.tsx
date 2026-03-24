import React, { useState, useMemo } from 'react';
import type { GrammarItem } from '../../features/grammar/types';
import { shuffle } from '../../utils/helpers';

interface CorrectExerciseProps {
  item: GrammarItem;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const CorrectExercise: React.FC<CorrectExerciseProps> = ({
  item,
  onAnswer,
  onNext,
}) => {
  const correct = item.correct!;

  // Find the wrong token by comparing incorrect vs correct sentences token by token
  // We tokenize by matching against the known correct tokens
  const { incorrectTokens, wrongIndex, correctToken } = useMemo(() => {
    // Split the incorrect sentence into tokens by finding what differs
    // Strategy: the incorrect sentence replaces one token, so find it
    const incorrectStr = correct.incorrectJapanese;

    // Try to tokenize by matching the correct tokens against the incorrect string
    // and finding where they diverge
    const tokens = item.tokens;
    const incTokens: string[] = [];
    let remaining = incorrectStr.replace('。', '').replace(/ /g, '');
    let wrongIdx = -1;
    let correctTok = '';

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (remaining.startsWith(tok)) {
        incTokens.push(tok);
        remaining = remaining.slice(tok.length);
      } else {
        // This token differs — find what was substituted
        // Try common particles and the remaining string
        wrongIdx = i;
        correctTok = tok;
        // The wrong token is whatever is in `remaining` that's not the rest of the correct tokens
        const restCorrect = tokens
          .slice(i + 1)
          .join('')
          .replace('。', '');
        const wrongTok = remaining.slice(
          0,
          remaining.length - restCorrect.length
        );
        incTokens.push(wrongTok);
        remaining = remaining.slice(wrongTok.length);
      }
    }

    return {
      incorrectTokens: incTokens,
      wrongIndex: wrongIdx,
      correctToken: correctTok,
    };
  }, [correct.incorrectJapanese, item.tokens]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generate replacement options: correct token + some distractors
  const replacementOptions = useMemo(() => {
    if (selectedIndex === null) return [];
    const wrongToken = incorrectTokens[selectedIndex];
    const options = new Set([correctToken, wrongToken]);
    // Add some particle distractors
    const particles = ['は', 'が', 'を', 'に', 'で', 'も', 'と', 'へ'];
    for (const p of particles) {
      if (options.size >= 4) break;
      options.add(p);
    }
    return shuffle(Array.from(options));
  }, [selectedIndex, incorrectTokens, correctToken]);

  const handleTokenClick = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
  };

  const handleReplacementClick = (replacement: string) => {
    if (isAnswered || selectedIndex === null) return;

    const pickedCorrectToken = selectedIndex === wrongIndex && replacement === correctToken;
    setIsAnswered(true);
    setIsCorrect(pickedCorrectToken);
    onAnswer(pickedCorrectToken);

    if (pickedCorrectToken) {
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
          Find and fix the mistake:
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {item.english}
        </p>
      </div>

      {/* Incorrect sentence as tappable tokens */}
      <div className="flex flex-wrap gap-2 justify-center">
        {incorrectTokens.map((token, index) => {
          const isSelected = selectedIndex === index;
          const showWrong = isAnswered && index === wrongIndex;
          const showCorrected = isAnswered && isCorrect && index === wrongIndex;

          return (
            <button
              key={index}
              onClick={() => handleTokenClick(index)}
              disabled={isAnswered}
              className={`px-4 py-2 rounded-lg font-medium text-xl transition-colors ${
                showCorrected
                  ? 'bg-green-500 text-white'
                  : showWrong && !isCorrect
                    ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 ring-2 ring-red-500'
                    : isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } disabled:cursor-not-allowed`}
            >
              {showCorrected ? correctToken : token}
            </button>
          );
        })}
        <span className="px-1 py-2 text-xl text-gray-700 dark:text-gray-300">。</span>
      </div>

      {/* Replacement options */}
      {selectedIndex !== null && !isAnswered && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Replace with:
          </p>
          <div className="flex gap-2 justify-center">
            {replacementOptions.map(option => (
              <button
                key={option}
                onClick={() => handleReplacementClick(option)}
                className="px-5 py-2 rounded-lg font-medium text-lg bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
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
