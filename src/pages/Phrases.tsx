import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhraseCategory from '../components/PhraseCategory';
import type { PhraseCategory as PhraseCategoryType } from '../types';

const categories: { key: PhraseCategoryType; title: string; description: string }[] = [
  {
    key: 'learning_japanese',
    title: 'Learning Japanese',
    description: 'Essential phrases for classroom and conversation'
  },
  {
    key: 'asking_directions',
    title: 'Asking Directions',
    description: 'Navigate and find your way around'
  },
  {
    key: 'meeting_new_people',
    title: 'Meeting New People',
    description: 'Social introductions and getting to know others'
  }
];

function Phrases() {
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategoryType>('learning_japanese');

  const handlePlayAudio = (text: string) => {
    // Simple text-to-speech implementation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/" 
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-flex items-center"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Japanese Phrases</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn essential Japanese phrases organized by category
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      <PhraseCategory 
        category={selectedCategory}
        onPlayAudio={handlePlayAudio}
      />
    </div>
  );
}

export default Phrases;
