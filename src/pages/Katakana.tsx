import { useState } from 'react';
import { Link } from 'react-router-dom';
import KatakanaGrid from '../components/KatakanaGrid';
import ProgressTracker from '../components/ProgressTracker';
import { speakJapanese } from '../utils/helpers';
import type { HiraganaCategory } from '../types';

export const Katakana: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    HiraganaCategory | 'all'
  >('all');

  const categories: {
    key: HiraganaCategory | 'all';
    title: string;
    description: string;
  }[] = [
    {
      key: 'all',
      title: 'All Characters',
      description: 'View all katakana characters at once',
    },
    {
      key: 'basic',
      title: 'Basic Katakana',
      description: 'The 46 fundamental katakana characters',
    },
    {
      key: 'dakuten',
      title: 'Dakuten (゛)',
      description: 'Characters with voiced consonants',
    },
    {
      key: 'handakuten',
      title: 'Handakuten (゜)',
      description: 'P-sound characters',
    },
    {
      key: 'combinations',
      title: 'Combinations',
      description: 'Compound characters like キャ, シュ, リョ',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="text-accent-blue hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-flex items-center"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-primary mb-4">
          Katakana Characters
        </h1>
        <p className="text-lg text-secondary mb-6">
          Learn all katakana characters including basic, dakuten, handakuten,
          and combinations
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-surface-alt text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="bg-accent-blue/10 rounded-lg p-4 flex-1">
            <p className="text-accent-blue text-sm">
              <strong>Tip:</strong> Click on any character to hear its
              pronunciation
            </p>
          </div>
          <Link
            to="/tracing?kana=katakana"
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
          >
            ✍️ Practice Tracing
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <KatakanaGrid
            onCharacterClick={speakJapanese}
            showCategory={
              selectedCategory === 'all' ? undefined : selectedCategory
            }
          />
        </div>

        <div className="lg:col-span-1">
          <ProgressTracker />
        </div>
      </div>
    </div>
  );
};
