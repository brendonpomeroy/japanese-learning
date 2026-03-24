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
              ? 'bg-accent-violet text-white'
              : 'bg-surface-alt text-secondary hover:bg-border'
          }`}
        >
          Hiragana
        </button>
        <button
          onClick={() => onKanaTypeChange('katakana')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            kanaType === 'katakana'
              ? 'bg-accent-violet text-white'
              : 'bg-surface-alt text-secondary hover:bg-border'
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
                ? 'bg-accent-blue text-white'
                : 'bg-surface-alt text-secondary hover:bg-border'
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
                    ? 'bg-accent-blue text-white ring-2 ring-accent-blue'
                    : mastery >= 80
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : mastery > 0
                        ? 'bg-warning/10 text-primary hover:bg-warning/20'
                        : 'bg-surface-alt text-primary hover:bg-border'
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
