import React, { useState, useEffect } from 'react';
import PhraseCard from './PhraseCard';
import type { PhraseData, PhraseCategory as PhraseCategoryType } from '../types';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        setLoading(true);
        const response = await fetch('/japanese_phrases_json.json');
        if (!response.ok) {
          throw new Error('Failed to load phrases');
        }
        const data = await response.json();
        setPhrases(data.japanese_phrases[category] || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPhrases();
  }, [category]);

  const filteredPhrases = phrases.filter(phrase =>
    phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.japanese.includes(searchTerm) ||
    phrase.hiragana.includes(searchTerm) ||
    phrase.romaji.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Error loading phrases: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {categoryTitles[category]}
        </h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search phrases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="text-sm text-gray-600 mb-4">
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No phrases found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default PhraseCategory;
