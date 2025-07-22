import type { PhrasesResponse } from '../types';
import phrasesJson from '../assets/japanese_phrases_json.json';

export const phrasesData: PhrasesResponse = phrasesJson as unknown as PhrasesResponse;
