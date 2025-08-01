import React, { useState } from 'react';
import type { PhraseData } from '../types';

interface PhraseCardProps {
  phrase: PhraseData;
  onPlayAudio?: (text: string) => void;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase, onPlayAudio }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500 dark:border-blue-400">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{phrase.english}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Japanese:</span>
            <span className="text-lg font-japanese dark:text-gray-100">{phrase.japanese}</span>
            {onPlayAudio && (
              <button
                onClick={() => onPlayAudio(phrase.japanese)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-2"
                title="Play audio"
              >
                🔊
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Hiragana:</span>
            <span className="text-lg font-japanese dark:text-gray-100">{phrase.hiragana}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Romaji:</span>
            <span className="text-lg font-mono dark:text-gray-100">{phrase.romaji}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 italic">{phrase.explanation}</p>
      </div>

      <div className="border-t dark:border-gray-600 pt-4">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          <span>{showBreakdown ? '▼' : '▶'}</span>
          Word Breakdown
        </button>
        
        {showBreakdown && (
          <div className="mt-3 space-y-2">
            {Object.entries(phrase.word_breakdown).map(([word, meaning]) => (
              <div key={word} className="flex gap-3 text-sm">
                <span className="font-japanese font-medium text-gray-800 dark:text-gray-100 min-w-0 flex-shrink-0">
                  {word}
                </span>
                <span className="text-gray-600 dark:text-gray-300">{meaning}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhraseCard;
