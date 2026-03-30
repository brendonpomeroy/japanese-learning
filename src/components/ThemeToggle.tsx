import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        no-paper relative inline-flex shrink-0 items-center w-14 h-7 rounded-full transition-all duration-300 ease-in-out
        ${isDarkMode ? 'bg-indigo-900' : 'bg-amber-300'}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sliding thumb with icon inside */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 rounded-full! shadow-md
          flex items-center justify-center
          transform transition-all duration-300 ease-in-out
          ${
            isDarkMode
              ? 'translate-x-7 bg-indigo-950 border border-indigo-400/30'
              : 'translate-x-0.5 bg-white border border-amber-200'
          }
        `}
      >
        {/* Sun in thumb */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`
            absolute w-3.5 h-3.5 text-amber-500
            transition-all duration-300
            ${isDarkMode ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}
          `}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        {/* Moon in thumb */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`
            absolute w-3 h-3 text-indigo-300
            transition-all duration-300
            ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}
          `}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      <span className="sr-only">
        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
