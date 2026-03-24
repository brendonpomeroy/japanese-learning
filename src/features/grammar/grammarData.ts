import grammarJson from '../../assets/grammar.json';
import type { GrammarDataFile, GrammarPack, GrammarItem } from './types';

export const grammarData: GrammarDataFile = grammarJson as GrammarDataFile;

export const grammarPacks: GrammarPack[] = grammarData.packs;

export const getPackById = (packId: string): GrammarPack | undefined => {
  return grammarPacks.find(pack => pack.id === packId);
};

export const getPackItems = (packId: string): GrammarItem[] => {
  const pack = getPackById(packId);
  return pack ? pack.items : [];
};
