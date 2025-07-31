import emojiData from '../assets/emojis.json';

export interface EmojiItem {
  emoji: string;
  english: string;
  japanese: string;
  hiragana: string;
  romaji: string;
}

export const getAllEmojis = (): EmojiItem[] => {
  return emojiData as EmojiItem[];
};

export const getRandomEmoji = (): EmojiItem => {
  const emojis = getAllEmojis();
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

export const getRandomEmojis = (count: number): EmojiItem[] => {
  const emojis = getAllEmojis();
  const shuffled = [...emojis].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getEmojiByEmoji = (emoji: string): EmojiItem | undefined => {
  return getAllEmojis().find(item => item.emoji === emoji);
};
