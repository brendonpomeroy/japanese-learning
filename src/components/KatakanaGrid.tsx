import React from 'react';
import type { HiraganaCategory } from '../types';
import { katakanaData } from '../data/katakanaData';
import KanaGrid from './KanaGrid';

interface KatakanaGridProps {
  onCharacterClick?: (character: string, romaji: string) => void;
  highlightedCharacters?: string[];
  showCategory?: HiraganaCategory;
}

const basicColumns: (string | null)[][] = [
  ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ['カ', 'キ', 'ク', 'ケ', 'コ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ['ヤ', null, 'ユ', null, 'ヨ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  ['ワ', 'ヰ', null, 'ヱ', 'ヲ'],
  ['ン', null, null, null, null],
];

const dakutenColumns: (string | null)[][] = [
  ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
  ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
  ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'],
  ['バ', 'ビ', 'ブ', 'ベ', 'ボ'],
];

const handakutenColumns: (string | null)[][] = [
  ['パ', 'ピ', 'プ', 'ペ', 'ポ'],
];

const combinationRows: { label: string; chars: [string, string, string] }[] = [
  { label: 'k', chars: ['キャ', 'キュ', 'キョ'] },
  { label: 's', chars: ['シャ', 'シュ', 'ショ'] },
  { label: 'c', chars: ['チャ', 'チュ', 'チョ'] },
  { label: 'n', chars: ['ニャ', 'ニュ', 'ニョ'] },
  { label: 'h', chars: ['ヒャ', 'ヒュ', 'ヒョ'] },
  { label: 'm', chars: ['ミャ', 'ミュ', 'ミョ'] },
  { label: 'r', chars: ['リャ', 'リュ', 'リョ'] },
  { label: 'g', chars: ['ギャ', 'ギュ', 'ギョ'] },
  { label: 'j', chars: ['ジャ', 'ジュ', 'ジョ'] },
  { label: 'b', chars: ['ビャ', 'ビュ', 'ビョ'] },
  { label: 'p', chars: ['ピャ', 'ピュ', 'ピョ'] },
];

const allKatakana: Record<string, string> = {
  ...katakanaData.basic,
  ...katakanaData.dakuten,
  ...katakanaData.handakuten,
  ...katakanaData.combinations,
};

const KatakanaGrid: React.FC<KatakanaGridProps> = (props) => (
  <KanaGrid
    title="Katakana Characters"
    allCharacters={allKatakana}
    basicColumns={basicColumns}
    dakutenColumns={dakutenColumns}
    handakutenColumns={handakutenColumns}
    combinationRows={combinationRows}
    {...props}
  />
);

export default KatakanaGrid;
