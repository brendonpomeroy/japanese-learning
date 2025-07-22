import React, { useState, useEffect } from 'react';
import PhraseCard from './PhraseCard';
import { phrasesData } from '../data/phrasesData';
import type { PhraseData, PhraseCategoryType } from '../types';

interface PhraseCategoryProps {
  category: PhraseCategoryType;
  onPlayAudio?: (text: string) => void;
}

const categoryTitles = {
  learning_japanese: 'Learning Japanese',
  asking_directions: 'Asking Directions', 
  meeting_new_people: 'Meeting New People'
};

const PhraseCategory: React.FC<PhraseCategoryProps> = ({ category, onPlayAudio }) => {
  const [phrases, setPhrases] = useState<PhraseData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load phrases from imported data instead of fetching
    const categoryPhrases = phrasesData.japanese_phrases[category] || [];
    console.log(`Loading phrases for category: ${category}`, categoryPhrases);
    console.log(phrasesData.japanese_phrases);
    setPhrases(categoryPhrases);
  }, [category]);

  const filteredPhrases = phrases.filter(phrase =>
    phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.japanese.includes(searchTerm) ||
    phrase.hiragana.includes(searchTerm) ||
    phrase.romaji.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {(category in categoryTitles
            ? categoryTitles[category as keyof typeof categoryTitles]
            : category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          )}
        </h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search phrases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {filteredPhrases.length} phrase{filteredPhrases.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="space-y-4">
        {filteredPhrases.map((phrase, index) => (
          <PhraseCard
            key={index}
            phrase={phrase}
            onPlayAudio={onPlayAudio}
          />
        ))}
      </div>

      {filteredPhrases.length === 0 && searchTerm && (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">No phrases found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default PhraseCategory;
