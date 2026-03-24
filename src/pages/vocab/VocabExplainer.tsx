import React, { useState } from 'react';

export const VocabExplainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface rounded-lg shadow-soft-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left text-secondary hover:bg-surface-alt rounded-lg transition-colors"
      >
        <span className="font-medium">How does Vocab Practice work?</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4 text-sm text-secondary">
          <div>
            <h3 className="font-semibold text-primary mb-1">Practice Modes</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Type It</strong> — Type the Japanese word in hiragana or
                kanji. Enable hints to see the first character and length.
              </li>
              <li>
                <strong>Pick 1 of 3</strong> — Choose the correct answer from
                three multiple-choice options.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-1">
              Smart Word Selection
            </h3>
            <p>
              Words you haven't seen yet are introduced first. After that, the
              system prioritizes words you've struggled with most — so you spend
              more time on what you need to practice.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-1">
              Mastery & Progress
            </h3>
            <p>
              Each word tracks how many times you've seen it and how often you
              got it right. A word is considered "learned" once you've practiced
              it at least 3 times with 80% or higher accuracy. Your progress is
              saved automatically and persists between sessions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-1">
              Filters & Settings
            </h3>
            <p>
              Use the controls above to filter words by difficulty (beginner,
              intermediate, advanced) or topic. Toggle "Show Romaji" to display
              romanized pronunciations, or "Show Hint" (in Type mode) to see the
              first character and word length.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-1">Stats</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Streak</strong> — Consecutive correct answers. Resets on
                a wrong answer.
              </li>
              <li>
                <strong>Session</strong> — Correct/total for this visit.
              </li>
              <li>
                <strong>Total</strong> — Your all-time correct/seen count.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
