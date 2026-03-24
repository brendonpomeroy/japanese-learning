import { getHiraganaByCategory } from '../data/hiraganaData';
import { getKatakanaByCategory } from '../data/katakanaData';
import type { HiraganaCategory } from '../types';

export function getCharacterList(
  kanaType: 'hiragana' | 'katakana',
  category: HiraganaCategory
): [string, string][] {
  const data =
    kanaType === 'hiragana'
      ? getHiraganaByCategory(category)
      : getKatakanaByCategory(category);
  return Object.entries(data) as [string, string][];
}
