import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-200 
        ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}
      `}
      aria-label="Toggle dark mode"
    >
      <span
        className={`
          absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 
          ${isDarkMode ? 'translate-x-3' : '-translate-x-3'}
        `}
      />
      <span className="sr-only">
        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
