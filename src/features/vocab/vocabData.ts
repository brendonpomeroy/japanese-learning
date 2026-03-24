import vocabJson from '../../data/vocab.json';
import type { VocabWord, VocabData } from './types';

export const vocabData: VocabData = vocabJson as VocabData;

export const vocabWords: VocabWord[] = vocabData.words;

export const getTopics = (): string[] => {
  const topics = new Set<string>();
  vocabWords.forEach(word => {
    topics.add(word.topic);
  });
  return Array.from(topics).sort();
};
