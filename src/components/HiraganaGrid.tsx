import React, { useState } from 'react';
import type { HiraganaCategory } from '../types';
import { hiraganaData } from '../data/hiraganaData';

interface HiraganaGridProps {
  onCharacterClick?: (character: string, romaji: string) => void;
  highlightedCharacters?: string[];
  showCategory?: HiraganaCategory;
}

const HiraganaGrid: React.FC<HiraganaGridProps> = ({ 
  onCharacterClick, 
  highlightedCharacters = [], 
  showCategory 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HiraganaCategory | 'all'>('all');
  
  const categoryToShow = showCategory || selectedCategory;
  
  const getCharactersToShow = () => {
    if (categoryToShow === 'all') {
      return {
        'Basic': hiraganaData.basic,
        'Dakuten': hiraganaData.dakuten,
        'Handakuten': hiraganaData.handakuten,
        'Combinations': hiraganaData.combinations
      };
    } else {
      return {
        [categoryToShow]: hiraganaData[categoryToShow]
      };
    }
  };

  const charactersToShow = getCharactersToShow();

  const CategoryButton: React.FC<{ category: HiraganaCategory | 'all'; label: string }> = ({ category, label }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        selectedCategory === category
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hiragana Characters</h2>
        {!showCategory && (
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryButton category="all" label="All" />
            <CategoryButton category="basic" label="Basic" />
            <CategoryButton category="dakuten" label="Dakuten" />
            <CategoryButton category="handakuten" label="Handakuten" />
            <CategoryButton category="combinations" label="Combinations" />
          </div>
        )}
      </div>

      <div className="space-y-8">
        {Object.entries(charactersToShow).map(([categoryName, characters]) => (
          <div key={categoryName} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
              {categoryName}
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {Object.entries(characters).map(([character, romaji]) => (
                <button
                  key={character}
                  onClick={() => onCharacterClick?.(character, romaji)}
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-200 
                    flex flex-col items-center justify-center p-2 hover:scale-105
                    ${highlightedCharacters.includes(character)
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                    }
                  `}
                >
                  <span className="text-2xl font-japanese font-bold mb-1">
                    {character}
                  </span>
                  <span className="text-xs text-gray-600 font-mono">
                    {romaji}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiraganaGrid;
