import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhraseCategory from '../components/PhraseCategory';
import { speakJapanese } from '../utils/helpers';
import type { PhraseCategoryType } from '../types';

const categories: {
  key: PhraseCategoryType;
  title: string;
  description: string;
}[] = [
  {
    key: 'learning_japanese',
    title: 'Learning Japanese',
    description: 'Essential phrases for classroom and conversation',
  },
  {
    key: 'asking_directions',
    title: 'Asking Directions',
    description: 'Navigate and find your way around',
  },
  {
    key: 'meeting_new_people',
    title: 'Meeting New People',
    description: 'Social introductions and getting to know others',
  },
  {
    key: 'shopping',
    title: 'Shopping',
    description: 'Useful phrases for shopping and transactions',
  },
  {
    key: 'dining',
    title: 'Dining',
    description: 'Ordering and discussing food and beverages',
  },
];

export const Phrases: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<PhraseCategoryType>('learning_japanese');

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
          Japanese Phrases
        </h1>
        <p className="text-lg text-secondary">
          Learn essential Japanese phrases organized by category
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-surface-alt text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      <PhraseCategory category={selectedCategory} onPlayAudio={speakJapanese} />
    </div>
  );
};
