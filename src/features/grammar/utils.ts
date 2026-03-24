import type {
  GrammarItem,
  GrammarMode,
  GrammarPack,
  GrammarProgress,
  ItemProgress,
  PackModeProgress,
} from './types';
import { createDefaultItemProgress } from './types';
import { shuffle } from '../../utils/helpers';

export function getPackModeProgress(
  progress: GrammarProgress,
  packId: string,
  mode: GrammarMode
): PackModeProgress {
  return progress[packId]?.[mode] ?? {};
}

export function selectSessionItems(
  items: GrammarItem[],
  progress: PackModeProgress,
  count: number = 10
): string[] {
  if (items.length === 0) return [];

  const itemsWithProgress = items.map(item => ({
    item,
    progress: progress[item.id] ?? createDefaultItemProgress(),
  }));

  // Separate into tiers: unseen, weak, mastered
  const unseen = itemsWithProgress.filter(ip => ip.progress.seen === 0);
  const weak = itemsWithProgress.filter(
    ip =>
      ip.progress.seen > 0 &&
      (ip.progress.streak === 0 ||
        ip.progress.correct / ip.progress.seen < 0.5)
  );
  const mastered = itemsWithProgress.filter(
    ip =>
      ip.progress.seen > 0 &&
      ip.progress.streak > 0 &&
      ip.progress.correct / ip.progress.seen >= 0.5
  );

  const queue: string[] = [];

  // Fill from highest to lowest priority
  for (const id of shuffle(unseen).map(ip => ip.item.id)) {
    if (queue.length >= count) break;
    queue.push(id);
  }
  for (const id of shuffle(weak).map(ip => ip.item.id)) {
    if (queue.length >= count) break;
    queue.push(id);
  }
  for (const id of shuffle(mastered).map(ip => ip.item.id)) {
    if (queue.length >= count) break;
    queue.push(id);
  }

  return shuffle(queue);
}

export function checkBuildAnswer(
  userTokens: string[],
  correctTokens: string[]
): boolean {
  if (userTokens.length !== correctTokens.length) return false;
  return userTokens.every((token, i) => token === correctTokens[i]);
}

export function checkFillAnswer(selected: string, answer: string): boolean {
  return selected === answer;
}

export function computePackStats(
  pack: GrammarPack,
  progress: GrammarProgress
): {
  totalItems: number;
  seenByMode: Record<GrammarMode, number>;
  correctByMode: Record<GrammarMode, number>;
} {
  const totalItems = pack.items.length;
  const modes: GrammarMode[] = ['build', 'correct', 'fill'];

  const seenByMode = {} as Record<GrammarMode, number>;
  const correctByMode = {} as Record<GrammarMode, number>;

  for (const mode of modes) {
    const modeProgress = getPackModeProgress(progress, pack.id, mode);
    let seen = 0;
    let correct = 0;
    for (const item of pack.items) {
      const ip: ItemProgress | undefined = modeProgress[item.id];
      if (ip && ip.seen > 0) seen++;
      if (ip && ip.correct > 0) correct++;
    }
    seenByMode[mode] = seen;
    correctByMode[mode] = correct;
  }

  return { totalItems, seenByMode, correctByMode };
}
