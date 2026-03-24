import React, { useState } from 'react';
import type { HiraganaCategory } from '../types';
import { hiraganaData } from '../data/hiraganaData';

interface HiraganaGridProps {
  onCharacterClick?: (character: string, romaji: string) => void;
  highlightedCharacters?: string[];
  showCategory?: HiraganaCategory;
}

// Traditional gojūon chart structure
// Each column is a consonant group, rows are vowels a, i, u, e, o
// Columns are ordered right-to-left in traditional Japanese order
const basicColumns: (string | null)[][] = [
  // Each sub-array is [a, i, u, e, o] for that consonant group
  ['あ', 'い', 'う', 'え', 'お'], // vowels
  ['か', 'き', 'く', 'け', 'こ'], // k
  ['さ', 'し', 'す', 'せ', 'そ'], // s
  ['た', 'ち', 'つ', 'て', 'と'], // t
  ['な', 'に', 'ぬ', 'ね', 'の'], // n
  ['は', 'ひ', 'ふ', 'へ', 'ほ'], // h
  ['ま', 'み', 'む', 'め', 'も'], // m
  ['や', null, 'ゆ', null, 'よ'], // y
  ['ら', 'り', 'る', 'れ', 'ろ'], // r
  ['わ', 'ゐ', null, 'ゑ', 'を'], // w
  ['ん', null, null, null, null], // n (standalone)
];

const dakutenColumns: (string | null)[][] = [
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'], // g
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], // z
  ['だ', 'ぢ', 'づ', 'で', 'ど'], // d
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'], // b
];

const handakutenColumns: (string | null)[][] = [
  ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], // p
];

// Combination chart: rows are consonant groups, columns are ya, yu, yo
const combinationRows: { label: string; chars: [string, string, string] }[] = [
  { label: 'k', chars: ['きゃ', 'きゅ', 'きょ'] },
  { label: 's', chars: ['しゃ', 'しゅ', 'しょ'] },
  { label: 'c', chars: ['ちゃ', 'ちゅ', 'ちょ'] },
  { label: 'n', chars: ['にゃ', 'にゅ', 'にょ'] },
  { label: 'h', chars: ['ひゃ', 'ひゅ', 'ひょ'] },
  { label: 'm', chars: ['みゃ', 'みゅ', 'みょ'] },
  { label: 'r', chars: ['りゃ', 'りゅ', 'りょ'] },
  { label: 'g', chars: ['ぎゃ', 'ぎゅ', 'ぎょ'] },
  { label: 'j', chars: ['じゃ', 'じゅ', 'じょ'] },
  { label: 'b', chars: ['びゃ', 'びゅ', 'びょ'] },
  { label: 'p', chars: ['ぴゃ', 'ぴゅ', 'ぴょ'] },
];

const vowelLabels = ['a', 'i', 'u', 'e', 'o'];

const allHiragana: Record<string, string> = {
  ...hiraganaData.basic,
  ...hiraganaData.dakuten,
  ...hiraganaData.handakuten,
  ...hiraganaData.combinations,
};

const HiraganaGrid: React.FC<HiraganaGridProps> = ({
  onCharacterClick,
  highlightedCharacters = [],
  showCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    HiraganaCategory | 'all'
  >('all');

  const categoryToShow = showCategory || selectedCategory;

  const getCharactersToShow = () => {
    if (categoryToShow === 'all') {
      return {
        Basic: hiraganaData.basic,
        Dakuten: hiraganaData.dakuten,
        Handakuten: hiraganaData.handakuten,
        Combinations: hiraganaData.combinations,
      };
    } else {
      return {
        [categoryToShow]: hiraganaData[categoryToShow],
      };
    }
  };

  const charactersToShow = getCharactersToShow();

  const CategoryButton: React.FC<{
    category: HiraganaCategory | 'all';
    label: string;
  }> = ({ category, label }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        selectedCategory === category
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  const CharacterCell: React.FC<{ character: string | null }> = ({
    character,
  }) => {
    if (!character) {
      return <div className="aspect-square" />;
    }
    const romaji = allHiragana[character] || '';
    return (
      <button
        onClick={() => onCharacterClick?.(character, romaji)}
        className={`
          aspect-square rounded-lg border-2 transition-all duration-200
          flex flex-col items-center justify-center p-2 hover:scale-105
          ${
            highlightedCharacters.includes(character)
              ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
          }
        `}
      >
        <span className="text-2xl font-japanese font-bold mb-1 dark:text-gray-100">
          {character}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">
          {romaji}
        </span>
      </button>
    );
  };

  const renderTraditionalChart = (
    columns: (string | null)[][],
    title: string
  ) => {
    // Render as rows (a, i, u, e, o) with columns reversed (right-to-left)
    const reversedColumns = [...columns].reverse();
    return (
      <div key={title} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
          {title}
        </h3>
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <tbody>
              {vowelLabels.map((vowel, rowIdx) => (
                <tr key={vowel}>
                  {reversedColumns.map((col, colIdx) => (
                    <td key={colIdx} className="p-1">
                      <CharacterCell character={col[rowIdx]} />
                    </td>
                  ))}
                  <td className="p-1 pl-3 text-sm text-gray-400 dark:text-gray-500 font-mono align-middle">
                    {vowel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCombinationChart = () => {
    const comboVowels = ['ya', 'yu', 'yo'];
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
          Combinations
        </h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                {comboVowels.map(v => (
                  <th
                    key={v}
                    className="p-1 text-sm text-gray-400 dark:text-gray-500 font-mono font-normal"
                  >
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {combinationRows.map(row => (
                <tr key={row.label}>
                  {row.chars.map(char => (
                    <td key={char} className="p-1">
                      <CharacterCell character={char} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getDesktopCharts = () => {
    const charts: React.ReactNode[] = [];
    if (categoryToShow === 'all' || categoryToShow === 'basic') {
      charts.push(renderTraditionalChart(basicColumns, 'Basic'));
    }
    if (categoryToShow === 'all' || categoryToShow === 'dakuten') {
      charts.push(renderTraditionalChart(dakutenColumns, 'Dakuten'));
    }
    if (categoryToShow === 'all' || categoryToShow === 'handakuten') {
      charts.push(renderTraditionalChart(handakutenColumns, 'Handakuten'));
    }
    if (categoryToShow === 'all' || categoryToShow === 'combinations') {
      charts.push(renderCombinationChart());
    }
    return charts;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Hiragana Characters
        </h2>
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

      {/* Desktop: Traditional chart layout */}
      <div className="hidden md:block space-y-8">{getDesktopCharts()}</div>

      {/* Mobile: Flat grid layout */}
      <div className="md:hidden space-y-8">
        {Object.entries(charactersToShow).map(([categoryName, characters]) => (
          <div key={categoryName} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
              {categoryName}
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
              {Object.entries(characters).map(([character, romaji]) => (
                <button
                  key={character}
                  onClick={() =>
                    onCharacterClick?.(character, romaji as string)
                  }
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-200
                    flex flex-col items-center justify-center p-2 hover:scale-105
                    ${
                      highlightedCharacters.includes(character)
                        ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                    }
                  `}
                >
                  <span className="text-2xl font-japanese font-bold mb-1 dark:text-gray-100">
                    {character}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">
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
