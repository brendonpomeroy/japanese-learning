import { useMemo } from 'react';
import { getCharacterList } from '../utils/kanaHelpers';
import type { HiraganaCategory } from '../types';

type KanaType = 'hiragana' | 'katakana';

interface TracingCharacterPickerProps {
  kanaType: KanaType;
  onKanaTypeChange: (type: KanaType) => void;
  category: HiraganaCategory;
  onCategoryChange: (category: HiraganaCategory) => void;
  currentCharacter: string;
  onCharacterSelect: (character: string, romaji: string) => void;
  characterMastery: Record<string, number>;
}

const categories: { key: HiraganaCategory; label: string }[] = [
  { key: 'basic', label: 'Basic' },
  { key: 'dakuten', label: 'Dakuten' },
  { key: 'handakuten', label: 'Handakuten' },
  { key: 'combinations', label: 'Combinations' },
];

export function TracingCharacterPicker({
  kanaType,
  onKanaTypeChange,
  category,
  onCategoryChange,
  currentCharacter,
  onCharacterSelect,
  characterMastery,
}: TracingCharacterPickerProps) {
  const characters = useMemo(() => {
    return getCharacterList(kanaType, category);
  }, [kanaType, category]);

  return (
    <div className="space-y-3">
      {/* Kana type toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onKanaTypeChange('hiragana')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            kanaType === 'hiragana'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Hiragana
        </button>
        <button
          onClick={() => onKanaTypeChange('katakana')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            kanaType === 'katakana'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Katakana
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              category === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Character strip */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-min px-1">
          {characters.map(([char, romaji]) => {
            const mastery = characterMastery[char] || 0;
            const isActive = char === currentCharacter;
            return (
              <button
                key={char}
                onClick={() => onCharacterSelect(char, romaji)}
                className={`flex flex-col items-center min-w-[3rem] px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : mastery >= 80
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : mastery > 0
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-gray-800 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={`${char} (${romaji})`}
              >
                <span className="text-lg font-japanese">{char}</span>
                <span className="text-[10px] opacity-70">{romaji}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
