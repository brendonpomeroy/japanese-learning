import React from 'react';
import type { HiraganaCategory } from '../types';
import { hiraganaData } from '../data/hiraganaData';
import KanaGrid from './KanaGrid';

interface HiraganaGridProps {
  onCharacterClick?: (character: string, romaji: string) => void;
  highlightedCharacters?: string[];
  showCategory?: HiraganaCategory;
}

const basicColumns: (string | null)[][] = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', null, 'ゆ', null, 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'ゐ', null, 'ゑ', 'を'],
  ['ん', null, null, null, null],
];

const dakutenColumns: (string | null)[][] = [
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
];

const handakutenColumns: (string | null)[][] = [['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']];

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

const allHiragana: Record<string, string> = {
  ...hiraganaData.basic,
  ...hiraganaData.dakuten,
  ...hiraganaData.handakuten,
  ...hiraganaData.combinations,
};

const HiraganaGrid: React.FC<HiraganaGridProps> = props => (
  <KanaGrid
    title="Hiragana Characters"
    allCharacters={allHiragana}
    basicColumns={basicColumns}
    dakutenColumns={dakutenColumns}
    handakutenColumns={handakutenColumns}
    combinationRows={combinationRows}
    {...props}
  />
);

export default HiraganaGrid;
