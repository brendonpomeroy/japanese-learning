import grammarJson from '../../assets/grammar.json';
import type { GrammarDataFile, GrammarMode, GrammarPack, GrammarItem } from './types';

export const grammarData: GrammarDataFile = grammarJson as GrammarDataFile;

export const grammarPacks: GrammarPack[] = grammarData.packs;

export const getPackById = (packId: string): GrammarPack | undefined => {
  return grammarPacks.find(pack => pack.id === packId);
};

export const getPackItems = (packId: string): GrammarItem[] => {
  const pack = getPackById(packId);
  return pack ? pack.items : [];
};

export const getPacksWithMode = (
  mode: GrammarMode
): GrammarPack[] => {
  return grammarPacks.filter(pack => pack.supportedModes.includes(mode));
};

export const getItemsForPacks = (
  packIds: string[],
  mode: GrammarMode
): Array<{ item: GrammarItem; packId: string }> => {
  const result: Array<{ item: GrammarItem; packId: string }> = [];
  for (const packId of packIds) {
    const pack = getPackById(packId);
    if (!pack) continue;
    for (const item of pack.items) {
      if (item[mode]) {
        result.push({ item, packId });
      }
    }
  }
  return result;
};
