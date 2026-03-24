import React, { useState } from 'react';
import type { HiraganaCategory } from '../types';

interface KanaGridProps {
  title: string;
  onCharacterClick?: (character: string, romaji: string) => void;
  highlightedCharacters?: string[];
  showCategory?: HiraganaCategory;
  allCharacters: Record<string, string>;
  basicColumns: (string | null)[][];
  dakutenColumns: (string | null)[][];
  handakutenColumns: (string | null)[][];
  combinationRows: { label: string; chars: [string, string, string] }[];
}

const vowelIndices = [0, 1, 2, 3, 4]; // a, i, u, e, o

const KanaGrid: React.FC<KanaGridProps> = ({
  title,
  onCharacterClick,
  highlightedCharacters = [],
  showCategory,
  allCharacters,
  basicColumns,
  dakutenColumns,
  handakutenColumns,
  combinationRows,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    HiraganaCategory | 'all'
  >('all');

  const categoryToShow = showCategory || selectedCategory;

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
    const romaji = allCharacters[character] || '';
    return (
      <button
        onClick={() => onCharacterClick?.(character, romaji)}
        className={`
          aspect-square w-full max-w-16 max-h-16 rounded-lg border-2 transition-all duration-200
          flex flex-col items-center justify-center p-1 hover:scale-105
          ${
            highlightedCharacters.includes(character)
              ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
          }
        `}
      >
        <span className={`font-japanese font-bold mb-1 dark:text-gray-100 whitespace-nowrap break-keep ${character.length > 1 ? 'text-sm' : 'text-2xl'}`}>
          {character}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-300 font-mono whitespace-nowrap">
          {romaji}
        </span>
      </button>
    );
  };

  const renderTraditionalChart = (
    columns: (string | null)[][],
    chartTitle: string
  ) => {
    const reversedColumns = [...columns].reverse();
    return (
      <div key={chartTitle} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
          {chartTitle}
        </h3>
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <tbody>
              {vowelIndices.map(rowIdx => (
                <tr key={rowIdx}>
                  {reversedColumns.map((col, colIdx) => (
                    <td key={colIdx} className="p-1">
                      <CharacterCell character={col[rowIdx]} />
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

  const renderCombinationChart = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
          Combinations
        </h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
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

  const MobileChart: React.FC<{ chartTitle: string; columns: (string | null)[][] }> = ({ chartTitle, columns }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
        {chartTitle}
      </h3>
      <div className="grid grid-cols-5 gap-1.5">
        {columns.flatMap((col, colIdx) =>
          col.map((char, rowIdx) => {
            if (!char) {
              return <div key={`${colIdx}-${rowIdx}`} className="aspect-square max-w-16 max-h-16" />;
            }
            const romaji = allCharacters[char] || '';
            return (
              <button
                key={char}
                onClick={() => onCharacterClick?.(char, romaji)}
                className={`
                  aspect-square max-w-16 max-h-16 rounded-lg border-2 transition-all duration-200
                  flex flex-col items-center justify-center p-1 hover:scale-105
                  ${
                    highlightedCharacters.includes(char)
                      ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                  }
                `}
              >
                <span className="font-japanese font-bold mb-0.5 dark:text-gray-100 text-lg">
                  {char}
                </span>
                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-mono whitespace-nowrap">
                  {romaji}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {title}
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

      {/* Mobile: Grid layout with proper vowel alignment */}
      <div className="md:hidden space-y-8">
        {(categoryToShow === 'all' || categoryToShow === 'basic') && (
          <MobileChart chartTitle="Basic" columns={basicColumns} />
        )}
        {(categoryToShow === 'all' || categoryToShow === 'dakuten') && (
          <MobileChart chartTitle="Dakuten" columns={dakutenColumns} />
        )}
        {(categoryToShow === 'all' || categoryToShow === 'handakuten') && (
          <MobileChart chartTitle="Handakuten" columns={handakutenColumns} />
        )}
        {(categoryToShow === 'all' || categoryToShow === 'combinations') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
              Combinations
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {combinationRows.flatMap(row =>
                row.chars.map(char => {
                  const romaji = allCharacters[char] || '';
                  return (
                    <button
                      key={char}
                      onClick={() => onCharacterClick?.(char, romaji)}
                      className={`
                        aspect-square max-w-16 max-h-16 rounded-lg border-2 transition-all duration-200
                        flex flex-col items-center justify-center p-1 hover:scale-105
                        ${
                          highlightedCharacters.includes(char)
                            ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                        }
                      `}
                    >
                      <span className="font-japanese font-bold mb-0.5 dark:text-gray-100 whitespace-nowrap break-keep text-xs">
                        {char}
                      </span>
                      <span className="text-[10px] text-gray-600 dark:text-gray-300 font-mono whitespace-nowrap">
                        {romaji}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanaGrid;
