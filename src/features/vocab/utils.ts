import type { VocabWord, WordProgress, DifficultyFilter, TopicFilter } from './types';
import { shuffle } from '../../utils/helpers';

export function getEligibleWords(
  words: VocabWord[],
  selectedTopic: TopicFilter,
  selectedDifficulty: DifficultyFilter
): VocabWord[] {
  let filtered = [...words];

  if (selectedTopic !== 'all') {
    filtered = filtered.filter((w) => w.topic === selectedTopic);
  }

  if (selectedDifficulty !== 'all') {
    filtered = filtered.filter((w) => w.difficulty === selectedDifficulty);
  }

  return filtered;
}

export function selectNextWord(
  eligibleWords: VocabWord[],
  progress: Record<string, WordProgress>,
  lastWordKey: string | null
): VocabWord | null {
  if (eligibleWords.length === 0) return null;

  // Get progress for all eligible words
  const wordsWithProgress = eligibleWords.map((word) => {
    const wordProgress = progress[word.word] || {
      seen: 0,
      correct: 0,
      incorrect: 0,
      lastSeenAt: null,
      lastResult: null,
      dueAt: null,
      intervalDays: 0,
      ease: 2.5,
      repetitions: 0,
    };
    return { word, progress: wordProgress };
  });

  // Separate new words (seen === 0) from practiced words
  const newWords = wordsWithProgress.filter((wp) => wp.progress.seen === 0);
  const practicedWords = wordsWithProgress.filter((wp) => wp.progress.seen > 0);

  // Prefer new words first
  if (newWords.length > 0) {
    // Filter out last word if possible
    const available = newWords.filter(
      (wp) => wp.word.word !== lastWordKey
    );
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)].word;
    }
    // If only last word available, use it
    return newWords[Math.floor(Math.random() * newWords.length)].word;
  }

  // Otherwise, prefer words that need practice
  if (practicedWords.length > 0) {
    // Calculate need score: (incorrect + 1) / (correct + 1) * (1 / (seen + 0.5))
    const scored = practicedWords.map((wp) => {
      const { correct, incorrect, seen } = wp.progress;
      const needScore =
        ((incorrect + 1) / (correct + 1)) * (1 / (seen + 0.5));
      return { ...wp, needScore };
    });

    // Sort by need score (descending) and avoid last word if possible
    scored.sort((a, b) => b.needScore - a.needScore);

    // Filter out last word if possible
    const available = scored.filter((s) => s.word.word !== lastWordKey);
    if (available.length > 0) {
      // Take top candidates and randomize among them (top 3 or all if less)
      const topCandidates = available.slice(
        0,
        Math.min(3, available.length)
      );
      return topCandidates[Math.floor(Math.random() * topCandidates.length)]
        .word;
    }

    // If only last word available, use it
    return scored[0].word;
  }

  // Fallback: random selection
  const available = eligibleWords.filter((w) => w.word !== lastWordKey);
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
}

export function generateMcqOptions(
  correctWord: VocabWord,
  eligibleWords: VocabWord[],
  count: number = 3
): VocabWord[] {
  const options: VocabWord[] = [correctWord];
  const used = new Set<string>([correctWord.word]);

  // Try to get distractors from same difficulty first
  const sameDifficulty = eligibleWords.filter(
    (w) => w.difficulty === correctWord.difficulty && !used.has(w.word)
  );

  // Shuffle and take from same difficulty
  const shuffledSame = shuffle(sameDifficulty);
  for (const word of shuffledSame) {
    if (options.length >= count) break;
    options.push(word);
    used.add(word.word);
  }

  // If we still need more, get from any eligible words
  if (options.length < count) {
    const remaining = eligibleWords.filter((w) => !used.has(w.word));
    const shuffled = shuffle(remaining);
    for (const word of shuffled) {
      if (options.length >= count) break;
      options.push(word);
      used.add(word.word);
    }
  }

  // Shuffle final options (so correct answer isn't always first)
  return shuffle(options);
}
