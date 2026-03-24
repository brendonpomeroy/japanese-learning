import React, { useState } from 'react';
import type { PhraseData } from '../types';

interface PhraseCardProps {
  phrase: PhraseData;
  onPlayAudio?: (text: string) => void;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase, onPlayAudio }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="bg-surface rounded-lg shadow-soft-md p-6 mb-4 border-l-4 border-accent-blue">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-primary mb-2">
          {phrase.english}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary font-medium">
              Japanese:
            </span>
            <span className="text-lg font-japanese text-primary">
              {phrase.japanese}
            </span>
            {onPlayAudio && (
              <button
                onClick={() => onPlayAudio(phrase.japanese)}
                className="text-accent-blue hover:text-accent-blue/80 ml-2"
                title="Play audio"
              >
                🔊
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary font-medium">
              Hiragana:
            </span>
            <span className="text-lg font-japanese text-primary">
              {phrase.hiragana}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary font-medium">
              Romaji:
            </span>
            <span className="text-lg font-mono text-primary">
              {phrase.romaji}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-secondary italic">
          {phrase.explanation}
        </p>
      </div>

      <div className="border-t border-border pt-4">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-2 text-accent-blue hover:text-accent-blue/80 font-medium"
        >
          <span>{showBreakdown ? '▼' : '▶'}</span>
          Word Breakdown
        </button>

        {showBreakdown && (
          <div className="mt-3 space-y-2">
            {Object.entries(phrase.word_breakdown).map(([word, meaning]) => (
              <div key={word} className="flex gap-3 text-sm">
                <span className="font-japanese font-medium text-primary min-w-0 flex-shrink-0">
                  {word}
                </span>
                <span className="text-secondary">
                  {meaning}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhraseCard;
